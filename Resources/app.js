Ti.include("assets/utils.js");

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