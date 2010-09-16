Ti.include("../assets/utils.js");
Ti.include("../assets/localdata.js");

var bio = LDATA.getMember(win.data.id, true);

win.title = bio.name;

win.add($.create({type: "WebView", templateFile: "bio.tmpl", templateData:bio}));