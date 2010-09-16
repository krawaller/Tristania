Ti.include("../assets/utils.js");

win.title = "Profile";

function populateFields(){
    view.childrenById.presentation.value = $.getUserData("presentation");
    view.childrenById.username.value = $.getUserData("username");
    view.childrenById.location.value = newcoords ? newcoords.latitude + ", "+newcoords.longitude : 
                                       oldcoords ? oldcoords.latitude + ", "+oldcoords.longitude : "(location unknown)";
}

var oldcoords = $.getUserData("coords"),
    newcoords,
    view = $.create({
    type: "View",
   // height: 500, // doesn't allow for scrolling? need some stupid setting somewhere?
    childElements: [{
        styleClass: "infolabel",
        text: "Presentation",
        top: 20
    },{
        type: "TextArea",
        id: "presentation",
        top: 50
    },{
        styleClass: "infolabel",
        text: "Location",
        top: 140
    },{
        styleClass: "datalabel",
        text: "(location unknown)",
        id: "location",
        top: 150
    },{
        styleClass: "infolabel",
        text: "Forum user name",
        top: 160
    },{
        type: "TextField",
        top: 200,
        id: "username",
        eventListeners: {
            focus: function(e){
                // scroll to good position here!
            }
        }
    },{
        styleClass: "optionsbutton",
        top: 260,
        title: "restore",
        click: function(e){
            populateFields();
        }
    },{
        styleClass: "optionsbutton",
        top: 290,
        title: "save and upload",
        click: function(e){
            var pres = view.childrenById.presentation.value || "",
                name = view.childrenById.username.value || "",
                errormsg = "";
            if (!name.length){
                errormsg += "You must enter a name! ";
            }
            if (pres.length<5){
                errormsg += "Your presentation can be short, but not THAT short! ";
            }
            if (!newcoords && !oldcoords){
                errormsg += "No coords data, please enable geolocation! ";
            }
            if (newcoords){
                $.setUserData("coords",newcoords);
            }
            if (errormsg.length > 0){
                $.create({
                    type: "AlertDialog",
                    title: "Error",
                    message: errormsg + "Couldn't save data."
                }).show();
                return;
            }
            $.setUserData("presentation",view.childrenById.presentation.value);
            $.setUserData("username",view.childrenById.username.value);
            $.create({
                type: "AlertDialog",
                title: "Data saved",
                message: "Your information has been saved prepared for upload"
            }).show();
            Ti.App.fireEvent("uploadready");
        }
    }],
    eventListeners: {
        focus: function(e){
            // scroll to top here, how do you do that?
        }
    }
});

Titanium.Geolocation.purpose = "Including you on the Tristania Fan Map";
Titanium.Geolocation.getCurrentPosition(function(e){
    Ti.API.log("Okay, got location!");
    if (e.error) {
        $.create({
            type: "AlertDialog",
            title: "Geolocation error",
            message: "Couldn't update your current position!"
        }).show();
		return;
    }
    newcoords = {latitude: e.coords.latitude, longitude: e.coords.longitude};
});

win.height = 500;
win.add(view);
populateFields();