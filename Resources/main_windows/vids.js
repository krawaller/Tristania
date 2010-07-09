Ti.include("../assets/utils.js");
$.msg({ text:'Videos!' });


Ti.App.addEventListener('error', function(e){
    Ti.UI.createAlertDialog({ title: 'Error', message: JSON.stringify(e) }).show();	
});

var webview = Ti.UI.createWebView({
	url: '../views/videos.html'
});

$.ajax({
	url: "http://gdata.youtube.com/feeds/api/videos?q=&author=TristaniaVideos&orderby=published&v=2&alt=json",
	success: function(data){
		var vids = data.feed.entry.map(function(entry){
			return {
				title: entry.title.$t,
				id: entry.media$group.yt$videoid.$t,
				duration: entry.media$group.yt$duration.seconds,
			    description: entry.media$group.media$description.$t,
			    thumbnail: entry.media$group.media$thumbnail[0].url
			}
		});
		renderList(vids);
    }
});

win.add(webview);
webview.addEventListener('load', function(){
	webview.loaded = true;
});

function renderList(vids){
	if(webview.loaded){
		webview.evalJS("render({ vids: "+JSON.stringify(vids)+"})");
	} else {
		webview.addEventListener('load', function(){ renderList(vids); });
	}	
}
