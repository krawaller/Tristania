Ti.include("../assets/utils.js");

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
			render();
		}
	});
} else {
	render();
}

function render(){
	var map = Titanium.Map.createView({
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
}