Ti.include("../assets/utils.js");
Ti.include("../assets/localdata.js");

var map, community;

if(!(LDATA.getUserData("username") && LDATA.getUserData("presentation"))){
// TODO vary this message depending on status
    
	var a = Ti.UI.createAlertDialog({
		buttonNames: ['OK','Cancel'],
		cancel: 1,
		title: 'Join the community!',
		message: 'Before you can see the map you must fill in your data and upload it!',
	});
	a.addEventListener('click', function(e){
		if (e.index == 0) {
			Ti.UI.currentTab.open($.create({
				type: "Window",
				url: 'profileedit.js',
				geo: win
			}));
		} else {
			win.close();
		}
	});
	a.show();
} else {
	render();
}

function render(){
	community = LDATA.getCommunityMembers();
Ti.API.info(['ALL:', community]);
    var usercoords = LDATA.getUserData("coords") || {latitude: 59.32485, longitude: 18.0699};
	if(map){ win.remove(map); }
	map = Titanium.Map.createView({
		mapType: Titanium.Map.STANDARD_TYPE,
		region: {
			latitude: usercoords.latitude, // 59.32485,
			longitude: usercoords.longitude, // 18.0699,
			animate: false,
			latitudeDelta: 0.04,
			longitudeDelta: 0.04
		},
		animate: false,
		regionFit: true,
		// userLocation: true,
		annotations: []
    });
	win.add(map);
	
    map.addEventListener("click",function(e){
        if(e.annotation && e.clicksource == "rightButton"){
            Ti.UI.currentTab.open($.create({ type: "Window", url:'profileview.js',user: community.members[e.annotation.guid] }));
        }
    });

	map.addAnnotation(Ti.Map.createAnnotation({
		latitude : usercoords.latitude,
		longitude : usercoords.longitude,
		title : "You!",
		animate : false,
		image : '../pics/placemark_you.png',
        rightButton: Titanium.UI.iPhone.SystemButton.DISCLOSURE,
        guid: -666
	}));

	var keys = community.keys, index = 0;

Ti.API.log("Preparing to add "+(keys.length-1)+" members!");
	function addNeedle(){
	    var member = community.members[keys[index]];
        if (member.guid != Ti.Platform.id){
Ti.API.log("...adding "+member.username+" with id "+member.guid+" (platform is "+Ti.Platform.id+")");
            map.addAnnotation(Ti.Map.createAnnotation({
                latitute: member.coords.latitude,
                longitude: member.coords.longitude,
                title: member.username,
                animate: false,
                image: '../pics/placemark.png',
                rightButton: Titanium.UI.iPhone.SystemButton.DISCLOSURE,
                guid: member.guid
       	    }));
       	}
            index++;
        if (index<keys.length){
            setTimeout(addNeedle,index);
        }
	}
	setTimeout(addNeedle,0);
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
                Ti.UI.currentTab.open($.create({ type: "Window", url:'profileedit.js', geo: win }));
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

win.addEventListener('focus', function(){
	Ti.API.info(['closeOnFocus', win.closeOnFocus]);
	if(win.closeOnFocus){ 
		setTimeout(function(){ win.close(); }, 500);
	}
});

Ti.App.addEventListener('communityrefresh', render);
