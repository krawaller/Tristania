Ti.include("../assets/utils.js");
    
win.title = "Community";

win.add($.create({
    text: "Forum",
    styleClass: "categoryButton",
    top: 10,
    click: function(e){
        Ti.UI.currentTab.open($.create({ type: "Window", url:'forum.js' }));
    }
}));

win.add($.create({
    text: "Twitter",
    styleClass: "categoryButton",
    top: 80,
    click: function(e){
        Ti.UI.currentTab.open($.create({ type: "Window", url:'tristania_twitter.js' }));
    }
}));

win.add($.create({
    text: "Geo",
    styleClass: "categoryButton",
    top: 150,
    click: function(e){
        Ti.UI.currentTab.open($.create({ type: "Window", url:'geo.js' }));
    }
}));