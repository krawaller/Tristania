// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#FFF');

// create tab group
var tabGroup = Titanium.UI.createTabGroup();


var win1 = Titanium.UI.createWindow({  
    title:'Info',
    backgroundColor:'#fff',
    url: "main_windows/info.js"
});

var tab1 = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:'Info',
    window:win1
});

var win2 = Titanium.UI.createWindow({  
    title:'Discography',
    backgroundColor:'#fff',
    url: "main_windows/discography.js"
});

var tab2 = Titanium.UI.createTab({  
    icon:'KS_nav_ui.png',
    title:'Discography',
    window:win2
});

var win3 = Titanium.UI.createWindow({  
    title:'Pictures',
    backgroundColor:'#fff',
    url: "main_windows/pics.js"
});

var tab3 = Titanium.UI.createTab({  
    icon:'KS_nav_ui.png',
    title:'Pictures',
    window:win3
});

var win4 = Titanium.UI.createWindow({  
    title:'Videos',
    backgroundColor:'#fff',
    url: "main_windows/vids.js"
});

var tab4 = Titanium.UI.createTab({  
    icon:'KS_nav_ui.png',
    title:'Videos',
    window:win4
});

tabGroup.addTab(tab1);  
tabGroup.addTab(tab2);  
tabGroup.addTab(tab3);  
tabGroup.addTab(tab4);  

// open tab group
tabGroup.open({
    transition: Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
});
