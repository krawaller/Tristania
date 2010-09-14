Ti.include("../assets/utils.js");

if (win.backButtonTitle == "Info") {
    win.backButtonTitle = "Bio";
}

var bio = $.getMember(win.data.id, true);

win.title = bio.name;

win.add($.create({type: "WebView", templateFile: "bio.tmpl", templateData:bio}));