Ti.include("../assets/utils.js");
    
win.title = "Info";

win.add($.create({
    type: "Label",
    text: "Pictures",
    styleClass: "categoryButton",
    top: 10,
    click: function(e){
        Ti.UI.currentTab.open($.create({ type: "Window", url:'gallery.js' }));
    }
}));

win.add($.create({
    type: "Label",
    text: "Videos",
    styleClass: "categoryButton",
    top: 80,
    click: function(e){
        Ti.UI.currentTab.open($.create({ type: "Window", url:'vids.js' }));
    }
}));