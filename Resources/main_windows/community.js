Ti.include("../assets/utils.js");
    
win.title = "Community";

var view = $.create({
    type: "View",
    opacity: 0,
    childElements: [{
        text: "Map",
        styleClass: "categoryButton",
        top: 40,
        click: function(e){
            Ti.UI.currentTab.open($.create({ type: "Window", url:'geo.js' }));
        }
    },{
        text: "Forum",
        styleClass: "categoryButton",
        top: 110,
        click: function(e){
            Ti.UI.currentTab.open($.create({ type: "Window", url:'forum.js' }));
        }
    },{
        text: "Twitter",
        styleClass: "categoryButton",
        top: 180,
        click: function(e){
            //Ti.UI.currentTab.open($.create({ type: "Window", url:'tristania_twitter.js' }));
            Ti.App.fireEvent("openUrl",{url:"http://twitter.com/tristaniaband"});
        }
    },{
        text: "Facebook",
        styleClass: "categoryButton",
        top: 250,
        click: function(e){
            Ti.UI.currentTab.open($.create({ type: "Window", url:'facebook.js' }));
        }
    }]
});
win.add(view);
view.animate({opacity: 1, duration: 500});
