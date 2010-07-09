Ti.include("../assets/utils.js");
Ti.include("../assets/lyrics.js");

Ti.API.log(win.trackData);

var track = $.getTrack(win.trackData.id),
    text = "";

lyrics[win.trackData.id].map(function(p){
    var t = "";
    p.map(function(l){
        t += l + "<br/>";
    });
    text += "<p>"+t+"</p>";
});

var infohtml = "<html><head><link rel='stylesheet' href='css/tristania.css' /><link rel='stylesheet' href='css/trackinfo.css' /></head><body>" + win.trackData.title + 
               "</body></html",
    lyricshtml = "<html><head><link rel='stylesheet' href='css/tristania.css' /><link rel='stylesheet' href='css/lyrics.css' /></head><body>" + text + 
               "</body></html",
    flexSpace = Titanium.UI.createButton({
	    systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
    }),
    tabbedbar = $.createTabbedBar({
	labels:[{image: "../pics/info_light.png"}, {image: "../pics/icon_lyrics.png"}],
        index:0
    }),
    infoview = $.createWebView({ html: infohtml }),
    lyricsview = Titanium.UI.createWebView({ html: lyricshtml }),
    view = Ti.UI.createView({});

//win.setToolbar([flexSpace,tabbedbar,flexSpace]);
win.rightNavButton = tabbedbar;
view.add(lyricsview);
view.add(infoview);
win.add(view);

tabbedbar.addEventListener("click",function(e){
    switch(e.index){
        case 0: view.animate({view:infoview,transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT}); break;
        case 1: view.animate({view:lyricsview,transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT}); break;
    }
});