Ti.include("../assets/utils.js");
    
win.title = "Info";

win.add( $.create({
    type: "View",
    childElements: [{
        styleClass: "categoryButton",
        text: "News",
        templateData: {text:"News"},
        top: 10,
        click: function(e){
            Ti.UI.currentTab.open($.create({ type: "Window", url:'newslist.js' }));
        }
    },{
        styleClass: "categoryButton",
        text: "Biography",
        templateData: {text:"Biography"},
        top: 80,
        click: function(e){
            Ti.UI.currentTab.open($.create({ type: "Window", url:'biolist.js' }));
        }
    },{
        styleClass: "categoryButton",
        text: "Discography",
        templateData: {text:"Discography"}, 
        top: 150,
        click: function(e){
            Ti.UI.currentTab.open($.create({ type: "Window", url:'discography.js' }));
        }
    }]
}));

/*
win.add($.create({

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
})); */