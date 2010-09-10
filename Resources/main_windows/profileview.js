Ti.include("../assets/utils.js");

win.title = "Profile view";

function titlifyData(d){
    var albums = $.getAlbums();
    if (d.favalbum){
        d.favalbum = $.getAlbum(d.favalbum).title;
    }
    d.favtracks = {};
    for(var a in albums){
        var album = albums[a];
        if (d[album.id]){
            d.favtracks[ album.title ] = $.getTrack(d[album.id]).title;
        }
    }
    return d;
}

win.add($.create({type: "WebView", templateFile: "profileview.tmpl", templateData: titlifyData(win.user || $.getUserData())}));