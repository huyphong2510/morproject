({
    doInit: function (component, event, helper) {

        helper.getTasks(component, helper, event);
    },
    handleNext: function (component, event, helper) {
        var pageNumber = component.get("v.pageNumber");
        var totalPage = component.get("v.totalPage");
        component.set("v.pageNumber", pageNumber + 1);
        component.set("v.totalPage", totalPage);
        helper.getTasks(component, helper);
    },
    handlePrev: function (component, event, helper) {
        var pageNumber = component.get("v.pageNumber");
        component.set("v.pageNumber", pageNumber - 1);
        helper.getTasks(component, helper);
    },
    handleDeleteRecord: function (component, event, helper) {
        var idx = event.target.id;
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": "Notification",
            "message": "Delete records successfully!!",
            "type": "SUCCESS"
        });
        var action = component.get('c.deleteTask');
        action.setParams({
            delid: idx,
        })
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                $A.get('e.force:refreshView').fire();
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message")
                    }
                } else {
                    console.log('Unknow Error');
                }
            }
        });
        toastEvent.fire();
        $A.enqueueAction(action);
    },
    handleSerialNumberKeyUp: function (component, evt, helper) {
        var isEnterKey = evt.keyCode === 13;
        if (isEnterKey) {
            var queryTerm = component.find('asset-search').get('v.value');
            component.set('v.searchTerm', queryTerm);
            helper.handleSearch(component, queryTerm);
        }
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
            $A.get('e.force:refreshView').fire();

        } else if (eventParams.changeType === "ERROR") {
            // there’s an error while loading, saving, or deleting the record
        }
    },
    filterDate: function (component, event, helper) {
        var choose = component.find("choose").get("v.value");
        var action = component.get("c.filterTasks");
        action.setParams({
            option: choose,
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var resultData = response.getReturnValue();
                component.set("v.tasktList", resultData);
            }
        });

        $A.enqueueAction(action);
    },
    handleError: function (component, event, helper) {
        component.find('notifLib').showToast({
            "title": "Something has gone wrong!",
            "message": event.getParam("message"),
            "variant": "error"
        });
    },

    onCheck: function (cmp, evt) {
        var checkCmp = cmp.find("checkbox");
        resultCmp = cmp.find("checkResult");
        resultCmp.set("v.value", "" + checkCmp.get("v.value"));
    },
    Search: function (component, event, helper) {
        var searchField = component.find('searchField');
        var isValueMissing = searchField.get('v.validity').valueMissing;
        // if value is missing show error message and focus on field
        if (isValueMissing) {
            searchField.showHelpMessageIfInvalid();
            searchField.focus();
            alert(searchField);
        } else {
            // else call helper function 
            helper.SearchHelper(component, event);
        }
    },
    save: function (component, event, helper) {
        var evnt = $A.get("e.force:navigateToComponent");
        evnt.setParams({
            componentDef: "c:Task",
            componentAttributes: {}
        });
        evnt.fire();
    },



    editTask: function (component, event) {
        var idx = event.target.id;
        $A.createComponent("c:TaskEdit",
            { strRecordId: idx },
            function (result, status) {
                if (status === "SUCCESS") {
                    component.find('overlayLibDemo').showCustomModal({
                        header: "Edit Task",
                        body: result,
                        showCloseButton: true,
                        cssClass: "mymodal",
                    })
                }
            });
    },
    assignTask: function (component, event) {
        var idx = event.target.id;
        $A.createComponent("c:AssignUser",
            { strRecordId: idx },
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

    handleRecordUpdated: function (component, event, helper) {
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": "lightning/page/home"
        });
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
            urlEvent.fire();

        }
    },

    handleShowModal: function (component, event, helper) {
        var strTskId = component.get("v.recordId");
        $A.createComponent("c:CreateTask",
            { strRecordId: strTskId },
            function (result, status) {
                if (status === "SUCCESS") {
                    component.find('overlayLibDemo').showCustomModal({
                        header: "Create Task",
                        body: result,
                        showCloseButton: true,
                        cssClass: "mymodal",
                    })
                }
            });

    },
    changeSelect: function (cmp, event, helper) {
        //Press button to change the selected option
        cmp.find("select").set("v.value", "closed");
    },
    handleChange: function (cmp, event, helper) {
        //Do something with the change handler
        var day = event.getParam('value');
        if (day == 'Last week') {
            var action = component.get("c.get7Days");
            //action.setparm
        }
        else {
            var action = component.get("c.get1Month");
            //action.setparm
            action.setCallback(this, function (response) {
                if (response.getState() === "SUCCESS") {
                    component.set("v.taskDetails", response.getReturnValue());
                }
                else {
                    alert('Error');
                }
            });
            $A.enqueueAction(action);
        }
    },

    viewChange20: function (component, event, helper) {
        component.set("v.pageSize", 20);
        helper.getTasks(component, helper, event);
    },

    viewChange50: function (component, event, helper) {
        var change = component.set("v.pageSize", 50);
        helper.getTasks(component, helper, event);
    },
    viewChange100: function (component, event, helper) {
        var change = component.set("v.pageSize", 100);
        helper.getTasks(component, helper, event);
    },
    page2: function (component, event, helper) {
        component.set("v.pageNumber", 2);
        helper.getTasks(component, helper, event);
    },
    thirdPage: function (component, event, helper) {
        component.set("v.pageNumber", 3);
        helper.getTasks(component, helper, event);
    },
    fourthPage: function (component, event, helper) {
        component.set("v.pageNumber", 4);
        helper.getTasks(component, helper, event);
    },
    handleConfirmDialog : function(component, event, helper) {
        component.set('v.showConfirmDialog', true);
    },
     
    handleConfirmDialogNo : function(component, event, helper) {
        component.set('v.showConfirmDialog', false);
    },


})