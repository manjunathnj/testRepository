jQuery.sap.require("sap.m.MessageBox");
sap.ui.controller("com.ui5.project.zcvp_prodconfig.Prodconfig", {

/**
 * Called when a controller is instantiated and its View controls (if available)
 * are already created. Can be used to modify the View before it is displayed,
 * to bind event handlers and do other one-time initialization.
 * 
 * @memberOf zcvp_prodconfig.Prodconfig
 */
	onInit: function() {
		 this.router = sap.ui.core.UIComponent.getRouterFor(this);
		 this.router.attachRouteMatched(this._onObjectMatched, this);			

	},
	
	_onObjectMatched:function(oEvent){
		if(oEvent.getParameter("name")==="PD"){
			var sform = this.getView().byId('idSelection');
			sform.removeAllContent();
			/*var sList = this.getView().byId('idList');
			sList.refreshItems();*/
			//this.getView().byId('idIcontab').removeItem();
			var filter=new Array(),sModel,that=this,sData;
			this.sPid = oEvent.getParameter("arguments").PrjId;
			var prodid = "Product: " + this.sPid;
			this.getView().byId('idPrdId').setText(prodid);
			sPath = 'PCGroupSet?$expand=GROUPTOFIELD/FIELDTOVAL,GROUPTOINST';
			 filter.push(new sap.ui.model.Filter("Productid",
		                sap.ui.model.FilterOperator.EQ, this.sPid));
			 this.serviceCall(filter,sPath); // Service Call
			 this.fnID('X'); // set the model 'iMdl' for selected values and default values 
			 this.fnSetObj();// Add the content to right side of the pannel for defaulted values in service call.
			 
			 // this.getView().setModel(pModel,'ProductModel');
		}
		
	},
	
	fnSetObj:function(){
		var tObj = {},mdl,sData,ObjPage;
		var that = this;
		mdl = this.getView().getModel('ProductModel');
		sData = mdl.getData();
		var sform = this.getView().byId('idSelection');
		$.each(sData.results,function(i,ele){
			$.each(ele.GROUPTOFIELD.results,function(index,o){
				// D-defaulted values 
				if(o.Fieldselmode === 'D'){ 
					that.fnAddSelection(mdl,sData,o,sform,null);
				}
				
			});
		});
		
	},	
	fnAddSelection:function(mdl,sData,sObj,sform,sValue){
		var tObj = {};
		sData[sObj.Fieldname] = [];
		tObj.Fieldname = sObj.Fieldname;
		tObj.Fieldtype = sObj.Fieldtype;
		tObj.text = (sValue === null)?sObj.Fieldseldesc:sValue;	
		sData[sObj.Fieldname].push(tObj);
		mdl.refresh(true);
		// Dynamic model binding creation for right side of the pannel
		var path = 'ProductModel>/'+sObj.Fieldname;
		var ObjPage = new sap.m.ObjectHeader({title:sObj.Fieldname}).addStyleClass('styleForSelection');
		var template = new sap.m.ObjectAttribute({title:"{ProductModel>text}"});
		ObjPage.bindAggregation('attributes',path,template);
		sform.addContent(ObjPage);
		
	},
	
	onSelectionChange:function(evt){

		var mdl = this.getView().getModel('ProductModel');
		var sData = mdl.getData();
		var sValue = evt.getParameter('value');
		var key = evt.getSource().getProperty('selectedKey');
		if(key ==='' && sValue !==''){
			key = sValue;
		}
		var sObj = evt.getSource().getBindingContext('ProductModel').getObject();

		var sform = this.getView().byId('idSelection');	
// Check the value is already selected or not.		
		if(!sData[sObj.Fieldname]){ // if there is no array in model create dynamic one and added it to right side pannel 
			// this.fnAddSubScreen(sData,sObj,sValue,key);
			this.fnAddSelection(mdl,sData,sObj,sform,sValue);
		}else{
			/* var t = '/'+sObj.Fieldname; */
			var t = sObj.Fieldname;

			var sContent = sform.getContent();
			for(var i in sContent){
				/* var sPath = sContent[i].getBindingInfo('Properties').path; */
				var a;
				var sPath = sContent[i].mProperties.title;
				if(t === sPath){
					sContent[i].getAttributes()[0].setProperty('title',sValue); // Changed the selected value 

					var mData = this.getView().getModel('iMdl').getData().results;	
				// remove the existing value from 'iMdl' model
					//var a=mData.findIndex(y => y.Fieldid === sObj.Fieldid ); Commented for IE11 issue
					for(var j=0; j<mData.length ; j++){
						if(mData[j].Fieldid === sObj.Fieldid ){
							a = j;
							break;
						}
					}			
					
					// if(a !==-1)
					if(a !== undefined)
					{

						mData.splice(a,1);
						this.getView().getModel('iMdl').refresh();
					}					
				}
			}
		}
		this.fnServiceCall(this.sPid,sData,key,sObj.Fieldid);
		
		var id = evt.getParameter('id');
		this.fnID('Y',id);
		this.fnSetSelectedKey(id,key,'X');	// set the selected value	
		
	},
	// Add the selected vaue for right side of the pannel.
	fnAddSubScreen:function(sData,sObj,sValue,key){
		var tObj = {};		
		sData[sObj.Fieldname] = [];
		tObj.Fieldname = sObj.Fieldname;
		tObj.Fieldtype = sObj.Fieldtype;
		tObj.Fieldid = sObj.Fieldid;
		tObj.text = sValue;
		tObj.Valueid = key;
		sData[sObj.Fieldname].push(tObj);
	// mdl.refresh(true);
		var path = 'ProductModel>/'+sObj.Fieldname;
		var OPS = new sap.uxap.ObjectPageSubSection({title:sObj.Fieldname});
		var ObjPage = this.getView().byId('idObjectPage');		
		
		var template = new sap.m.Text({text:"{ProductModel>text}"}).addStyleClass('styleForObjTitle');		
		
		OPS.bindAggregation('blocks',path,template);
		ObjPage.addSubSection(OPS)
		
	},	

	fnSetSelectedKey:function(id,key,flag){
		var a;
		var iMdl = this.getView().getModel('iMdl');
		if(flag === 'X'){
			var tObj = {};
			var results = iMdl.getData().results;
			//var a=iMdl.getData().results.findIndex(y => y.Valueid === key);
			for(var i=0 ; i<results.length ;i++){
				if(results[i].Valueid === key)
						a = i;
					    break;
			}
			
/*			if(a !== -1){
				iMdl.getData().results[a].id = id;
			}*/
			if(a !== undefined){
				iMdl.getData().results[a].id = id;
			}
			
			iMdl.refresh();
		}
		
		var d = iMdl.getData().results;
		for(var i in d){
			if(d[i].Fieldselmode !== 'D'){
				var key = d[i]['Valueid'];
				if(d[i]['id'] && d[i]['id'] !==''){
					var id = d[i]['id'];
					sap.ui.getCore().byId(id).setSelectedKey(key);
				}
					
			}
			
		}		
	},	
// multi combobox
	onChange:function(evt){
		// var tObj = {};
		var sObj = evt.getSource().getBindingContext('ProductModel').getObject();
		var mdl = this.getView().getModel('ProductModel');		
		var sData = mdl.getData();
		var sItems = evt.getParameter('selectedItems'); // get the all selected values
		// check the array name is already there are not. 
		//if it is there remove and add it else create a new array with field name and bind it to right side pannel.
		if(sData[sObj.Fieldname]){
			/* sData[sObj.Fieldname] = []; */
			var fName = sData[sObj.Fieldname][0]['Fieldname'];

			var sform = this.getView().byId('idSelection');
			for(var i in sform.getContent()){
				if(fName === sform.getContent()[i].getProperty('title'))
					index = Number(i);

			}
			sform.removeContent(index); // remove the content 

			this.fnSetMultiSelection(sData,sItems,sObj); // set the slected value in both 'iMdl' and multi combobox

		}else{
			this.fnSetMultiSelection(sData,sItems,sObj);
		}
	},

	fnSetMultiSelection:function(sData,sItems,sObj){

		var sPath = '/PCGroupSet?$expand=GROUPTOFIELD/FIELDTOVAL,GROUPTOINST';
		var tObj = {},filter=[];

		filter.push(new sap.ui.model.Filter("Productid",
				sap.ui.model.FilterOperator.EQ, this.sPid));
		var mData = this.getView().getModel('iMdl').getData().results;	

		// if(sData[sObj.Fieldname].length > 0)
		var fName = (sData[sObj.Fieldname])?((sData[sObj.Fieldname].length > 0)? sData[sObj.Fieldname][0]['Fieldname']:''):'';
		// remove existing values for selected combobox 
		mData = mData.filter(function(ele,i){
			if(ele.Fieldselmode === 'M' && ele.Fieldname === fName){

			}else{
				return ele;
			}
		});
		if(sItems.length > 0)
			sData[sObj.Fieldname] = [];
		else{
			delete sData[sObj.Fieldname];
		}

		for(var i in mData){
			var t = mData[i];
			var fvId = t.Fieldid+'/-'+t.Valueid;

			filter.push(new sap.ui.model.Filter("Valueid",
					sap.ui.model.FilterOperator.EQ,fvId));				
		}
		// pass the selected values to filter condition and 'iMdl' model as well 
		if(sItems.length > 0 ){
			for(var i in sItems){
				tObj.Fieldname = sObj.Fieldname;
				tObj.Fieldtype = sObj.Fieldtype;
				tObj.Fieldid = sObj.Fieldid;
				tObj.Fieldselmode = sObj.Fieldselmode;
				tObj.Valueid = sItems[i].getProperty('key');
				tObj.text = sItems[i].getProperty('text');
				var t = $.extend({},tObj);

				sData[sObj.Fieldname].push(t);
				var fvId = tObj.Fieldid+'/-'+tObj.Valueid;
				filter.push(new sap.ui.model.Filter("Valueid",
						sap.ui.model.FilterOperator.EQ,fvId));
				// mData.push(t);
				var t1 = mData.filter(function(ele){
					return (ele.Valueid === t.Valueid && ele.Fieldid === t.Fieldid)
				})[0];
				if(!t1){
					mData.push(t);
				}

			}

		}


		this.getView().getModel('iMdl').setData({results:mData});
		this.getView().getModel('iMdl').refresh();
		this.serviceCall(filter,sPath,'X');	
		if(sItems.length >0){
			var sform = this.getView().byId('idSelection');
			var path = 'ProductModel>/'+sObj.Fieldname;
			var ObjPage = new sap.m.ObjectHeader({title:sObj.Fieldname}).addStyleClass('styleForSelection')
			var template = new sap.m.ObjectAttribute({title:"{ProductModel>text}"});
			ObjPage.bindAggregation('attributes',path,template);
			sform.addContent(ObjPage);
		}

	},

	fnServiceCall:function(sPid,sData,key,fieldid){
		var filter = new Array(),sPath;
		sPath = '/PCGroupSet?$expand=GROUPTOFIELD/FIELDTOVAL,GROUPTOINST';
		filter.push(new sap.ui.model.Filter("Productid",
                sap.ui.model.FilterOperator.EQ,sPid));
		var mData = this.getView().getModel('iMdl').getData().results;		
		filter.push(new sap.ui.model.Filter("Valueid",
                sap.ui.model.FilterOperator.EQ,fieldid+'/-'+key));
		
			for(var i in mData){
				
					var t = mData[i];
					var fvId = t.Fieldid+'/-'+t.Valueid;
					
					/*
					 * filter.push(new sap.ui.model.Filter("Fieldid",
					 * sap.ui.model.FilterOperator.EQ,t.Fieldid)); var
					 */
					filter.push(new sap.ui.model.Filter("Valueid",
			                sap.ui.model.FilterOperator.EQ,fvId));				
				
			}
				this.serviceCall(filter,sPath,'X');			
	},	
	
	serviceCall:function(filter,sPath,f){
		var sModel = sap.ui.getCore().getModel('serviceModel');
		//sap.ui.code.BusyIndicator.show(0);
		var bDialog = new sap.m.BusyDialog();
		 bDialog.open();
        sModel.read(sPath,{
          context:null,
          urlParameters:null,
          async:false,
          filters:filter,
          success:function(oData,oResponse){
           //sap.ui.core.BusyIndicator.hide();
        	  bDialog.close();
       	   sData = oData;      	  
       	  
          },
          error:function(oResponse){
        	  bDialog.close();
        	  //sap.ui.core.BusyIndicator.hide();
            }
          });
		  // remove the 'INST' Groupid from Project model.
        if(sData){	        	
        	var tArray = sData.results.filter(function(o){
        		 return o.Groupid !== 'INST';
        	 });
        	if(f && f === 'X'){
        		var mdl = this.getView().getModel('ProductModel');
        		mdl.getData().results = tArray;
        		mdl.refresh();
        	}else{
        		var pModel = new sap.ui.model.json.JSONModel({results:tArray});
         	   this.getView().setModel(pModel,'ProductModel');
         	   this.getView().getModel('ProductModel').refresh();
        	}
        	   // 'INST' group id is for table
        	   var tObj = sData.results.filter(function(ele){
	        		 return ele.Groupid === 'INST';
	        	 })[0];
        	   if(tObj){
        		   var tModel = new sap.ui.model.json.JSONModel({results:tObj.GROUPTOINST.results});
	        	   this.getView().byId('idInstance').setModel(tModel);
        	   }
         } 
		
	},
	
	home:function(){
		window.location.reload();
		this.router.navTo('intial');
	},
	
	onReject:function(){
	
		 window.location.reload();
	},

	
	onNext:function(){
		var aR = this.getView().getModel('ProductModel').getData().results;
		
		var tR = this.getView().byId('idInstance').getModel().getData().results;
		// if there is no  Message or Status ind = 'G' then navigate to order Config view 
		if(aR[0].StatusInd === 'G' || aR[0].Messages === ''){
		var cModel = new sap.ui.model.json.JSONModel({PRODUCTS:tR});
		sap.ui.getCore().setModel(cModel,'CModel');
		this.router.navTo('OD');	
		}else{
			 sap.m.MessageBox.show(
					        'Configuration is Incomplete...',{
					              icon: sap.m.MessageBox.Icon.ERROR,
					              title: 'Error'
					          }
					        );
		}

	},	
	
	onAccept:function(){
/*
 * var filter = new Array(),sPath; sPath =
 * '/PCGroupSet?$expand=GROUPTOFIELD/FIELDTOVAL,GROUPTOINST'; filter.push(new
 * sap.ui.model.Filter("Productid", sap.ui.model.FilterOperator.EQ,this.sPid));
 * var mData = this.getView().getModel('iMdl').getData().results; for(var i in
 * mData){ var t = mData[i]; var fvId = t.Fieldid+'/-'+t.Valueid;
 * 
 * 
 * filter.push(new sap.ui.model.Filter("Fieldid",
 * sap.ui.model.FilterOperator.EQ,t.Fieldid));
 * 
 * filter.push(new sap.ui.model.Filter("Valueid",
 * sap.ui.model.FilterOperator.EQ,fvId)); }
 * this.serviceCall(filter,sPath,'C');//C- for Message show
 * this.fnSetSelectedKey(null,null,'Y');
 */
	
	},	
	
	
	fnID:function(flag,id){
		
		var mdl,tObj,results=new Array(),a;
		var mdl = this.getView().getModel('ProductModel');
		var tObj = {Fieldid:'',Fieldname:'',Valueid:'',Valuedesc:'',id:''};
		a=mdl.getData().results;
		if(flag !== 'X'){
			var mdl = this.getView().getModel('iMdl');
		}
		$.each(a,function(index,ele){
			$.each(ele.GROUPTOFIELD.results,function(i,o){
				if(o.Fieldselid !== '' && o.Fieldseldesc !==''){
					/* tObj.id = ''; */
				tObj.Fieldid = o.Fieldid;
				tObj.Fieldname = o.Fieldname;
				tObj.Valueid = o.Fieldselid;
				tObj.Valuedesc = o.Fieldseldesc;
				tObj.Fieldselmode = o.Fieldselmode;

				var to = $.extend({},tObj);
				results.push(to);				
				if(o.Fieldselmode === 'D' ){ // for Input
					o.FIELDTOVAL.results[0].Valueid = o.Fieldselid;
					o.FIELDTOVAL.results[0].Valuedesc = o.Fieldseldesc;
				}
			}
			});
		});
		if(flag  !== 'X'){

			for(var i in mdl.getData().results){
				if(mdl.getData().results[i]['Fieldselmode'] === 'M'){
					results.push(mdl.getData().results[i]);
				}
			}
		}
		
		var data = {results:results};
		var iMdl  = new sap.ui.model.json.JSONModel(data);
		this.getView().setModel(iMdl,'iMdl');
	},
	
	messageFormat:function(v){
		// var lines = (v.split('&&')).length;
		return v.replace(/(\&&)+/g,'\n');
	},
	lowercase:function(v1){
		// return v1.replace(/\w\S*/g, function (word) {
		// return word.charAt(0) + word.slice(1).toLowerCase();
		// });
	},
	icon:function(v){
		return (v==='G')?'Images/Green.png': (v==='R')?'Images/Red.png':'Images/Yellow.png';
	}

	
	

/**
 * Similar to onAfterRendering, but this hook is invoked before the controller's
 * View is re-rendered (NOT before the first rendering! onInit() is used for
 * that one!).
 * 
 * @memberOf zcvp_prodconfig.Prodconfig
 */
// onBeforeRendering: function() {
//
// },

/**
 * Called when the View has been rendered (so its HTML is part of the document).
 * Post-rendering manipulations of the HTML could be done here. This hook is the
 * same one that SAPUI5 controls get after being rendered.
 * 
 * @memberOf zcvp_prodconfig.Prodconfig
 */
// onAfterRendering: function() {
//
// },

/**
 * Called when the Controller is destroyed. Use this one to free resources and
 * finalize activities.
 * 
 * @memberOf zcvp_prodconfig.Prodconfig
 */
// onExit: function() {
//
// }

});