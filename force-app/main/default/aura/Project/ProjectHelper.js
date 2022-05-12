({
    handleSearch: function (component, searchTerm, page) {
        var action = component.get("c.searchProjects");
        action.setParams({
            searchTerm: searchTerm,
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var resultData = response.getReturnValue();            
                 component.set("v.data", resultData);
            }
        });

        $A.enqueueAction(action);
    },
    getProjects: function (component, helper) {
        var action = component.get("c.fetchProjects");
        var pageSize = component.get("v.pageSize");
        var pageNumber = component.get("v.pageNumber");
        var totalPage = component.get("v.totalPage");
        action.setParams({
            pageSize: pageSize,
            pageNumber: pageNumber,
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var resultData = response.getReturnValue();
                if (resultData.totalPage < component.get("v.pageSize")) {
                    component.set("v.isLastPage", true);
                } else {
                    component.set("v.isLastPage", false);
                }
                component.set("v.dataSize", resultData.length);
                component.set("v.searchResult", resultData);
                component.set("v.data", resultData);
                component.set("v.totalPage", totalPage);

            }

        });

        $A.enqueueAction(action);
    },
})