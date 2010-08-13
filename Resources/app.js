Ti.include("assets/utils.js");



// deal with data fixture
if (!Ti.App.Properties.getBool("hasFixtures")){ // first time app is run! we store fixtures in the database
    Ti.include("assets/fixtures.js"); // creates global fixtures variable
    for(var p in fixtures){
        Ti.API.log("Storing "+p);
        Ti.API.log(fixtures[p]);
        Ti.App.Properties.setString(p,JSON.stringify(fixtures[p]));
    }
    Ti.App.Properties.setBool("hasFixtures",true);
}


/*
videos:
https://spreadsheets.google.com/pub?key=0AtXFhtKoQjGsdFU1Mk8zMHFOLWJGVGJubnN1NXMzb2c&hl=en&output=csv
http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%20%3D%20%22https%3A%2F%2Fspreadsheets.google.com%2Fpub%3Fkey%3D0AtXFhtKoQjGsdFU1Mk8zMHFOLWJGVGJubnN1NXMzb2c%26hl%3Den%26output%3Dcsv%22&format=json

photoalbums:
https://spreadsheets.google.com/pub?key=0AtXFhtKoQjGsdF9rSXpsbUp5eTU5dmh4ZG5RTk9tYmc&hl=en&output=csv
http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%20%3D%20%22https%3A%2F%2Fspreadsheets.google.com%2Fpub%3Fkey%3D0AtXFhtKoQjGsdF9rSXpsbUp5eTU5dmh4ZG5RTk9tYmc%26hl%3Den%26output%3Dcsv%22&format=json

comments:
https://spreadsheets.google.com/pub?key=0AtXFhtKoQjGsdDlod0RsUUlkclZIY3puSlpTeTRFZlE&hl=en&output=csv
http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%20%3D%20%22https%3A%2F%2Fspreadsheets.google.com%2Fpub%3Fkey%3D0AtXFhtKoQjGsdDlod0RsUUlkclZIY3puSlpTeTRFZlE%26hl%3Den%26output%3Dcsv%22&format=json

presentations:
https://spreadsheets.google.com/pub?key=0AtXFhtKoQjGsdHFINVcyNExtdXBBWlBGUmRoT1Nvamc&hl=en&output=csv
http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%20%3D%20%22https%3A%2F%2Fspreadsheets.google.com%2Fpub%3Fkey%3D0AtXFhtKoQjGsdHFINVcyNExtdXBBWlBGUmRoT1Nvamc%26hl%3Den%26output%3Dcsv%22&format=json

news:
https://spreadsheets.google.com/pub?key=0AtXFhtKoQjGsdFc1bnhoXzBBc0pKU2gyVUduZE9vd3c&hl=en&output=csv
http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%20%3D%20%22https%3A%2F%2Fspreadsheets.google.com%2Fpub%3Fkey%3D0AtXFhtKoQjGsdFc1bnhoXzBBc0pKU2gyVUduZE9vd3c%26hl%3Den%26output%3Dcsv%22&format=json
*/

// TODO - load all at once from opentable

// loading news
$.ajax({
    url: "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%20%3D%20%22https%3A%2F%2Fspreadsheets.google.com%2Fpub%3Fkey%3D0AtXFhtKoQjGsdFc1bnhoXzBBc0pKU2gyVUduZE9vd3c%26hl%3Den%26output%3Dcsv%22&format=json",
    success: function(data){
	    var newslist = [], rows = data.query.results.row instanceof Array ? data.query.results.row : [data.query.results.row];
	    rows.map(function(news){
		    newslist.push({
		        date: news.col0,
		        title: news.col1,
		        content: news.col2
		    });
		});
		Ti.App.Properties.setString("news",JSON.stringify(newslist));
		Ti.API.log("UPDATED NEWS!");
	}
});

// loading comments
$.ajax({
    url: "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%20%3D%20%22https%3A%2F%2Fspreadsheets.google.com%2Fpub%3Fkey%3D0AtXFhtKoQjGsdDlod0RsUUlkclZIY3puSlpTeTRFZlE%26hl%3Den%26output%3Dcsv%22&format=json",
    success: function(data){
	    var commentlist = {}, rows = data.query.results.row instanceof Array ? data.query.results.row : [data.query.results.row];
	    rows.map(function(comment){
	        var about = comment.col1;
	        if (!commentlist[about]){
	            commentlist[about] = [];
	        }
		    commentlist[about].push({
		        by: comment.col0,
		        date: comment.col2,
		        content: comment.col3
		    });
		});
		Ti.App.Properties.setString("comments",JSON.stringify(commentlist));
		Ti.API.log("UPDATED COMMENTS!");
	}
});

// loading presentations
$.ajax({
    url: "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%20%3D%20%22https%3A%2F%2Fspreadsheets.google.com%2Fpub%3Fkey%3D0AtXFhtKoQjGsdHFINVcyNExtdXBBWlBGUmRoT1Nvamc%26hl%3Den%26output%3Dcsv%22&format=json",
    success: function(data){
	    var presentations = {}, rows = data.query.results.row instanceof Array ? data.query.results.row : [data.query.results.row];
	    rows.map(function(pres){
	        presentations[pres.col0] = pres.col1;
		});
		Ti.App.Properties.setString("presentations",JSON.stringify(presentations));
		Ti.API.log("UPDATED PRESENTATIONS");
	}
});

// loading selected videos
$.ajax({
    url: "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%20%3D%20%22https%3A%2F%2Fspreadsheets.google.com%2Fpub%3Fkey%3D0AtXFhtKoQjGsdFU1Mk8zMHFOLWJGVGJubnN1NXMzb2c%26hl%3Den%26output%3Dcsv%22&format=json",
    success: function(data){
	    var videos = [], rows = data.query.results.row instanceof Array ? data.query.results.row : [data.query.results.row];
	    rows.map(function(vid){
	        videos.push({
	            title:vid.col0,
	            id:vid.col1
	        });
		});
		Ti.App.Properties.setString("selectedvideos",JSON.stringify(videos));
		Ti.API.log("UPDATED SELECTED VIDEOS");
	}
});

// loading official videos
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
		Ti.App.Properties.setString("officialvideos",JSON.stringify(vids));
		Ti.API.log("UPDATED OFFICIAL VIDEOS");
	}
});

// loading spotlighted photoalbums
$.ajax({
    url: "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%20%3D%20%22https%3A%2F%2Fspreadsheets.google.com%2Fpub%3Fkey%3D0AtXFhtKoQjGsdF9rSXpsbUp5eTU5dmh4ZG5RTk9tYmc%26hl%3Den%26output%3Dcsv%22&format=json",
	success: function(data){
	    var photoalbums = [], rows = data.query.results.row instanceof Array ? data.query.results.row : [data.query.results.row];
	    rows.map(function(p){
	        photoalbums.push({
	            title:p.col0,
	            id:p.col1
	        });
		});
		Ti.App.Properties.setString("photoalbums",JSON.stringify(photoalbums));
		Ti.API.log("UPDATED PHOTOALBUMS");
	}
});







// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Ti.UI.setBackgroundColor('#000');

// create tab group
var tabGroup = $.create({type:"TabGroup"});

[{icon:"info.png",title:"Info",url:"info.js"},
 {icon:"discography.png",title:"Discography",url:"discography.js"},
 {icon:"pictures.png",title:"Gallery",url:"gallery.js"},
 {icon:"videos.png",title:"Videos",url:"vids.js"},
 {icon:"community.png",title:"Community",url:"community.js"}].map(function(t){
    tabGroup.addTab( $.create({
        type: "Tab",
        icon:"pics/icon_tab_"+t.icon,title:t.title,
        window:$.create({type:"Window",url: "main_windows/"+t.url})
    }) );
});

// open tab group
tabGroup.open({ transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT });

