Ti.include("../assets/utils.js");

var infohtml = "<html><head><link rel='stylesheet' href='css/tristania.css' /><link rel='stylesheet' href='css/trackinfo.css' /></head><body>" + Titanium.UI.currentWindow.trackData.info + 
               "</body></html",
    lyricshtml = "<html><head><link rel='stylesheet' href='css/tristania.css' /><link rel='stylesheet' href='css/lyrics.css' /></head><body>" + Titanium.UI.currentWindow.trackData.lyrics + 
               "</body></html",
    flexSpace = Titanium.UI.createButton({
	    systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
    }),
    tabbedbar = $.createTabbedBar({
	    labels:['Info', 'Lyrics'],
        index:0
    }),
    infoview = $.createWebView({ html: infohtml }),
    lyricsview = Titanium.UI.createWebView({ html: lyricshtml }),
    view = Ti.UI.createView({});

win.setToolbar([flexSpace,tabbedbar,flexSpace]);
view.add(lyricsview);
view.add(infoview);
win.add(view);

tabbedbar.addEventListener("click",function(e){
    switch(e.index){
        case 0: view.animate({view:infoview,transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT}); break;
        case 1: view.animate({view:lyricsview,transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT}); break;
    }
});