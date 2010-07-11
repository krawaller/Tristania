Ti.include("../assets/utils.js");

win.title = "Videos";

var spinner = Ti.UI.createActivityIndicator({ style: Ti.UI.iPhone.ActivityIndicatorStyle.BIG }),
    OFFICIAL = 0, 
    PICKED = 1,
    tabbedbar = $.createTabbedBar({
        labels:['Official', 'Picked'],
        index:0
    }),
    webview = $.createWebView({ url: '../views/videos.html' });

win.rightNavButton = tabbedbar;

tabbedbar.addEventListener("click",function(e){
	render(e.index);
});

function render(what){
	win.add(spinner);
	spinner.show();
	switch(what){
		case OFFICIAL:
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
						};
					});
					renderList(vids);
			    }
			});
			break;
			
		case PICKED:
			$.ajax({
				url: "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D%22http%3A%2F%2Fspreadsheets.google.com%2Fpub%3Fkey%3D0Ap1WlO372vAndFpwNExPRGgycU93Z1gwSG1HN2NMN2c%26hl%3Den%26single%3Dtrue%26gid%3D0%26output%3Dcsv%22%20and%20columns%3D%22title%2Cvid%22&format=json",
				success: function(data){
					var vids = data.query.results.row.map(function(entry){
						return {
							title: entry.title,
							id: entry.vid
						};
					});
					renderList(vids);
			    }
			});
			break;
	}
}

function renderList(vids){
	if(webview.loaded){
		webview.evalJS("render({ vids: "+JSON.stringify(vids)+"})");
	} else {
		webview.addEventListener('load', function(){ renderList(vids); });
	}
	win.remove(spinner);
	spinner.hide();
}

win.add(webview);
webview.addEventListener('load', function(){
	webview.loaded = true;
});

render(OFFICIAL);
