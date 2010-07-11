Ti.include("../assets/utils.js");

var album = $.getAlbum(win.data.id),
    flexSpace = Titanium.UI.createButton({systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE}),
    tabbedbar = $.createTabbedBar({ labels:[{image: "../pics/info_light.png"}, {image: "../pics/icon_tracks.png"}], index:0 }),
    webview,
    view = $.createView({}),
    table;
    
win.title = album.shorttitle;

    // Set up navigation between views

win.rightNavButton = tabbedbar;

tabbedbar.addEventListener("click",function(e){
    switch(e.index){
        case 0: view.animate({view:webview,transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT}); break;
        case 1: view.animate({view:table,transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT}); break;
    }
});


    // Build the table with tracks

var tinfo;
if (album.bonustracks){
    tinfo = {
        sections: [{
            headerTitle: "Main tracks",
            datarows: $.getTracks(album.tracks)
        },{
            headerTitle: "Bonus tracks",
            datarows: $.getTracks(album.bonustracks)
        }]
    };
}
else {
    tinfo = { rows: $.getTracks(album.tracks) }
}
table = $.createTableView(tinfo);

table.addEventListener("click",function(e){
    var win = $.createWin({ url:'track.js' });
    table.zIndex = 2;
    webview.zIndex = 1;
    win.data = e.rowData.def;
    Titanium.UI.currentTab.open(win);
});

view.add(table);


    // Build the webview with info

webview = $.createWebView({url:  '../views/album.html'});
webview.addEventListener("load",function(){ webview.evalJS("render({ album: "+JSON.stringify(album)+"})"); });
view.add(webview);


    // finishing up
    
win.add(view);