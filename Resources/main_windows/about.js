Ti.include("../assets/utils.js");
Ti.include("../assets/localdata.js");

win.title = "Application info";
win.add($.create({type: "WebView", templateFile:"about.tmpl", templateData: LDATA.getAppData()}));
