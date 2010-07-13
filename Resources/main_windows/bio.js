Ti.include("../assets/utils.js");
if (win.backButtonTitle == "Info") {
    win.backButtonTitle = "Bio";
}

var id = win.data.id,
    bio = $.getMember(id),
    webview = $.createKraWebView({templateFile: "bio.tmpl",data:bio}); //$.createWebView({ url: '../views/bio.html', background: '#555' });

win.title = bio.name;

// webview.addEventListener("load",function(){ webview.evalJS("render({ bio: "+JSON.stringify(bio)+"})"); });
win.add(webview);