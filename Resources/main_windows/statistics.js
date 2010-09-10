Ti.include("../assets/utils.js");

win.title = "Statistics";

function getFakeStats(){
    var ret = {
        members: 210,
        favalbums: {},
        favtracks: {}
    },
        albums = $.getAlbums();
    for(var a in albums){
        var album = $.getAlbum(albums[a].id);
        ret.favalbums[album.title] = Math.floor(Math.random()*100);
        ret.favtracks[album.title] = {};
        var atracks = album.tracks.concat(album.bonustracks || []);
        for(var t in atracks){
            ret.favtracks[album.title][$.getTrack(atracks[t]).title] = Math.floor(Math.random()*100);
        }
    }
    Ti.API.log(ret);
    return ret;
}

win.add($.create({type: "WebView", templateFile: "statistics.tmpl", templateData:getFakeStats()}));