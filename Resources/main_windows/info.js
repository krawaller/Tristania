Ti.include("../assets/utils.js");
//$.msg({ text:'Info!' });


var bioinfo = {
    "Band":[{
        title: "History",
        info: "gagagaga"
    }],
    "Members":[{
        title: "Anders",
        info: "Mooo"
    },{
        title: "Ole",
        info: "tönt"
    }],
    "Former members":[{
        title: "Svein-Terje",
        info: "wuuuu stropp"
    }]
}

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

var tinfo = {sections:[]};
for(var s in bioinfo){
    tinfo.sections.push({
        headerTitle: s,
        datarows: bioinfo[s]
    });
}
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
