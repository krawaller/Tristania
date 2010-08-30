Ti.include("../assets/utils.js");

win.title = "Discography";

function updateView(){
    win.rightNavButton = Ti.App.Properties.getString("favalbum") === albums[cfv.selected].shorttitle ? delfav : addfav;
}

var albums = $.getAlbums(),
    images = albums.map(function(a){ return "../pics/"+a.pic; }),
    addfav = $.create({
        type: "Button",
        image: '../pics/icon_unstar.png', 
        click: function(e){
            Ti.UI.createAlertDialog({ title: 'Album selected', message: 'Favourite album set to '+albums[cfv.selected].title }).show();
            Ti.App.Properties.setString("favalbum",albums[cfv.selected].shorttitle);
            updateView();
        }
    }),
    delfav = $.create({
        type: "Button",
        image: '../pics/icon_star.png', 
        click: function(e){
            Ti.UI.createAlertDialog({ title: 'Favourite cleared', message: "No favourite album set" }).show();
            Ti.App.Properties.setString("favalbum","");
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