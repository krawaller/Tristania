Ti.include("../assets/utils.js");
    
win.title = "Application";

win.add( $.create({
    type: "View",
    childElements: [{
        styleClass: "categoryButton",
        text: "About",
        top: 110,
        click: function(e){
            Ti.UI.currentTab.open($.create({ type: "Window", url:'about.js' }));
        }
    },{
        styleClass: "categoryButton",
        text: "Data handling",
        top: 180,
        click: function(e){
            Ti.UI.currentTab.open($.create({ type: "Window", url:'datahandling.js' }));
        }
    }]
}));