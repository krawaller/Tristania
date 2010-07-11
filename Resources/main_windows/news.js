Ti.include("../assets/utils.js");

var news = win.data.news,
    webview = $.createWebView({ url: '../views/news.html', background: '#555' });

win.title = "News";
webview.addEventListener("load",function(){ webview.evalJS("render({ news: "+JSON.stringify(news)+"})"); });
win.add(webview);