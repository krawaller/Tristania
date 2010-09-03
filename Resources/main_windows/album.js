Ti.include("../assets/utils.js");

var album = $.getAlbum(win.data.id);

win.title = album.shorttitle;

function getFavouriteTracks(){ return JSON.parse(Ti.App.Properties.getString('favTracks') || "{}"); }
function setFavouriteTrack(aid,tid){
    var favs = getFavouriteTracks();
    favs[aid] = tid;
    Ti.App.Properties.setString("favTracks",JSON.stringify(favs));
}

function fixTrack(t){
    t.childElements = [{
        id: "favButton",
        type: "View",
        backgroundImage: "../pics/icon_unstar.png",
        click: function(e){
            if (currentElem){
                currentElem.backgroundImage = "../pics/icon_unstar.png";
            }
            e.source.backgroundImage = "../pics/icon_star.png";
            currentElem = e.source;
            setFavouriteTrack(album.id,t.id);
            alert("Favourite track on "+album.title+" set to "+$.getTrack(t.id).title+".");
        },
        width: "25px",
        height: "25px",
        zIndex: 2,
        left: 5
    },{
        text: t.title,
        styleClass: "tableviewrowmainlabel",
        click: function(e){
            var win = $.create({ type: "Window", url:'track.js' });
            win.data = t;
            Titanium.UI.currentTab.open(win);
        },
        left: 35
    }];
    delete t.title;
};

var view = $.create({
    type: "View",
    childElements: [{
        id: "trackList",
        type: "TableView",
        opacity: 0,
        childElements: !album.bonustracks ? $.map($.getTracks(album.tracks),fixTrack) : [{
            type: "TableViewSection",
            id: "mainTracks",
            headerTitle: "Main tracks",
            childElements: $.map($.getTracks(album.tracks),fixTrack)
        },{
            type: "TableViewSection",
            id: "bonusTracks",
            headerTitle: "Bonus tracks",
            childElements: $.map($.getTracks(album.bonustracks),fixTrack)
        }]
    },{
        id: "albumInfo",
        type: "WebView",
        templateFile: "album.tmpl",
        templateData: album
    }]
});

win.add(view);

win.rightNavButton = $.create({ 
    type: "TabbedBar",
    labels:[
       {image: "../pics/info_light.png"}, 
      "T" // {image: "../pics/icon_tracks.png"}
    ], 
    index:0,
    click: function(e){
        view.childrenById[e.index == 0 ? "albumInfo" : "trackList"].animate({duration: 500, opacity: 1});
        view.childrenById[e.index == 1 ? "albumInfo" : "trackList"].animate({duration: 500, opacity: 0});
    }
});

// ************** Select current favourite, if any! ***********************

var currentFav = getFavouriteTracks()[album.id],
    tlist = view.childrenById.trackList.childrenById,
    currentElem = currentFav ? 
        album.bonustracks ? 
            (tlist.mainTracks.childrenById[currentFav] || tlist.bonusTracks.childrenById[currentFav]) : tlist[currentFav]
        : null;
        
if (currentElem){
    currentElem = currentElem.childrenById.favButton;
    currentElem.backgroundImage = "../pics/icon_star.png";
}




