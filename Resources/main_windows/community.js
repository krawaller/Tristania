Ti.include("../assets/utils.js");
    
win.title = "Community";

win.add( $.create({
    type: "View",
    childElements: [{
        text: "Geo",
        styleClass: "categoryButton",
        top: 10,
        click: function(e){
            Ti.UI.currentTab.open($.create({ type: "Window", url:'geo.js' }));
        }
    },{
        text: "Forum",
        styleClass: "categoryButton",
        top: 80,
        click: function(e){
            Ti.UI.currentTab.open($.create({ type: "Window", url:'forum.js' }));
        }
    },{
        text: "Twitter",
        styleClass: "categoryButton",
        top: 150,
        click: function(e){
            Ti.UI.currentTab.open($.create({ type: "Window", url:'tristania_twitter.js' }));
        }
    },{
        text: "Facebook",
        styleClass: "categoryButton",
        top: 220,
        click: function(e){
            Ti.UI.currentTab.open($.create({ type: "Window", url:'facebook.js' }));
        }
    }]
}));