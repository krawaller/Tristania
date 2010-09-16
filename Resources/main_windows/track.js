Ti.include("../assets/utils.js");
Ti.include("../assets/localdata.js");

var id = win.data.id, track = LDATA.getTrack(id),  
    view = $.create({ type: "View" }),
    trackview = $.create({
        type: "WebView",
        templateFile: "track.tmpl",
        templateData: track
    }),
    lyrview;

win.title = track.title;
win.add(view);
view.add(trackview);

if (!track.instrumental){
    Ti.include("../assets/lyrics.js"); // creates global var lyrics
    lyrview = $.create({
        type: "WebView",
        templateFile: "lyrics.tmpl",
        templateData: lyrics[id],
        opacity: 0
    });
    view.add(lyrview);
    win.rightNavButton = $.create({
        type: "TabbedBar",
        labels: [
            "info", //{image: "../pics/info_light.png"},
            "lyrics" //{image: "../pics/icon_lyrics.png"}
        ],
        index: 0,
        click: function(e){
            [lyrview,trackview][e.index].animate({duration: 500, opacity: 0});
            [trackview,lyrview][e.index].animate({duration: 500, opacity: 1});
        }
    });
}
