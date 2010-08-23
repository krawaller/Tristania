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


$.updateData();
Ti.App.addEventListener("resume",$.updateData);









// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Ti.UI.setBackgroundColor('#000');

// create tab group
var tabGroup = $.create({type:"TabGroup"});

[{title:"Info",url:"info.js"},
 {title:"Media",url:"media.js"},
 {title:"Community",url:"community.js"},
 {title:"About",url:"about.js"}].map(function(t){
    tabGroup.addTab( $.create({
        type: "Tab",
        icon:"pics/icon_tab_"+t.title+".png",
        title:t.title,
        window:$.create({type:"Window",url: "main_windows/"+t.url})
    }) );
});

// open tab group
tabGroup.open({ transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT });

