Ti.include("../assets/utils.js");

var history = $.getHistory();

win.title = "History";

win.add($.create({type: "WebView", templateFile: "history.tmpl", templateData:history}));