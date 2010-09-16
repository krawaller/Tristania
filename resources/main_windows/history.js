Ti.include("../assets/utils.js");
Ti.include("../assets/localdata.js");

var history = LDATA.getHistory();

win.title = "History";

win.add($.create({type: "WebView", templateFile: "history.tmpl", templateData:history}));