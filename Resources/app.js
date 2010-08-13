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

$.updateData();
Ti.App.addEventListener("resume",$.updateData);









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

