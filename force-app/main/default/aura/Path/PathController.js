({
    handleSelect : function (component, event, helper) {
        var stepName = event.getParam("detail").value;
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
          "title": "Success!",
           "message": "Toast from " + stepName
           });
           toastEvent.fire();
       },
    

    assignUser: function (component, event, helper) {
        var strTskId = component.get("v.recordId");
        console.log('Task Id ====>' + strTskId);
        $A.createComponent("c:AssignUser",
            { strRecordId: strTskId },
            function (result, status) {
                if (status === "SUCCESS") {
                    component.find('overlayLibDemo').showCustomModal({
                        header: "Assign To User",
                        body: result,
                        showCloseButton: true,  
                        cssClass: "mymodal",
                    })
                }
            });
    },
    handleDeleteRecord: function (component, event, helper) {
        component.find("recordHandler").deleteRecord($A.getCallback(function (deleteResult) {
            if (deleteResult.state === "SUCCESS" || deleteResult.state === "DRAFT") {
                // record is deleted
                console.log("Record is deleted.");
            } else if (deleteResult.state === "INCOMPLETE") {
                console.log("User is offline, device doesn't support drafts.");
            } else if (deleteResult.state === "ERROR") {
                console.log('Problem deleting record, error: ' + JSON.stringify(deleteResult.error));
            } else {
                console.log('Unknown problem, state: ' + deleteResult.state + ', error: ' + JSON.stringify(deleteResult.error));
            }

        }));
    },

    openModel: function (component, event, helper) {
        // for Display Model,set the "isOpen" attribute to "true"
        component.set("v.isOpen", true);
    },

    closeModel: function (component, event, helper) {
        // for Hide/Close Model,set the "isOpen" attribute to "Fasle"  
        component.set("v.isOpen", false);
    },

    likenClose: function (component, event, helper) {
        alert('thanks for like Us :)');
        component.set("v.isOpen", false);
    },

    handleShowModal: function (component) {
        var strTskId = component.get("v.recordId");
        console.log('Project Id ====>' + strTskId);
        $A.createComponent("c:AssignUser",
            { recordId: strTskId, recordChild: component },
            function (result, status) {
                if (status === "SUCCESS") {
                    component.find('overlayLibDemo').showCustomModal({
                        header: "Assign User",
                        body: result,
                        showCloseButton: true,
                        cssClass: "mymodal",
                    })
                }
            });
    },

    handleError: function (component, event, helper) {
        component.find('notifLib').showToast({
            "title": "Something has gone wrong!",
            "message": event.getParam("message"),
            "variant": "error"
        });
    },
    handleDeleteRecord: function (component, event, helper) {
        component.find("recordHandler").deleteRecord($A.getCallback(function (deleteResult) {
            if (deleteResult.state === "SUCCESS" || deleteResult.state === "DRAFT") {
                // record is deleted
                console.log("Record is deleted.");
            } else if (deleteResult.state === "INCOMPLETE") {
                console.log("User is offline, device doesn't support drafts.");
            } else if (deleteResult.state === "ERROR") {
                console.log('Problem deleting record, error: ' + JSON.stringify(deleteResult.error));
            } else {
                console.log('Unknown problem, state: ' + deleteResult.state + ', error: ' + JSON.stringify(deleteResult.error));
            }

        }));
    },
    handleRecordUpdated: function (component, event, helper) {
        var eventParams = event.getParams();
        if (eventParams.changeType === "CHANGED") {
            // record is changed
        } else if (eventParams.changeType === "LOADED") {
            // record is loaded in the cache
        } else if (eventParams.changeType === "REMOVED") {
            // record is deleted, show a toast UI message
            var resultsToast = $A.get("e.force:showToast");
            resultsToast.setParams({
                "title": "Deleted",
                "message": "The record was deleted."
            });
            resultsToast.fire();
            window.location.href = "https://mor-project-dev-ed.lightning.force.com/lightning/o/Project__c/list?filterName=Recent";

        } else if (eventParams.changeType === "ERROR") {
            // there’s an error while loading, saving, or deleting the record
        }
    },

    handleSuccess: function (component, event, helper) {
        component.find('notifLib').showToast({
            "title": "Record updated!",
            "message": "The record " + event.getParam("id") + " has been updated successfully.",
            "variant": "success"
        });
    },

    handleError: function (component, event, helper) {
        component.find('notifLib').showToast({
            "title": "Something has gone wrong!",
            "message": event.getParam("message"),
            "variant": "error"
        });
    },
})