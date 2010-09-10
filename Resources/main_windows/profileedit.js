Ti.include("../assets/utils.js");

win.title = "Profile";

function populateFields(){
    view.childrenById.presentation.value = $.getUserData("presentation");
    view.childrenById.username.value = $.getUserData("username");
}

var view = $.create({
    type: "View",
   // height: 500, // doesn't allow for scrolling? need some stupid setting somewhere?
    childElements: [{
        styleClass: "profilelabel",
        text: "Presentation",
        top: 20
    },{
        type: "TextArea",
        id: "presentation",
        top: 50
    },{
        styleClass: "profilelabel",
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
        title: "save",
        click: function(e){
            $.setUserData("presentation",view.childrenById.presentation.value);
            $.setUserData("username",view.childrenById.username.value);
            $.create({
                type: "AlertDialog",
                title: "Data saved",
                message: "Your information has been updated."
            }).show();
        }
    }],
    eventListeners: {
        focus: function(e){
            // scroll to top here, how do you do that?
        }
    }
});
win.height = 500;
win.add(view);
populateFields();