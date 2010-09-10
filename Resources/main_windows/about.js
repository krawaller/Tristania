Ti.include("../assets/utils.js");

win.title = "Application info";
Ti.API.log($.getAppData());
win.add($.create({type: "WebView", templateFile:"about.tmpl", templateData: $.getAppData()}));
