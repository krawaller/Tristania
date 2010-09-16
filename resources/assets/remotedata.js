RDATA = {
    load: function(what,o,callback){
        Ti.API.log("...loading "+what);
        $.ajax($.merge({
            url: RDATA.sources[what].url,
			quoteFix: RDATA.sources[what].quoteFix,
            success: function(data){
                RDATA.sources[what].success(data);
                Ti.API.log("......loaded "+what+"!");
                if (callback){
                    callback(what);
                }
            }
        },o));
    },
    loadAll: function(o,callback){
        Ti.API.log("Loading all!");
        for(var s in RDATA.sources){
            RDATA.load(s,o,callback);
        }
    },
    sources: {
        news: {
            url: "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20feed%20where%20url%20%3D%20%22http%3A%2F%2Fwww.tristania.com%2F2010%2Findex.php%2Ffeed%22&format=json",
            success: function(data){
                var newslist = [], rows = data.query.results.item instanceof Array ? data.query.results.item : [data.query.results.item];
                rows.map(function(news){
                    newslist.push({
                        date: news.pubDate.substr(0,news.pubDate.length-15),
                        title: news.title,
                        content: news.encoded
                    });
		        });
                Ti.App.Properties.setString("news",JSON.stringify(newslist));
            }
        },
        spreadsheet: {
            url: "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%20%3D%20%22https%3A%2F%2Fspreadsheets.google.com%2Fpub%3Fkey%3D0AtXFhtKoQjGsdHpOSUd0TThVSHBRQlNPQUNQTkZQSUE%26hl%3Den%26output%3Dcsv%22&format=json&callback=",
            quoteFix: true,
			success: function(data){
                var store = {
                    presentations: {},
                    comments: {},
                    selectedvideos: [],
                    selectedphotoalbums: []
                },
                    rows = data.query.results.row,
                    len = rows.length;
                for(var i=0;i<len;i++){
                    var table = rows[i].col1, j = i+1;
                    switch(table){
                        case "APPDATA":
                            store.appdata = {
                                info: rows[i+1].col0.replace(/"$/,"").replace(/^"/,""),
                                date: rows[i+1].col1
                            };
                            i+= 1;
                            break;
                        case "HISTORY":
                            store.history = {
                                info: rows[i+1].col0.replace(/"$/,"").replace(/^"/,""),
                                date: rows[i+1].col1
                            };
                            i+= 1;
                            break;
                        case "PRESENTATIONS":
                            while(j<len && rows[j].col0!="TABLE"){
                                store.presentations[rows[j].col0] = rows[j].col1.replace(/"/g,"");
                                j++;
                            }
                            i = j - 1;
                            break;
                        case "COMMENTS":
                            while(j<len && rows[j].col0!="TABLE"){
                                var about = rows[j].col1;
                                if (!store.comments[about]){
                                    store.comments[about] = [];
                                }
                                store.comments[about].push({
                                    by: rows[j].col0,
                                    date: rows[j].col2,
                                    content: rows[j].col3.replace(/"$/,"").replace(/^"/,"")
                                });
                                j++;
                            }
                            i = j - 1;
                            break;
                        case "SELECTEDVIDEOS":
                            while(j<len && rows[j].col0!="TABLE"){
                                store.selectedvideos.push({
                                    title: rows[j].col0,
                                    id: rows[j].col1
                                });
                                j++;
                            }
                            i = j - 1;
                            break;
                        case "SELECTEDPHOTOALBUMS":
                            while(j<len && rows[j].col0!="TABLE"){
                                store.selectedphotoalbums.push({
                                    title: rows[j].col0,
                                    id: rows[j].col1,
                                    pics: rows[j].col2
                                });
                                j++;
                            }
                            i = j - 1;
                            break;
                    }
                }
				
                Ti.App.Properties.setString("appdata",JSON.stringify(store.appdata));
        		Ti.App.Properties.setString("comments",JSON.stringify(store.comments));
        		Ti.App.Properties.setString("presentations",JSON.stringify(store.presentations));
        		Ti.App.Properties.setString("selectedvideos",JSON.stringify(store.selectedvideos));
        		Ti.App.Properties.setString("photoalbums",JSON.stringify(store.selectedphotoalbums));
        		Ti.App.Properties.setString("history",JSON.stringify(store.history));
            }
        },
        videos: {
            url: "http://gdata.youtube.com/feeds/api/videos?q=&author=TristaniaVideos&orderby=published&v=2&alt=json",
            success:  function(data){
                if (typeof data === "string"){ data = JSON.parse(data); }
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
        	}
        },
        community: {
            url: "",
            success: function(data){
                // storing community members
                Ti.App.Properties.setString("communitymembers",JSON.stringify(data.members));
                // deal with titlifying stats and storing them
                var stats = data.stats,a,t,albums = $.getAlbums();
                for(a in albums){
                    var alb = $.getAlbum(albums[a].id), tracks = alb.tracks.concat(alb.bonustracks || []);
                    stats.favalbum.results[alb.title] = stats.favalbum.results[alb.id] || {
                        votes: 0,
                        percentage: 0
                    };
                    delete stats.favalbum.results[alb.id];
                    stats.favtracks[alb.title] = {results: {}};
                    for(t in tracks){
                        var trk = $.getTrack(tracks[t]);
                        stats.favtracks[alb.title].results[trk.title] = (stats.favtracks[alb.id] || {results:{}}).results[trk.id] || {
                            votes: 0,
                            percentage: 0
                        };
                        delete (stats.favtracks[alb.id] || {results:{}}).results[trk.id];
                    }
                    delete stats.favtracks[alb.id];
                }
                Ti.App.Properties.setString("communitystats",JSON.stringify(stats));
            }
        }
    }
}