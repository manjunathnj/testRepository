sap.ui.controller("com.ui5.project.zcvp_prodconfig.ProdCatalog", {

	/**
	 * Called when a controller is instantiated and its View controls (if
	 * available) are already created. Can be used to modify the View before it
	 * is displayed, to bind event handlers and do other one-time
	 * initialization.
	 * 
	 * @memberOf test01.Test01
	 */
	onInit : function() {

		that = this;
		var oTable = this.getView().byId('idMtree');
		var sData;
		var oomodel = new sap.ui.model.odata.v2.ODataModel(
				"/sap/opu/odata/SAP/ZCVP_ODATA_PRODCONFIG_SRV/", {
					json : true,
					useBatch : true
				});
		/* this.getView().setModel(oomodel); */

		oTable.setModel(oomodel);
		oTable.bindRows({
			path : '/ProdCatSet',
			parameters : {
				countMode : 'Inline',
				navigation : {
					'ProdCatSet' : 'ChildNodes'
				}
			}
		});
		  this.router = sap.ui.core.UIComponent.getRouterFor(this);		
	},

	onPrjDesc:function(evt){
		this.getView().byId('idProject').setValue(evt.getSource().getProperty('text'));
	},
	fnLinkVisible:function(v1){
		
		return (v1 == 'Y')?true:false;
	},
	onSubmit:function(){
		var p = this.getView().byId('idPage1');
		p.setBusy(true);
		jQuery.sap.delayedCall(2000,this,function(){
		var sValue = this.getView().byId('idProject').getValue();
	    var res = sValue.split("-");
	    sValue = res[0];
	    p.setBusy(false);
		if(sValue === ''){
			alert('Please Enter or Choose Product');
		}else{
			this.router.navTo('PD',{PrjId:sValue});
		}
		});
	},
	
	logoff : function(oEvent) {

		var that = this;
        jQuery.ajax({
             url:"/sap/public/bc/icf/logoff?redirecturl=/sap/bc/ui5_ui5/sap/zcvp_prodconfig/index.html",
             async:false
           }).complete(function (evt){       
            
             location.reload(true);
             window.location.assign("/sap/bc/ui5_ui5/sap/zcvp_prodconfig/index.html");
           });		
        
	}

/*	logoff:function(oEvent){
		$.ajax({  
			type: "GET",  
			url: "/sap/public/bc/icf/logoff",  //Clear SSO cookies: SAP Provided service to do that  
		}).done(function(data){ //Now clear the authentication header stored in the browser  
			if (!document.execCommand("ClearAuthenticationCache")) {  
				//"ClearAuthenticationCache" will work only for IE. Below code for other browsers  
				$.ajax({  
					type: "GET",  
					url: "/sap/public/bc/icf/logoff", //any URL to a Gateway service  
					username: '', //dummy credentials: when request fails, will clear the authentication header  
					password: '',  
					statusCode: { 401: function() {  
						//This empty handler function will prevent authentication pop-up in chrome/firefox  
					} },  
					error: function() {  
						//alert('reached error of wrong username password')  
					}  
				});  
			}  
		});
		var myVar = setInterval(function(oEvent){
			window.location.replace("/sap/bc/ui5_ui5/sap/zcvp_prodconfig/index.html");}, 100);
	}	*/

/**
 * Similar to onAfterRendering, but this hook is invoked before the controller's
 * View is re-rendered (NOT before the first rendering! onInit() is used for
 * that one!).
 * 
 * @memberOf test01.Test01
 */
// onBeforeRendering: function() {
//
// },
/**
 * Called when the View has been rendered (so its HTML is part of the document).
 * Post-rendering manipulations of the HTML could be done here. This hook is the
 * same one that SAPUI5 controls get after being rendered.
 * 
 * @memberOf test01.Test01
 */
// onAfterRendering: function() {
//
// },
/**
 * Called when the Controller is destroyed. Use this one to free resources and
 * finalize activities.
 * 
 * @memberOf test01.Test01
 */
// onExit: function() {
//
// }
});