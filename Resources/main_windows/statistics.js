Ti.include("../assets/utils.js");
Ti.include("../assets/localdata.js");

win.title = "Statistics";

/***************************** old code **************************/
/************************************************************************************/

Ti.API.log("getting statistics!");



function titlifyStats(stats){
    if (Ti.App.Properties.getBool("titlifiedstats") || !stats){
        return stats;
    }
    var a,t,albums = LDATA.getAlbums();
    for(a in albums){
        var alb = LDATA.getAlbum(albums[a].id), tracks = alb.tracks.concat(alb.bonustracks || []);
        stats.favalbum.results[alb.title] = stats.favalbum.results[alb.id] || {
            votes: 0,
            percentage: 0
        };
        delete stats.favalbum.results[alb.id];
        stats.favtracks[alb.title] = {results: {}};
        for(t in tracks){
            var trk = LDATA.getTrack(tracks[t]);
            stats.favtracks[alb.title].results[trk.title] = (stats.favtracks[alb.id] || {results:{}}).results[trk.id] || {
                votes: 0,
                percentage: 0
            };
            delete (stats.favtracks[alb.id] || {results:{}}).results[trk.id];
        }
        delete stats.favtracks[alb.id];
    }
    Ti.App.Properties.setString("communitystats",JSON.stringify(stats));
    Ti.App.Properties.setBool("titlifiedstats",true);
    return stats;
}

var stats = titlifyStats(LDATA.getCommunityStatistics()),
    spinner = Ti.UI.createActivityIndicator({ style: Ti.UI.iPhone.ActivityIndicatorStyle.BIG });

if (!stats){
    $.create({
        type: "AlertDialog",
        title: "No statistics",
        message: "You haven't yet received any statistics from the server. Please try later!",
        click: function(e){
            win.close();
        }
    }).show();
}
else {
    win.add(spinner);
    spinner.show();
    win.add($.create({
        type: "WebView",
        templateFile: "statistics.tmpl",
        templateData: stats,
        eventListeners: {
            load: function(e){
                spinner.hide();
            }
        }
    }));
}