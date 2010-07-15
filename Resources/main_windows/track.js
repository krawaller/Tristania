Ti.include("../assets/utils.js");
var id = win.data.id;


    // ************************* Trackinfo code *******************
    
var track = $.getTrack(id),
    trackview = $.createKraWebView({templateFile: "track.tmpl", data: track}); //Ti.UI.createWebView({ url: '../views/track.html' });

win.title = track.title;

// trackview.addEventListener("load",function(){ trackview.evalJS("render({ track: "+JSON.stringify(track)+" })"); });


    // ************************ Lyrics code ***********************

if (!track.instrumental){
    Ti.include("../assets/lyrics.js"); // creates global var lyrics
    var lyr = lyrics[id],
        lyricsview = $.createKraWebView({templateFile: "lyrics.tmpl",data: lyr}), //Ti.UI.createWebView({ url: '../views/lyrics.html' });
        tabbedbar = $.createTabbedBar({
	    labels:[{image: "../pics/info_light.png"}, {image: "../pics/icon_lyrics.png"}],
            index:0
        });

    
    win.rightNavButton = tabbedbar;
    view = $.createView({});
    win.add(view);
    view.add(lyricsview);    
    view.add(trackview);

    tabbedbar.addEventListener("click",function(e){
        switch(e.index){
            case 0: view.animate({view:trackview,transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT}); break;
            case 1: view.animate({view:lyricsview,transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT}); break;
        }
    });
} else {
    win.add(trackview);
}

//lyricsview.addEventListener("load",function(){ lyricsview.evalJS("render({ lyrics: "+JSON.stringify(lyr)+" })"); });


