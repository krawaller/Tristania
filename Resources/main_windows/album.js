Ti.include("../assets/utils.js");
Ti.include("../assets/localdata.js");

var album = LDATA.getAlbum(win.data.id);

win.title = album.shorttitle;

function fixTrack(t){
    t.childElements = [{
        id: "favButton",
        type: "View",
        backgroundImage: "../pics/icon_unstar_dark.png",
        click: function(e){
            if (LDATA.getFavouriteTrack(album.id) == t.id){
                $.create({
                    type: "AlertDialog",
                    title: "Favourite cleared",
                    message: "No favourite track selected"
                }).show();
                e.source.backgroundImage = "../pics/icon_unstar_dark.png";
                currentElem = null;
                LDATA.setFavouriteTrack(album.id);
                return;
            }
            if (currentElem){
                currentElem.backgroundImage = "../pics/icon_unstar_dark.png";
            }
            e.source.backgroundImage = "../pics/icon_star_dark.png";
            currentElem = e.source;
            LDATA.setFavouriteTrack(album.id,t.id);
            $.create({
                type: "AlertDialog",
                title: "Favourite selected",
                message: "Favourite track on "+album.title+" set to "+LDATA.getTrack(t.id).title+"."
            }).show();
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
        childElements: !album.bonustracks ? $.map(LDATA.getTracks(album.tracks),fixTrack) : [{
            type: "TableViewSection",
            id: "mainTracks",
            headerTitle: "Main tracks",
            childElements: $.map(LDATA.getTracks(album.tracks),fixTrack)
        },{
            type: "TableViewSection",
            id: "bonusTracks",
            headerTitle: "Bonus tracks",
            childElements: $.map(LDATA.getTracks(album.bonustracks),fixTrack)
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
       "info", //{image: "../pics/info_light.png"}, 
       "tracks" //{image: "../pics/icon_tracks.png"}
    ], 
    index:0,
    click: function(e){
        view.childrenById[e.index == 0 ? "albumInfo" : "trackList"].animate({duration: 500, opacity: 1});
        view.childrenById[e.index == 1 ? "albumInfo" : "trackList"].animate({duration: 500, opacity: 0});
    }
});

// ************** Select current favourite, if any! ***********************

var currentFav = LDATA.getFavouriteTrack(album.id),
    tlist = view.childrenById.trackList.childrenById,
    currentElem = currentFav ? 
        album.bonustracks ? 
            (tlist.mainTracks.childrenById[currentFav] || tlist.bonusTracks.childrenById[currentFav]) : tlist[currentFav]
        : null;
        
if (currentElem){
    currentElem = currentElem.childrenById.favButton;
    currentElem.backgroundImage = "../pics/icon_star_dark.png";
}




