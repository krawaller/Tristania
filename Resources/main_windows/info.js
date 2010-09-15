Ti.include("../assets/utils.js");
    
win.title = "Info";

win.add( $.create({
    type: "View",
    childElements: [{
        styleClass: "categoryButton",
        text: "News",
        top: 40,
        click: function(e){
            Ti.UI.currentTab.open($.create({ type: "Window", url:'newslist.js' }));
        }
    },{
        styleClass: "categoryButton",
        text: "Biography",
        top: 110,
        click: function(e){
            Ti.UI.currentTab.open($.create({ type: "Window", url:'biolist.js' }));
        }
    },{
        styleClass: "categoryButton",
        text: "Discography",
        top: 180,
        click: function(e){
            Ti.UI.currentTab.open($.create({ type: "Window", url:'discography.js' }));
        }
    },{
        styleClass: "categoryButton",
        text: "History",
        top: 250,
        click: function(e){
            Ti.UI.currentTab.open($.create({ type: "Window", url:'history.js' }));
        }
    }]
}));