Ti.include("../assets/utils.js");
Ti.include("../assets/localdata.js");

win.title = "Profile view";

function titlifyData(d){
    var tracks = {}, albums = LDATA.getAlbums();
    if (d.favalbum){
        d.favalbum = LDATA.getAlbum(d.favalbum).title;
    }
    d.favtracks = d.favtracks || {};
    for(var a in albums){
        tracks[ albums[a].title ] = d.favtracks[albums[a].id] ? LDATA.getTrack(d.favtracks[albums[a].id]).title : "";
    }
    d.favtracks = tracks;
    return d;
}

if (!win.user){
    win.rightNavButton = $.create({
        type: "Button",
        title: "edit",
        click: function(e){
            Ti.UI.currentTab.open($.create({ type: "Window", url:'profileedit.js' }));
        }
    });
}

win.add($.create({type: "WebView", templateFile: "profileview.tmpl", templateData: titlifyData(win.user || LDATA.getUserData())}));