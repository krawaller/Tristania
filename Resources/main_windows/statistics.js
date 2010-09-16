Ti.include("../assets/utils.js");
Ti.include("../assets/localdata.js");

win.title = "Statistics";

/***************************** FAKE A DATA DELIVERY FROM DB **************************/

/*
Ti.API.log("SENDING");
    
    
$.receiveCommunityData({
    members: {
        666: {
            username: "shithead",
            presentation: "mooo boo",
            favalbum: "rubicon",
            favtracks: {
                rubicon: "yearoftherat",
            }
        }
    },
    stats: {
         members: 45,
         favalbum: {
             votes: 2,
             results: {
                 rubicon: {
                     votes: 1,
                     percentage: 50,
                 },
                 ashes: {
                     votes: 1,
                     percentage: 50
                 }
             }
         },
         favtracks: {
             rubicon: {
                 votes: 3,
                 results: {
                     yearoftherat: {
                         votes: 1,
                         percentage: 33
                     },
                     thepassing: {
                         votes: 5,
                         percentage: 33
                     },
                     illuminationtrack: {
                         votes: 2,
                         percentage: 33
                     }
                 }
             },
             beyondtheveil: {
                 votes: 5,
                 results: {
                     angina: {
                         votes: 5,
                         percentage: 100
                     }
                 }
             }
         }
     }
});
*/
/************************************************************************************/

Ti.API.log("getting statistics!");

var stats = LDATA.getCommunityStatistics();
if (!stats){
    Ti.UI.create({
        type: "AlertDialog",
        title: "No statistics",
        message: "You haven't yet received any statistics from the server. Please try later!"
    }).show();
}
else {
Ti.API.log(stats);
    win.add($.create({type: "WebView", templateFile: "statistics.tmpl", templateData: stats }));
}