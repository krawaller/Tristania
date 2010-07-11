Ti.include("../assets/utils.js");

//webview.addEventListener("load",function(){ webview.evalJS("render({ news: "+JSON.stringify(news)+"})"); });
    

    // ********* News section code ****************************
    
var news = $.getNews(),
    newsview = $.createView({}),
    newstable = $.createTableView({rows: news});

newsview.add(newstable);

newstable.addEventListener("click",function(e){
    var win = $.createWin({ url:'news.js' });
    win.data = { news: e.rowData.def };
    Ti.UI.currentTab.open(win);
});


    // ******** Biography section code ************************

var tinfo = {
        sections: [ { headerTitle:"Members", datarows: $.getMemberList({current:true}) },
                    { headerTitle: "Former members", datarows: $.getMemberList({current:undefined}) } ]
    },
    bioview =  $.createView({}),
    biotable = $.createTableView(tinfo);

bioview.add(biotable);

biotable.addEventListener("click",function(e){
    var win = $.createWin({ url:'bio.js' });
    win.data = e.rowData.def;
    Ti.UI.currentTab.open(win);
});

    // ************* Main win code ****************************
    
var view = $.createView({}),
    tabbedbar = $.createTabbedBar({
	    labels:['News', 'Bio'],
        index:0
    });

view.add(bioview);
view.add(newsview);
win.add(view);
win.rightNavButton = tabbedbar;

tabbedbar.addEventListener("click",function(e){
    switch(e.index){
        case 0: view.animate({view:newsview,transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT}); break;
        case 1: view.animate({view:bioview,transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT}); break;
    }
});
