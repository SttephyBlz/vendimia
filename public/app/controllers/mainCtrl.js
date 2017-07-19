angular.module('mainController', ['ngMaterial', 'mainServices', 'ui.bootstrap'])

  .controller('mainCtrl', function($scope) {
    $scope.date = new Date();
  })

  .controller('clientsAutocompleteCtrl', function($scope, $timeout, ClientsRetriever) {

    ClientsRetriever.all().then(function(data) {
      if(data.data.success){
        $scope.clientes = data.data.clients;
      }
    });

    $scope.onSelect = function ($item, $model, $label) {
      $scope.item_selected = 'RFC: '+$item.rfc;
    };
  })

  .controller('articlesAutocompleteCtrl', function($scope, $timeout, ArticlesRetriever) {

    ArticlesRetriever.all().then(function(data) {
      if(data.data.success){
        $scope.articles = data.data.articles;
      }
    });
  })

  .controller('saleCtrl', function($scope, $location, $timeout, NextSale, Config, saveSale, ArticlesRetriever) {
    var app = this;

    //To show rows
    app.totales   = false;
    app.abonos    = false;
    app.siguiente = false;
    app.guardar   = false;
    app.errorMsg  = false;

    //Folio de nueva venta
    NextSale.n().then(function(data) {
      if(data.data.success){
        app.folio = data.data.nextid;
      }
    });

    /* =========== Tabla artículos seleccionados ===========*/
    app.rows = [];
    app.counter = 1;

    app.addArticle = function(art) {
      //No campo vacío
      if(art != undefined){
        //Sólo artículos que existan
        if(art.articleId != undefined){
          //Sólo artículos con existencia => 1
          if(art.existencia>0){
            var result = {
              id: art.articleId,
              descripcion: art.descripcion,
              modelo: art.modelo,
              precio: art.precio,
              existencia: art.existencia
            }

            app.rows.push(result);
            app.total = a('');
            app.siguiente=true;
            app.totales= true;
            app.counter++;
          }else{
            app.errorMsg = 'El artículo seleccionado no cuenta con existencia, favor de verificar.';
            $timeout(function() {
              app.errorMsg = false;
            }, 5000);
          }
        }
      }
    }

    app.removeArticle = function(index){
      var newArticleList=[];
      angular.forEach(app.rows,function(article, arrIndex){
        if(arrIndex != index){
          newArticleList.push(article);
        }
      });

      var query = {
        id: app.rows[index].id,
        existencia: app.rows[index].existencia
      };

      ArticlesRetriever.newExistencia(query).then(function(data){
        if(data.data.success){
          console.log(data.data.message);
        }
      });
      console.log(app.rows[index]);

      app.rows=newArticleList;
      if(app.rows.length === 0){
        app.siguiente = false;
        app.totales = false;
      }
    };

    /* =========== Cálculos ===========*/
    $scope.calculate= function(e,i, art){
      Config.conf().then(function(data) {
        $scope.tasa_financiamiento = data.data.config.tasa_financiamiento;
        $scope.plazo_maximo = data.data.config.plazo_maximo;
        $scope.porciento_enganche = data.data.config.porciento_enganche;

        if(e.target.value != ''){
          e.target.disabled = true;
          var query = {
            id: art.id,
            existencia: (art.existencia-(e.target.value*1))
          };

          ArticlesRetriever.newExistencia(query).then(function(data){
            if(data.data.success){
              console.log(data.data.message);
            }
          });
        }

        app.cantidad = e.target.value;

        if( (app.cantidad > 0) && (app.cantidad <= art.existencia)){
          //Get number with 2 decimals
          art.newprecio = (art.precio*(1+($scope.tasa_financiamiento*$scope.plazo_maximo)/100)).toFixed(2);
          art.importe = (art.newprecio * app.cantidad).toFixed(2);
          art.cantidad = app.cantidad;

          app.total = function(items){
            var obj = {};
            var total = 0;
            var eng = 0;
            var bon = 0;
            for(var i = 0; i < items.length; i++){
                var product = items[i];
                total+= (product.importe)*1;
            }

            eng = (($scope.porciento_enganche/100)*total).toFixed(2);
            bon = (eng * (($scope.tasa_financiamiento*$scope.plazo_maximo)/100)).toFixed(2);
            total_ad = (total - eng - bon).toFixed(2);

            var obj2 = [];

            var precio_contado = total_ad/(1+(($scope.tasa_financiamiento*$scope.plazo_maximo)/100));

            for(var i=1; i<=4; i++){
              var tot_a_pagar = precio_contado * (1+($scope.tasa_financiamiento*(i*3))/100);
              var impa = tot_a_pagar/(i*3);
              var impao = total_ad-tot_a_pagar;

              var o = {
                plazo: i*3,
                importe_abono: impa.toFixed(2),
                total_adeudo: tot_a_pagar.toFixed(2),
                importe_ahorro: impao.toFixed(2)
              };

              obj2.push(o);
            }

            $scope.o = obj2;

            obj = {
              total: total_ad,
              enganche: eng,
              bonificacion: bon
            };

            return obj;
          };

        }else{
          art.newprecio = '';
          art.importe = '';
        }
      });
    };

    function a(i){
      var obj = {};
      var total = 0;
      var eng = 0;
      var bon = 0;
      obj = {
        total: total,
        enganche: eng,
        bonificacion: bon
      };
    };

    /* =========== Validación del botón siguiente ===========*/

    app.siguiente1 = function() {

      if(app.selected != undefined){
        var u = [];
        for(var i =0; i < app.rows.length; i++){
          if(app.rows[i].newprecio === '' || (!app.rows[i].hasOwnProperty('newprecio'))){
            u.push(app.rows[i].newprecio);
          }
        };

        if(u.length == 0){
          app.siguiente = false;
          app.abonos = true;
          app.guardar = true;
        }else{
          app.errorMsg = 'Los datos ingresados no son correctos, favor de verificar.';
          $timeout(function() {
            app.errorMsg = false;
          }, 5000);
        }
      }
    };

    /* =========== Boton guardar ===========*/

    app.save = function(r, o) {
      if(r != undefined){

        /*
          Obtener las cantidades de los productos seleccionados.
          Sumarlos por ID.
          Resultado: JSON con las cantidades de los productos ya sumados.
        */
        /*
        var obj1 = [];
        for(var i=0; i< app.rows.length; i++){
          var aux = {
            id: app.rows[i].id,
            cantidad: app.rows[i].cantidad,
            existencia: app.rows[i].existencia
          }
          obj1.push(aux);
        }
        console.log(obj1);

        var obj2 = {
          rows: obj1
        }
          console.log(obj2);

        var newObj = {};
        for(i in obj2['rows']){
         var item = obj2['rows'][i];
         console.log(item);
          if(newObj[item.id] === undefined){
              newObj[item.id] = 0;
          }
          newObj[item.id] += item.cantidad*1;

        }
        console.log(newObj);
        var result = {};
        result.rows = [];
        for(i in newObj){
          for(var a =0; a<obj1.length;a++){
            if(obj1[a].id==i){
              if(obj1[a].existencia>=newObj[i]){
                result.rows.push({'id':i*1,'cantidad':newObj[i], 'existencia': obj1[a].existencia});
              }else{
                result.rows.push({'id':i*1,'cantidad':newObj[i], 'existencia': 0});
              }
            }
          }
        }

*/

        var abonosmensuales = o[r]; //abono mensual seleccionado
        var d = new Date();
        var regData = {
          client_id: app.selected.clientId,
          total: abonosmensuales.total_adeudo,
          abono: abonosmensuales.importe_abono,
          plazo: abonosmensuales.plazo,
          fecha: d+''
        };

        saveSale.create(regData).then(function(data){
          if(data.data.success){
            app.successMsg = 'Bien Hecho, Tu venta ha sido registrada correctamente';
          }
        });
      }else{
        app.errorMsg = 'Debe seleccionar un plazo para realizar el pago de su compra.';
        $timeout(function() {
          app.errorMsg = false;
        }, 5000);
      }
    };


    app.si = function(){
      $location.path('/');
    }
  })

;
