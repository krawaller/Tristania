Ti.include("../assets/utils.js");
var id = win.data.id;


    // ************************* Trackinfo code *******************
    
var track = $.getTrack(id),
    trackview = Ti.UI.createWebView({ url: '../views/track.html' });

trackview.addEventListener("load",function(){ trackview.evalJS("render({ track: "+JSON.stringify(track)+" })"); });


    // ************************ Lyrics code ***********************

Ti.include("../assets/lyrics.js"); // creates global var lyrics

var lyr = lyrics[id],
    lyricsview = Ti.UI.createWebView({ url: '../views/lyrics.html' });

lyricsview.addEventListener("load",function(){ lyricsview.evalJS("render({ lyrics: "+JSON.stringify(lyr)+" })"); });


    // *********************** Main page code *********************

var tabbedbar = $.createTabbedBar({
	labels:[{image: "../pics/info_light.png"}, {image: "../pics/icon_lyrics.png"}],
        index:0
    }),
    view = $.createView({});
    
win.rightNavButton = tabbedbar;
view.add(lyricsview);
view.add(trackview);
win.add(view);

tabbedbar.addEventListener("click",function(e){
    switch(e.index){
        case 0: view.animate({view:trackview,transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT}); break;
        case 1: view.animate({view:lyricsview,transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT}); break;
    }
});
