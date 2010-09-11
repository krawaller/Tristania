Ti.include("../assets/utils.js");

var map;

if(!Ti.App.Properties.getBool('communitized')){
    Ti.UI.currentTab.open($.create({ type: "Window", url:'profileedit.js' }));
	Ti.UI.createAlertDialog({
		title: 'Join the community!',
		message: 'Before you can see the map you must fill in your data and upload it!',
	}).show();
} else {
	render();
}

function render(){
	map = Titanium.Map.createView({
		mapType: Titanium.Map.STANDARD_TYPE,
		region: {
			latitude: 59.32485,
			longitude: 18.0699,
			animate: false,
			latitudeDelta: 0.04,
			longitudeDelta: 0.04
		},
		animate: false,
		regionFit: true,
		userLocation: true,
		annotations: []
	});
	win.add(map);
	
	var a = Titanium.Map.createAnnotation({
		latitude : 59.32,
		longitude : 18.06,
		title : 'bla',
		subtitle : 'Laddar...', 
		animate : false,
		image : '../pics/placemark.png'
	});
	map.setAnnotations([a]);
}

// Options screen

var btn = $.create({
        type: "Button",
        image: "../pics/icon_options.png",
        click: function(){
            optionsView.animate({duration: 500, opacity: showingOptions ? 0 : 1});
            showingOptions = !showingOptions;
            win.rightNavButton.selected = showingOptions;
        }
    }),
    optionsView = $.create({
        type: "View",
        opacity: 0,
        backgroundColor: "#000",
        childElements: [{
            title: "Your profile",
            styleClass: "optionsbutton",
            top: 10,
            click: function(){
                Ti.UI.currentTab.open($.create({ type: "Window", url:'profileedit.js' }));
            }
        },{
            title: "Statistics",
            styleClass: "optionsbutton",
            top: 60,
            click: function(){
                Ti.UI.currentTab.open($.create({ type: "Window", url:'statistics.js' }));
            }
        },{
            title: "Profile view test",
            styleClass: "optionsbutton",
            top: 110,
            click: function(){
                Ti.UI.currentTab.open($.create({ type: "Window", url:'profileview.js' }));
            }
        }]
    }),
    showingOptions = false;
    
win.add(optionsView);
win.rightNavButton = btn;