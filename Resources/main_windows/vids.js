Ti.include("../assets/utils.js");

win.title = "Videos";

var OFFICIAL = 0, 
    PICKED = 1,
    webview = $.create({
        type: "WebView",
        url: '../views/videos.html',
        eventListeners: {
            load: function(e){
                webview.loaded = true;
            }
        }
    });

function renderList(vids){
	if(webview.loaded){
		webview.evalJS("render({ vids: "+JSON.stringify(vids)+"})");
	} else {
		webview.addEventListener('load', function(){ renderList(vids); });
	}
}

function render(what){
	renderList($[what == OFFICIAL ? "getOfficialVideos" : "getSelectedVideos"]());
}

win.rightNavButton = $.create({
    type: "TabbedBar",
    labels:['Official', 'Picked'],
    index:0,
    click: function(e){
	    render(e.index);
    }
}); 

win.add(webview);

render(OFFICIAL);

