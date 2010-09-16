Ti.include("../assets/utils.js");
    
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
        left: 10,
        value: Ti.App.Properties.getBool("alwaysupdate"),
        eventHandlers: {
            change: function(e){
                Ti.App.Properties.setBool(e.value);
            }
        }
    }]
}));