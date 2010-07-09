Ti.include("assets/utils.js");

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// create tab group
var tabGroup = Titanium.UI.createTabGroup();

tabGroup.addTab( $.createTab({ icon:'pics/tabbar_info.png', title:'Info', window: $.createWin({ title:'Info', url: "main_windows/info.js" }) }) );  
tabGroup.addTab( $.createTab({ icon:'pics/tabbar_discography.png', title:'Discography', window: $.createWin({ title:'Discography', url: "main_windows/discography.js" }) }) );  
tabGroup.addTab( $.createTab({ icon:'pics/tabbar_pictures.png', title:'Pictures', window: $.createWin({ title:'Pictures', url: "main_windows/gallery.js" }) }) );  
tabGroup.addTab( $.createTab({ icon:'pics/tabbar_videos.png', title:'Videos', window:$.createWin({ title:'Videos', url: "main_windows/vids.js" }) }) );  

// open tab group
tabGroup.open({ transition: Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT });
