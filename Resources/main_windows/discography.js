Ti.include("../assets/utils.js");
Ti.include("../assets/localdata.js");

win.title = "Discography";

function updateView(){
    win.rightNavButton = (LDATA.getUserData("favalbum") === albums[cfv.selected].id) ? delfav : addfav;
}

var albums = LDATA.getAlbums(),
    images = albums.map(function(a){ return "../pics/"+a.pic; }),
    addfav = $.create({
        type: "Button",
        image: '../pics/icon_unstar_light.png', 
        click: function(e){
            Ti.UI.createAlertDialog({ title: 'Album selected', message: 'Favourite album set to '+albums[cfv.selected].title }).show();
            LDATA.setUserData("favalbum",albums[cfv.selected].id);
            updateView();
        }
    }),
    delfav = $.create({
        type: "Button",
        image: '../pics/icon_star_light.png', 
        click: function(e){
            Ti.UI.createAlertDialog({ title: 'Favourite cleared', message: "No favourite album set" }).show();
            LDATA.removeUserData("favalbum");
            updateView();
        }
    }),
    cfv = $.create({ 
        type: "CoverFlowView",
        images:images,
        eventListeners: {
            click: function(e){
                Ti.UI.currentTab.open($.create({
                    type: "Window",
                    url:'album.js',
                    data: { id: albums[e.index].id }
                }));
            },
            change: updateView
        }
    });

win.addEventListener("focus",updateView);
win.add(cfv);
updateView();