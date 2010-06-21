Ti.include("../assets/utils.js");

var infohtml = "<html><head><link rel='stylesheet' href='css/tristania.css' /><link rel='stylesheet' href='css/trackinfo.css' /></head><body>" + Titanium.UI.currentWindow.trackData.info + 
               "</body></html";

var lyricshtml = "<html><head><link rel='stylesheet' href='css/tristania.css' /><link rel='stylesheet' href='css/lyrics.css' /></head><body>" + Titanium.UI.currentWindow.trackData.lyrics + 
               "</body></html";
               
var win = Titanium.UI.currentWindow;

var flexSpace = Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});

var tabbedbar = $.createTabbedBar({
	labels:['Info', 'Lyrics'],
	index:0
});

win.setToolbar([flexSpace,tabbedbar,flexSpace]);

var infoview = Titanium.UI.createWebView({ html: infohtml });
var lyricsview = Titanium.UI.createWebView({ html: lyricshtml });

var view = Ti.UI.createView({});

view.add(lyricsview);
view.add(infoview);

win.add(view);

tabbedbar.addEventListener("click",function(e){
    switch(e.index){
        case 0: view.animate({view:infoview,transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT}); break;
        case 1: view.animate({view:lyricsview,transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT}); break;
    }
});