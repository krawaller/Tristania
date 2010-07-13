Ti.include("assets/utils.js");

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// create tab group
var tabGroup = Titanium.UI.createTabGroup();

tabGroup.addTab( $.createTab({ icon:'pics/icon_tab_info.png', title:'Info', window: $.createWin({ title:'Info', url: "main_windows/info.js" }) }) );  
tabGroup.addTab( $.createTab({ icon:'pics/icon_tab_discography.png', title:'Discography', window: $.createWin({ url: "main_windows/discography.js" }) }) );  
tabGroup.addTab( $.createTab({ icon:'pics/icon_tab_pictures.png', title:'Gallery', window: $.createWin({ url: "main_windows/gallery.js" }) }) );  
tabGroup.addTab( $.createTab({ icon:'pics/icon_tab_videos.png', title:'Videos', window:$.createWin({ url: "main_windows/vids.js" }) }) );  
tabGroup.addTab( $.createTab({ icon:'pics/icon_tab_community.png', title:'Community', window:$.createWin({ url: "main_windows/community.js" }) }) );  

// open tab group
tabGroup.open({ transition: Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT });

/*
var x = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory+"/test.txt").read().text;
Ti.API.log(x);
*/
