Ti.include("../assets/utils.js");

var html = "<html><head><link rel='stylesheet' href='css/tristania.css' /><link rel='stylesheet' href='css/albuminfo.css' /></head><body>" + 
           "<img class='albumpic' src='pics/"+win.albumData.pic+"' />"+ 
           "<dl><dt>Year</dt><dd>"+win.albumData.year+"</dd>"+
           "<dt>Description</dt><dd>"+win.albumData.desc + "</dd>"+
           "</dl>"+
           "</body></html";
// onclick='openalbum("+win.albumData.scanalbum+");'

var flexSpace = Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});

var tabbedbar = $.createTabbedBar({
	labels:['Info', 'Tracks'],
	index:0
});

//win.setToolbar([flexSpace,tabbedbar,flexSpace]);
win.rightNavButton = tabbedbar;

function openalbum(which){
        Ti.UI.currentTab.open($.createWin({ // TODO - correct tab!
            url:'photoalbum.js',
            info: {
                num: which
            }
        }));
}

var webview = Titanium.UI.createWebView({
	html: html
});


var tracks = win.albumData.tracks, data = [];
/*
for (var i in tracks){
    data.push({
        title: tracks[i].title,
        trackData: tracks[i],
        left: 20, // TODO - doesn't work! how offset title to the right?
        label: {
            text: (Number(i)+1),
            right: undefined,
            left: 10
        }
    });
}
var table = $.createTableView({rows:data});
*/


var tinfo;
if (!tracks.sections){
    tinfo = {
        rows: tracks
    }
}
else {
    tinfo = tracks;
}

var table = $.createTableView(tinfo);


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
Ti.API.log(e.rowData);
    var win = $.createWin({
        url:'track.js',
        title: e.rowData.def.title
    });
    table.zIndex = 2;
    webview.zIndex = 1;
    win.trackData = e.rowData.def;
    Titanium.UI.currentTab.open(win);
});