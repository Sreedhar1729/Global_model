//const TokenInfo = require("@sap/xssec/lib/tokeninfo");

sap.ui.define([
    "./BaseController",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Token",
    "sap/ui/model/json/JSONModel"
    // "sap/ui/core/Fragment"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, Token,JSONModel,MessageBox) {
        "use strict";

        return Controller.extend("com.app.employeedetails.controller.Home", {
            onInit: function () {
                // this.onReadAll();
                const oLocalModel = new  sap.ui.model.json.JSONModel({
                    fName: "",
                    lName: "",
                    gender: "",
                    DOB: "",
                    contractStarted:"",
                    email: "",
                    phone: ""
                });
                this.getView().setModel(oLocalModel, "localModel");
// tokens
                const oView1 = this.getView();
                const oMulti = oView1.byId("multiInput1");
                const oMulti1 = oView1.byId("idLNameFilterValue");
                const oMulti2 = oView1.byId("idEmailFilterValue");
                const oMulti3 = oView1.byId("iPhoneFilterValue");

                let validae = function (arg) {
                    if (true) {
                        var text = arg.text;
                        return new Token({ key: text, text: text });
                    }
                }
                oMulti.addValidator(validae);
                oMulti1.addValidator(validae);
                oMulti2.addValidator(validae);
                oMulti3.addValidator(validae);

            },
            onGoPress: function (ev) {
               
                const oView = this.getView(),
                    oFirstNameFilter = oView.byId("multiInput1"),
                    oLastNameFilter = oView.byId("idLNameFilterValue"),
                    oEmailFilter = oView.byId("idEmailFilterValue"),
                    oPhoneFilter = oView.byId("iPhoneFilterValue"),
                    sFirstName = oFirstNameFilter.getTokens(),
                    sLastName = oLastNameFilter.getTokens(),
                    sEmail = oEmailFilter.getTokens(),
                    sPhone = oPhoneFilter.getTokens(),
                    oTable = oView.byId("idEmployeeTable"),
                    aFilters = [];
                sFirstName.filter((ele) => {
                    ele ? aFilters.push(new Filter("fName", FilterOperator.EQ, ele.getKey())) : "";

                })

                sLastName.filter((ele) => {
                    ele ? aFilters.push(new Filter("lName", FilterOperator.EQ, ele.getKey())) : "";

                })

                sEmail.filter((ele) => {
                    ele ? aFilters.push(new Filter("email", FilterOperator.EQ, ele.getKey())) : "";
                })

                sPhone.filter((ele) => {
                    ele ? aFilters.push(new Filter("phone", FilterOperator.EQ, ele.getKey())) : "";
                })
                oTable.getBinding("items").filter(aFilters);
            },


            onClearFilterPress: function () {
             
                const oView = this.getView(),
                    oFirstNameFilter = oView.byId("idFNameFilterValue").destroyTokens(),
                    oEmail = oView.byId("idEmailFilterValue").destroyTokens(),
                    oLastName = oView.byId("idLNameFilterValue").destroyTokens(),
                    ophoneNumber = oView.byId("iPhoneFilterValue").destroyTokens();

            },
            onSelectEmployee:function (oEvent) {
                
                const { ID, fName } = oEvent.getSource().getSelectedItem().getBindingContext().getObject();
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("routeDetails",{
                    empId: ID,
                    empName: fName
                })
            },
            onReadAll:function(){
//                 var that = this;
//                 var oModel = this.getOwnerComponent().getModel();
//                 oModel.read("/Employee",{
//                     success:function(oData)
//                     {
//                         console.log(oData);
//                         var Jmodel = new sap.ui.json.JSONModel(oData);
//                         that.getView().byId("idEmployeeTable").setModel(Jmodel);

//                     },error:function(oError){
// console.log(oError)
//                     }
//                 })

            },
            onCreateBtnPress: async function () {
                if (!this.oCreateEmployeeDialog) {
                    // this.oCreateEmployeeDialog = await Fragment.load({
                    //     id: this.getView().getId(),
                    //     name: "com.app.employeedetails.fragments.CreateEmployeeDialog",
                    //     controller: this
                    // });
                    // this.getView().addDependent(this.oCreateEmployeeDialog);
                    this.oCreateEmployeeDialog = await this.loadFragment("CreateEmployeeDialog")
 
                }

                this.oCreateEmployeeDialog.open();
            },

            onCloseDialog: function(){
                if(this.oCreateEmployeeDialog.isOpen()){
                    this.oCreateEmployeeDialog.close()
                }
            },
            onCreateEmployee: async function () {
                const oPayload = this.getView().getModel("localModel").getProperty("/"),
                    oModel = this.getView().getModel("ModelV2");
                try {
                    await this.createData(oModel, oPayload, "/Employee");
                    this.getView().byId("idEmployeeTable").getBinding("items").refresh();
                    this.oCreateEmployeeDialog.close();
                } catch (error) {
                    this.oCreateEmployeeDialog.close();
                    sap.m.MessageBox.error("Some technical Issue");
                }
            },
            RDEL:function(oEvent){
                // for Editing
                debugger
                var oModel = this.getOwnerComponent().getModel();
                var oModel = new sap.ui.model.odata.v2.ODataModel("https://port4004-workspaces-ws-7gb5l.us10.trial.applicationstudio.cloud.sap/v2/EmployeeSRV/");
                // oModel.setUserBatch(false);
                if(oEvent.getSource().getText() === "ISSUE")
                {
                    oEvent.getSource().setText("Submit")
                    oEvent.getSource().getParent().getParent().getCells()[5].setEditable(true);
                }
                else{
                    debugger
                    oEvent.getSource().setText("ISSUE")
                    oEvent.getSource().getParent().getParent().getCells()[5].setEditable(false);
                    var oInput = oEvent.getSource().getParent().getParent().getCells()[5].getValue();
                    var oId = oEvent.getSource().getBindingContext().getProperty("ID");
                    console.log(oId)
                    oModel.update("/Employee("+oId+ ")",{phone:oInput},{
                        sucess:function()
                        {
                        
                        },error:function(e)
                        {
                            console.log(e);
                        }
                    })
                }
            }


        });
    });
