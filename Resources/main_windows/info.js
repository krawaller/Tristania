Ti.include("../assets/utils.js");
//$.msg({ text:'Info!' });

var view = $.createView({}),
    news = $.createView({backgroundColor: "000"}),
    biolist = $.createView({});
    tabbedbar = $.createTabbedBar({
	    labels:['News', 'Bio'],
        index:0
    })
    
win.rightNavButton = tabbedbar;
view.add(biolist);
view.add(news);
win.add(view);

tabbedbar.addEventListener("click",function(e){
    switch(e.index){
        case 0: view.animate({view:news,transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT}); break;
        case 1: view.animate({view:biolist,transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT}); break;
    }
});

news.add($.createLabel({top:50, left: 15, color: "#FFF", text:"newssss"}));

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

