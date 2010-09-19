Ti.include("../assets/utils.js");
Ti.include("../assets/remotedata.js");
Ti.include("../assets/localdata.js");
    
win.title = "Data handling";

var view = ($.create({
    type: "View",
    childElements: [{
        styleClass: "infolabel",
        text: "Automagically load data on app start:",
        top: 30
    },{
        type: "Switch",
        top: 60, 
        value: !!Ti.App.Properties.getBool("alwaysupdate") || false,
        eventListeners: {
            change: function(e){
                Ti.App.Properties.setBool("alwaysupdate",e.value);
            }
        }
    },{
        type: "Button",
        title: "Load data now",
        top: 140,
        styleClass: "optionsbutton",
        click: function(e){
            var n = {
                spreadsheet: "content",
                videos: "video list",
                community: "community map",
                statistics: "community statistics"
            };
            view.childrenById.result.text = "Loading...";
			Ti.API.info(['==== LOAD'])
            RDATA.loadAll({},function(w){
                view.childrenById.result.text +="\n...updated "+(n[w] || w)+"!";
            });
        }
    },{
        type: "Label",
        styleClass: "resultlabel",
        top: 150,
        left: 50,
        id: "result",
        text: "",
        
    }]
}));

win.add(view);