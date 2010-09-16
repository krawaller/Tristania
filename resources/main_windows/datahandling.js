Ti.include("../assets/utils.js");
Ti.include("../assets/remotedata.js");
    
win.title = "Data handling";

var view = ($.create({
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
                Ti.App.Properties.setBool("alwaysupdate",e.value);
            }
        }
    },{
        type: "Button",
        title: "Load data now",
        top: 90,
        styleClass: "optionsbutton",
        click: function(e){
            view.childrenById.result.text = "Loading...";
            RDATA.loadAll({},function(w){
                view.childrenById.result.text +="\n...updated "+w+"!";
            });
        }
    },{
        type: "Label",
        styleClass: "resultlabel",
        top: 120,
        left: 20,
        id: "result",
        text: "",
        
    }]
}));

win.add(view);