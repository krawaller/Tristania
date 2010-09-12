Ti.include("../assets/utils.js");

var map, community = $.getCommunityMembers();

if(!community){
// TODO vary this message depending on status
    Ti.UI.currentTab.open($.create({ type: "Window", url:'profileedit.js' }));
	Ti.UI.createAlertDialog({
		title: 'Join the community!',
		message: 'Before you can see the map you must fill in your data and upload it!',
	}).show();
} else {
	render();
}

function render(){
    var usercoords = $.getUserData("coords") || {latitude: 59.32485, longitude: 18.0699};
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
            Ti.UI.currentTab.open($.create({ type: "Window", url:'profileview.js',user: community[e.annotation.guid] }));
        }
	});
Ti.API.log("Adding you!");
	map.addAnnotation(Ti.Map.createAnnotation({
		latitude : usercoords.latitude,
		longitude : usercoords.longitude,
		title : "You!!",
//      subtitle : 'Laddar...', 
		animate : false,
		image : '../pics/placemark_you.png',
        rightButton: Titanium.UI.iPhone.SystemButton.DISCLOSURE,
        guid: -666
	}));
Ti.API.log(community);
	var communityarray = [], index = 0;
	for(var m in community){
	    communityarray.push(m);
	}
Ti.API.log("Preparing to add "+communityarray.length+" members!");
	function addNeedle(){
Ti.API.log("adding member "+index);
	    var member = community[communityarray[index]];
Ti.API.log("...which is "+member.username);
	    map.addAnnotation(Ti.Map.createAnnotation({
	        latitute: member.coords.latitude,
	        longitude: member.coords.longitude,
	        title: member.username,
	        animate: false,
	        image: '../pics/placemark.png',
	        rightButton: Titanium.UI.iPhone.SystemButton.DISCLOSURE,
            guid: member.guid
	    }));
	    index++;
        if (index<communityarray.length){
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