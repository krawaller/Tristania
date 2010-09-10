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
//Ti.UI.setBackgroundColor('#000');
//Ti.UI.setBackgroundImage("pics/tristaniabgloading.jpg");

// create tab group
var tabGroup = $.create({
    type:"TabGroup"
});

[{title:"Info",url:"info.js",start:true},
 {title:"Media",url:"media.js"},
 {title:"Community",url:"community.js"}].map(function(t){
    tabGroup.addTab( $.create({
        type: "Tab",
        icon:"pics/icon_tab_"+t.title+".png",
        title:t.title,
        window:$.create({
            type:"Window",
            url: "main_windows/"+t.url
        })
    }) );
});

// open tab group
tabGroup.open({ transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT });

Ti.UI.setBackgroundImage("pics/tristaniabg.jpg");

/**
 * Open a url in a new window.
 * Add means of navigation and an action sheet to let the user favorize the url.
 * @param {object} event object
 */
Ti.App.addEventListener('openUrl', function(e){
	var openUrlEvent = e;

	// Define and bind webview navigation
	var navigation = [{ image: 'pics/left.png' }, { image: 'pics/right.png' }, { image: 'pics/action.png' }];

	var navigationBar = $.create({ //Ti.UI.createButtonBar({
	    type: "ButtonBar",
		labels: navigation
	});

	var funcs = [{ go: 'goBack', can: 'canGoBack' }, { go: 'goForward', can: 'canGoForward' }];

	// Handle navigation
	navigationBar.addEventListener('click', function(navBarEvent){
		// Back or forth?
		if (funcs[navBarEvent.index] && webview[funcs[navBarEvent.index].can]()) {
			webview[funcs[navBarEvent.index].go]();
			spinner.show();
			funcs.forEach(function(item, i){
				navigation[i].enabled = webview[item.can](); // Doesn't make a difference yet unfortunately
			});
		}
		else // Action sheet
			if (navBarEvent.index == 2) { 			
				var dialog = Titanium.UI.createOptionDialog({
					options: ['Open in Safari', 'Cancel'],
					cancel: 1,
					title: webview.url
				});

				// Action sheet click listener
				dialog.addEventListener('click', function(e){
					switch (e.index) {
						case 0:
							// Open in Safari
							Ti.Platform.openURL(webview.url);
							break;
					}
				});
				dialog.show();
			}
	});

	// Add an activityIndicator
	var spinner = Titanium.UI.createActivityIndicator({
		height: 32,
		width: 32,
		style: Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN
	});

	// Create webview window
	var win = $.create({
	    type: "Window",
		titleControl: spinner,
		title: e.title,
		rightNavButton: navigationBar
	});

	// Create webview
	var webview = Ti.UI.createWebView({
		url: e.url
	});

	// Bind load func to hide spinner
	webview.addEventListener('load', function(){
		spinner.hide();
		win.titleControl = null;
	});

	// Add and show
	win.add(webview);

	tabGroup.activeTab.open(win);
	spinner.show();
});