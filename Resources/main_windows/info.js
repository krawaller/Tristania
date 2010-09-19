Ti.include("../assets/utils.js");
    
win.title = "Info";
var spinner = Ti.UI.createActivityIndicator({
	width: 80,
	height: 80,
	borderRadius: 20,
	backgroundColor: '#000',
	opacity: 0.8,
	zIndex: 1337,
	style: Titanium.UI.iPhone.ActivityIndicatorStyle.BIG
});
win.add(spinner);
spinner.show();

setTimeout(function(){
var view = $.create({
    type: "View",
	opacity: 0,
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
});
win.add(view);
spinner.hide();
view.animate({opacity: 1, duration: 500});
}, 200);
