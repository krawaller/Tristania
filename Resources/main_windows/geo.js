Ti.include("../assets/utils.js");

var map;

if(!Ti.App.Properties.getBool('communitized')){
	var a = Ti.UI.createAlertDialog({
		title: 'Join the community?',
		message: 'Blabla...',
		buttonNames: ['OK','Cancel']
	});
	a.show();
	a.addEventListener('click', function(e){
		if(e.index == 0){
			Ti.App.Properties.setBool('communitized', true);
			// Coords, Favoritlåtar
			render();
		}
	});
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
                Ti.UI.currentTab.open($.create({ type: "Window", url:'profile.js' }));
            }
        },{
            title: "Statistics",
            styleClass: "optionsbutton",
            top: 60,
            click: function(){
                Ti.UI.currentTab.open($.create({ type: "Window", url:'statistics.js' }));
            }
        }]
    }),
    showingOptions = false;
    
win.add(optionsView);
win.rightNavButton = btn;