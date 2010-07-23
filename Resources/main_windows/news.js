Ti.include("../assets/utils.js");

win.title = "News";

win.add($.create({type: "WebView", templateFile:"news.tmpl", templateData: win.data.news}));
