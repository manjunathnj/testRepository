(function() {
	"use strict";

	jQuery.sap.declare("com.ui5.project.Component");

	sap.ui.core.UIComponent.extend("com.ui5.project.Component", {

		metadata : {
			routing : {
				config : {
					viewType : "XML",
					viewPath : "com.ui5.project.zcvp_prodconfig",
					targetControl : "app",
					clearTarget : true,
					transition : "slide"
				},
				routes : [
/*					{
						pattern : "",
						name : "login",
						view : "Login",
						viewType : "XML",
						viewPath : "com.ui5.project.zcvp_prodconfig",
						targetAggregation : "pages"
					},*/
					{
						pattern : "",
						name : "intial",
						view : "ProdCatalog",
						viewType : "XML",
						viewPath : "com.ui5.project.zcvp_prodconfig",
						targetAggregation : "pages"
					},{
						pattern : "PD/{PrjId}",
						name : "PD",
						view : "Prodconfig",
						viewType : "XML",
						viewPath : "com.ui5.project.zcvp_prodconfig",
						targetAggregation : "pages"
					},{
						pattern :"od",
						name : "OD",
						view : "OrderDetails",
						viewType : "XML",
						viewPath : "com.ui5.project.zcvp_prodconfig",
						targetAggregation : "pages"
					}

					]
			}
		},

		init : function() {
			jQuery.sap.require("sap.m.routing.RouteMatchedHandler");

			sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
			var router = this.getRouter();
			this.routeHandler = new sap.m.routing.RouteMatchedHandler(router);
			router.initialize();
		},

		createContent : function() {

			// create root view
			var oView = sap.ui.view({
				id : "idViewRoot",
				viewName : "com.ui5.project.zcvp_prodconfig.appView",
				type : "XML",
				viewData : {
					component : this
				}
			});


      var oi18Model = new sap.ui.model.resource.ResourceModel({bundleUrl:"i18n/resource.properties"});
      oView.setModel(oi18Model,"rModel");

      // set device model
      var deviceModel = new sap.ui.model.json.JSONModel({
        isPhone : jQuery.device.is.phone,
        listMode : (jQuery.device.is.phone) ? "None"
            : "SingleSelectMaster",
        listItemType : (jQuery.device.is.phone) ? "Active" : "Inactive"
      });
      deviceModel.setDefaultBindingMode("OneWay");
      oView.setModel(deviceModel, "device");
      var sUrl = "/sap/opu/odata/SAP/ZCVP_ODATA_PRODCONFIG_SRV/";   
      var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
      oModel.setDefaultCountMode("None");
      sap.ui.getCore().setModel(oModel, "serviceModel");
      oView.setModel(oModel);

      return oView;
    }
  });

}());