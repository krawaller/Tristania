Ti.include("../assets/utils.js");

win.title = "Discography";

function updateView(){
    Ti.API.log(["CHECKING FAV!",$.getUserData("favalbum"),cfv.selected,albums[cfv.selected].id]);
    win.rightNavButton = ($.getUserData("favalbum") === albums[cfv.selected].id) ? delfav : addfav;
}

var albums = $.getAlbums(),
    images = albums.map(function(a){ return "../pics/"+a.pic; }),
    addfav = $.create({
        type: "Button",
        image: '../pics/icon_unstar.png', 
        click: function(e){
            Ti.UI.createAlertDialog({ title: 'Album selected', message: 'Favourite album set to '+albums[cfv.selected].title }).show();
            $.setUserData("favalbum",albums[cfv.selected].id);
            //Ti.App.Properties.setString("favalbum",albums[cfv.selected].shorttitle);
            updateView();
        }
    }),
    delfav = $.create({
        type: "Button",
        image: '../pics/icon_star.png', 
        click: function(e){
            Ti.UI.createAlertDialog({ title: 'Favourite cleared', message: "No favourite album set" }).show();
            $.removeUserData("favalbum");
            //Ti.App.Properties.setString("favalbum","");
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