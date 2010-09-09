Ti.include("../assets/utils.js");

win.title = "Application info";

win.add($.create({type: "WebView", templateFile:"about.tmpl", templateData: $.getAppData()}));
