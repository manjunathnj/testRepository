sap.ui.controller("com.ui5.project.zcvp_prodconfig.OrderDetails", {

	onInit: function() {
		 this.router = sap.ui.core.UIComponent.getRouterFor(this);
		// this.router.attachRouteMatched(this._onObjectMatched, this);	
		 this.OrderModel();
	},
	home:function(){
		window.location.reload();
		this.router.navTo('intial');
	},
	onPdf:function(evt){
		 var sModel,postData,sPath,bDialog;
       sModel = sap.ui.getCore().getModel('serviceModel');
      /*sContext = evt.getParameter('selectedContexts');*/
      postData = this.getView().getModel('oModel').getData(); 
      html = new sap.ui.core.HTML();
      oDialog = new sap.m.Dialog();
      
      bDialog = new sap.m.BusyDialog();
      bDialog.open();
      for(var i in postData.INFOTOPROD){
    	  delete postData.INFOTOPROD[i]['__metadata'];
       };
             
     
       sPath = "/PCCustInfoSet";
	   var date = new Date();
	   var timestamp = date.getTime();
	   var timestamp1 = timestamp.toString() + "_pdf";
	   postData.INFOTOPROD[0].timeStamp = timestamp1;       
       sModel.create(sPath,postData,{
    	   success:function(oData,oResponse){
    		   /*var pdfURL = oData.PDFRESULT.results[0].URL;
    		   var pdfURL = oData.SplInstr;
    		   window.open(pdfURL);
    		   bDialog.close();*/
			   sPath = "/PCPDFDisplaySet("+"'"+timestamp1+"'"+")/$value";
			   sModel.read(sPath,null,null,true,function(data,response){
		       var pdfURL = response.requestUri;
               html.setContent("<iframe src=" + pdfURL + " width='700' height='700'></iframe>");
               oDialog.addContent(html);
                oDialog.open();
                oDialog.close();
                bDialog.close();
            },
            function(oData){
             sap.m.MessageBox.show(
          "Something went wrong", {
              icon: sap.m.MessageBox.Icon.INFORMATION,
              title: "Information"
          }
        );
              bDialog.close();
            });
			    		   

    	   },error:function(oResponse){
    		   sap.m.MessageBox.show(
    				   "Something went wrong...", {
    					   icon: sap.m.MessageBox.Icon.INFORMATION,
    					   title: "Information"
    				   }
    		   );
    		   bDialog.close();

    	   }

       });
   
	},

	onText:function(evt){
		 var sModel,postData,sPath,bDialog;
      sModel = sap.ui.getCore().getModel('serviceModel');
     /*sContext = evt.getParameter('selectedContexts');*/
     postData = this.getView().getModel('oModel').getData(); 
     html = new sap.ui.core.HTML();
     oDialog = new sap.m.Dialog();
     
     bDialog = new sap.m.BusyDialog();
     bDialog.open();
     for(var i in postData.INFOTOPROD){
   	  delete postData.INFOTOPROD[i]['__metadata'];
      };
            
    
      sPath = "/PCCustInfoSet";
	   var date = new Date();
	   var timestamp = date.getTime();
	   var timestamp1 = timestamp.toString() + "_text";
	   postData.INFOTOPROD[0].timeStamp = timestamp1;       
      sModel.create(sPath,postData,{
   	   success:function(oData,oResponse){
   		   /*var pdfURL = oData.PDFRESULT.results[0].URL;
   		   var pdfURL = oData.SplInstr;
   		   window.open(pdfURL);
   		   bDialog.close();*/
			   sPath = "/PCPDFDisplaySet("+"'"+timestamp1+"'"+")/$value";
			   sModel.read(sPath,null,null,true,function(data,response){
		       var pdfURL = response.requestUri;
              html.setContent("<iframe src=" + pdfURL + " width='700' height='700'></iframe>");
              oDialog.addContent(html);
               oDialog.open();
               oDialog.close();
               bDialog.close();
           },
           function(oData){
            sap.m.MessageBox.show(
         "Something went wrong", {
             icon: sap.m.MessageBox.Icon.INFORMATION,
             title: "Information"
         }
       );
             bDialog.close();
           });
			    		   

   	   },error:function(oResponse){
   		   sap.m.MessageBox.show(
   				   "Something went wrong...", {
   					   icon: sap.m.MessageBox.Icon.INFORMATION,
   					   title: "Information"
   				   }
   		   );
   		   bDialog.close();

   	   }

      });
  
	},	
	
	NumberValidation:function(oEvent){
	var oInput,val;
	oInput = oEvent.getSource();
	val = oInput.getValue();
	val = val.replace(/[^\d]/g, '');
	oInput.setValue(val);
		
	},
	
	onReject:function(){
		this.OrderModel();
	},
	
	OrderModel:function(){
		var data,p,oMdl;
		p= sap.ui.getCore().getModel('CModel').getData().PRODUCTS;
		
		var data ={
				CustEntity:'',
				ShipTo:'',
				PONum:'',
				ContactName:'',
				ContactTNo:'',
				ConfOrdQuan:'',
				OrderDate:'',
				ReqShipDate:'',
				InstallDate:'',
				Line1:'',
				Line2:'',
				Line3:'',
				SplInstr:'',
				INFOTOPROD:p
		};
		var oMdl = new sap.ui.model.json.JSONModel(data);
		this.getView().setModel(oMdl,'oModel');
	}

});      