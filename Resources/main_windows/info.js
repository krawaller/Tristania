Ti.include("../assets/utils.js");
    
win.title = "Info";

win.add($.create({
    text: "News",
    styleClass: "categoryButton",
    top: 10,
    click: function(e){
        Ti.UI.currentTab.open($.create({ type: "Window", url:'newslist.js' }));
    }
}));

win.add($.create({
    text: "Bio",
    styleClass: "categoryButton",
    top: 80,
    click: function(e){
        Ti.UI.currentTab.open($.create({ type: "Window", url:'biolist.js' }));
    }
}));

win.add($.create({
    text: "Discography",
    styleClass: "categoryButton",
    top: 150,
    click: function(e){
        Ti.UI.currentTab.open($.create({ type: "Window", url:'discography.js' }));
    }
}));