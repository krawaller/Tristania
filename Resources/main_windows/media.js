Ti.include("../assets/utils.js");
    
win.title = "Media";

var view = $.create({
    type: "View",
    opacity: 0,
    childElements: [{
        text: "Pictures",
        styleClass: "categoryButton",
        top: 110,
        click: function(e){
            Ti.UI.currentTab.open($.create({ type: "Window", url:'picturegallery.js' }));
        }
    },{
        text: "Videos",
        styleClass: "categoryButton",
        top: 180,
        click: function(e){
            Ti.UI.currentTab.open($.create({ type: "Window", url:'vids.js' }));
        }
    }]
})
win.add(view);
view.animate({opacity: 1, duration: 500});