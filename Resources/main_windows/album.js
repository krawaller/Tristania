Ti.include("../assets/utils.js");

var html = "<html><head><link rel='stylesheet' href='css/tristania.css' /><link rel='stylesheet' href='css/albuminfo.css' /></head><body>" + Titanium.UI.currentWindow.albumData.desc + 
           "</body></html";

var flexSpace = Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});

var tabbedbar = $.createTabbedBar({
	labels:['Info', 'Tracks'],
	index:0
});

win.setToolbar([flexSpace,tabbedbar,flexSpace]);

var webview = Titanium.UI.createWebView({
	html: html
});


var tracks = win.albumData.tracks, data = [];

for (var i in tracks){
    data.push({
        title: (Number(i)+1)+" "+tracks[i].title,
        trackData: tracks[i]
    });
}

var table = Titanium.UI.createTableView({data:data});

var view = Ti.UI.createView({});

view.add(table);
view.add(webview);

win.add(view);

tabbedbar.addEventListener("click",function(e){
    switch(e.index){
        case 0: Ti.API.debug(view.animate({view:webview,transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT})); break;
        case 1: view.animate({view:table,transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT}); break;
    }
});

table.addEventListener("click",function(e){
    var win = $.createWin({
        url:'track.js',
        title: e.rowData.trackData.title,
    });
    table.zIndex = 2;
    webview.zIndex = 1;
    win.trackData = e.rowData.trackData;
    Titanium.UI.currentTab.open(win);
});