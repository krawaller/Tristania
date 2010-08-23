Ti.include("../assets/utils.js");
    
win.title = "Media";

win.add($.create({
    text: "Pictures",
    styleClass: "categoryButton",
    top: 10,
    click: function(e){
        Ti.UI.currentTab.open($.create({ type: "Window", url:'gallery.js' }));
    }
}));

win.add($.create({
    text: "Videos",
    styleClass: "categoryButton",
    top: 80,
    click: function(e){
        Ti.UI.currentTab.open($.create({ type: "Window", url:'vids.js' }));
    }
}));