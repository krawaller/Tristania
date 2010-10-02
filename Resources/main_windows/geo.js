Ti.include("../assets/utils.js");
Ti.include("../assets/localdata.js");

var map, community, rendered = false;

if(!LDATA.getUserData("username")){
    $.create({
        type: "AlertDialog",
		buttonNames: ['OK','Cancel'],
		cancel: 1,
		click: function(e){
            if (e.index == 0) {
			    Ti.UI.currentTab.open($.create({
				    type: "Window",
                    url: 'profileedit.js',
                    geo: win
		        }));
            } else {
                win.close();
            }
		},
		title: 'Join the community!',
		message: 'Before you can see the map you must fill in your data and upload it!',
	}).show();
} else if (!LDATA.getCommunityMembers()) {
    $.create({
        type: "AlertDialog",
		click: function(e){ win.close(); },
		title: 'Community not yet downloaded!',
		message: 'The application has not yet downloaded the community map.',
	}).show();
} else {
    render();
}

function render(){
	community = LDATA.getCommunityMembers();
    if (rendered || !community || !LDATA.getUserData("username")){
        return;
    }
    rendered = true;
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
	    userLocation: false,
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
		title : LDATA.getUserData("username"),
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
Ti.API.log("...adding "+member.username+" with id "+member.guid+" (platform is "+Ti.Platform.id+") ");
            map.addAnnotation(Ti.Map.createAnnotation({
                latitude: member.coords.latitude,
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
            title: "Edit profile",
            styleClass: "optionsbutton",
            top: 60,
            click: function(){
                Ti.UI.currentTab.open($.create({ type: "Window", url:'profileedit.js', geo: win }));
            }
        },{
            title: "Statistics",
            styleClass: "optionsbutton",
            top: 110,
            click: function(){
                Ti.UI.currentTab.open($.create({ type: "Window", url:'statistics.js' }));
            }
        }/*,{
            title: "Profile view test",
            styleClass: "optionsbutton",
            top: 160,
            click: function(){
                Ti.UI.currentTab.open($.create({ type: "Window", url:'profileview.js' }));
            }
        }*/]
    }),
    showingOptions = false;
    
win.add(optionsView);
win.rightNavButton = btn;

win.addEventListener('focus', function(){
	Ti.API.info(['closeOnFocus', win.closeOnFocus]);
	if(win.closeOnFocus){ 
		setTimeout(function(){ win.close(); }, 500);
	}
	else {
	    render();
	}
});

Ti.App.addEventListener('communityrefresh', render);
