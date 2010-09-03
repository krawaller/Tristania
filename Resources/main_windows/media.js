Ti.include("../assets/utils.js");
    
win.title = "Media";

win.add( $.create({
    type: "View",
    childElements: [{
        text: "Pictures",
        styleClass: "categoryButton",
        top: 110,
        click: function(e){
            Ti.UI.currentTab.open($.create({ type: "Window", url:'gallery.js' }));
        }
    },{
        text: "Videos",
        styleClass: "categoryButton",
        top: 180,
        click: function(e){
            Ti.UI.currentTab.open($.create({ type: "Window", url:'vids.js' }));
        }
    }]
}));