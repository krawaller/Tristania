Ti.include("../assets/utils.js");
Ti.include("../assets/remotedata.js");
    
win.title = "Data handling";

win.add($.create({
    type: "View",
    childElements: [{
        styleClass: "infolabel",
        text: "Update remote data on app start:",
        top: 10
    },{
        type: "Switch",
        top: 60, 
        value: Ti.App.Properties.getBool("alwaysupdate") || false,
        eventListeners: {
            change: function(e){
Ti.API.log("alwaysupdate set to "+e.value);
                Ti.App.Properties.setBool("alwaysupdate",e.value);
            }
        }
    },{
        type: "Button",
        title: "Load data now",
        styleClass: "optionsbutton",
        click: function(e){
            RDATA.loadAll({});
        }
    }]
}));