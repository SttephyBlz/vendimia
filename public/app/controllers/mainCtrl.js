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

  .controller('saleCtrl', function($scope, NextSale, Config, saveSale) {
    var app = this;

    //To show rows
    app.totales   = false;
    app.abonos    = false;
    app.siguiente = false;
    app.guardar   = false;

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

        app.cantidad = e.target.value;
        if( (app.cantidad > 0) && (app.cantidad <= art.existencia)){
          //Get number with 2 decimals
          art.newprecio = (art.precio*(1+($scope.tasa_financiamiento*$scope.plazo_maximo)/100)).toFixed(2);
          art.importe = (art.newprecio * app.cantidad).toFixed(2);

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
          console.log('Mensaje: Los datos ingresados no son correctos, favor de verificar');
        }
      }
    };

    /* =========== Boton guardar ===========*/

    app.save = function(r, o) {
      if(r != undefined){
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
            console.log(data.data.message);
          }else{
            console.log(data.data.message);
          }
        });
      }
    };
  })

;