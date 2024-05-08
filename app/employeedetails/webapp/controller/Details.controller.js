sap.ui.define(
    [
      "./BaseController"
        // "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("com.app.employeedetails.controller.Details", {
        onInit: function() {
        
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRoutePatternMatched(this.onEmployeeDetailsLoad, this); 
        },
        onEmployeeDetailsLoad: function(oEvent ){
             
            const { empId } = oEvent.getParameter("arguments");
            this.ID = empId;
            const sRouterName = oEvent.getParameter("name");
            //const oForm = this.getView().byId("idEmployeeDetailsForm");
            const oObject = this.getView().byId("idEmployeeDetailsObjectPage");

            oObject.bindElement(`/Employee(${empId})`, {

                expand: 'salary,address,department,designation'
            });
          
             
       },
       onDeleteEmployee :async function(){
        const oModel = this.getView().getModel("ModelV2");
        try {
          await this.deleteData(oModel, "/Employee", this.ID);
          this.getRouter().navTo("RouteHome");
        } catch (error) {
          sap.m.MessageBox.error("Some Technical Issue");
        }
      },
      });
    });

        
  
    