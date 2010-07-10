Ti.include("../assets/utils.js");
if (win.backButtonTitle == "Info") {
    win.backButtonTitle = "Bio";
}

var id = win.data.id,
    bio = $.getMember(id),
    webview = Ti.UI.createWebView({ url: '../views/bio.html', background: '#555' });

webview.addEventListener("load",function(){ webview.evalJS("render({ bio: "+JSON.stringify(bio)+"})"); });
win.add(webview);