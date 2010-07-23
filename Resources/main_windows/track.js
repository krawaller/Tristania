Ti.include("../assets/utils.js");

var id = win.data.id, track = $.getTrack(id),  view = $.create({ type: "View" }), lyrview, trackview;

win.title = track.title;
win.add(view);

if (!track.instrumental){
    Ti.include("../assets/lyrics.js"); // creates global var lyrics
    lyrview = $.create({
        type: "WebView",
        templateFile: "lyrics.tmpl",
        templateData: lyrics[id],
    });
    view.add(lyrview);
    win.rightNavButton = $.create({
        type: "TabbedBar",
        labels: [{image: "../pics/info_light.png"}, "L"  /* {image: "../pics/icon_lyrics.png"} */ ],
        index: 0,
        click: function(e){
            view.animate({view:e.index ? lyrview : trackview,transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT});
        }
    });
}

trackview = $.create({
    type: "WebView",
    templateFile: "track.tmpl",
    templateData: track
});

view.add(trackview);
