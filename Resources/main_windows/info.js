Ti.include("../assets/utils.js");
//$.msg({ text:'Info!' });

var view = $.createView({}),
    webview = Ti.UI.createWebView({ url: '../views/news.html' });
    biolist = $.createView({});
    tabbedbar = $.createTabbedBar({
	    labels:['News', 'Bio'],
        index:0
    }),
    news = $.getNews();

webview.addEventListener("load",function(){ webview.evalJS("render({ news: "+JSON.stringify(news)+"})"); });
    
win.rightNavButton = tabbedbar;
view.add(biolist);
view.add(webview);
win.add(view);

tabbedbar.addEventListener("click",function(e){
    switch(e.index){
        case 0: view.animate({view:webview,transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT}); break;
        case 1: view.animate({view:biolist,transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT}); break;
    }
});

    // ******** Biography section code ************************

var tinfo = {
    sections: [ { headerTitle:"Members", datarows: $.getMemberList({current:true}) },
                { headerTitle: "Former members", datarows: $.getMemberList({current:undefined}) }
    ]
};

var table = $.createTableView(tinfo);
biolist.add(table);

table.addEventListener("click",function(e){
    var win = $.createWin({
        url:'bio.js',
        title: e.rowData.def.title
    });
    win.data = e.rowData.def;
    Ti.UI.currentTab.open(win);
});

