Ti.include("../assets/utils.js");
Ti.include("../assets/localdata.js");

win.title = "Profile";
win.geo.closeOnFocus = !(LDATA.getUserData("username") && LDATA.getUserData("presentation"));

function populateFields(){
    view.childrenById.presentation.value = LDATA.getUserData("presentation");
    view.childrenById.username.value = LDATA.getUserData("username");
    view.childrenById.location.text = newcoords ? newcoords.latitude + ", "+newcoords.longitude : 
                                      oldcoords ? oldcoords.latitude + ", "+oldcoords.longitude : "(location unknown)";
}

var oldcoords = LDATA.getUserData("coords"),
    newcoords,
    view = $.create({
    type: "View",
    childElements: [{
        styleClass: "infolabel",
        text: "Presentation",
        top: 90
    },{
        type: "TextArea",
        id: "presentation",
        top: 120
    },{
        styleClass: "infolabel",
        text: "Location",
        top: 210
    },{
        styleClass: "datalabel",
        text: "(location unknown!)",
        id: "location",
        top: 235
    },{
        styleClass: "infolabel",
        text: "Name",
        top: 10
    },{
        type: "ActivityIndicator",
        style: Ti.UI.iPhone.ActivityIndicatorStyle.BIG,
        color: "#000",
        top: 235,
        width: 30,
        height: 30,
        left: 40,
        id: "spinner"
    },{
        type: "TextField",
        top: 40,
        id: "username",
        eventListeners: {
            focus: function(e){
                // scroll to good position here!
            }
        }
    },/*{
        styleClass: "optionsbutton",
        top: 260,
        title: "restore",
        click: function(e){
            populateFields();
        }
    },*/{
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
Ti.API.log(["new:",newcoords,"old:",oldcoords]);
            if (newcoords){
                LDATA.setUserData("coords",newcoords);
            }
            if (errormsg.length > 0){
                $.create({
                    type: "AlertDialog",
                    title: "Error",
                    message: errormsg + "Couldn't save data."
                }).show();
                return;
            }
            win.geo.closeOnFocus = false;
            LDATA.setUserData("presentation",view.childrenById.presentation.value);
            LDATA.setUserData("username",view.childrenById.username.value);
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

view.childrenById.spinner.show();

Titanium.Geolocation.purpose = "Including you on the Tristania Fan Map";
Titanium.Geolocation.getCurrentPosition(function(e){
Ti.API.log("WEEE position callback!");
    view.childrenById.spinner.hide();
//e.coords = e.coords || {latitude: 15.123213,longitude: 49.132132};
    if (!e.coords || e.error) {
   //     if (win == Ti.UI.currentWindow){
            $.create({
                type: "AlertDialog",
                title: "Geolocation error",
                message: "Couldn't update your current position!"
            }).show();
   //     }
    }
    else {
        newcoords = {latitude: e.coords.latitude, longitude: e.coords.longitude};
        view.childrenById.location.title = newcoords.latitude + ", "+newcoords.longitude;
    }
});

win.height = 500;
win.add(view);
populateFields();