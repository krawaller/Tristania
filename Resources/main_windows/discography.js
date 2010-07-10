Ti.include("../assets/utils.js");

var images = [], albums = $.getAlbums(), view;

albums.map(function(a){ images.push("../pics/"+a.pic); });

view = $.createCoverFlowView({ images:images });

view.addEventListener("click",function(e){
    var a = albums[e.index], win = $.createWin({
        url:'album.js',
        title: a.shorttitle,
        data: { id: a.id }
    });
    Ti.UI.currentTab.open(win);
});

win.add(view);