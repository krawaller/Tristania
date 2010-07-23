Ti.include("../assets/utils.js");
    
win.title = "Info";
    
var view = $.create({
    type:"View",
    childElements: [{  // ********* Biography table view *************
        type: "TableView",
        id: "bioView",
        childElements: [{
            type: "TableViewSection",
            headerTitle:"Members",
            childElements: $.getMemberList({current:true})
        },{ 
            type: "TableViewSection",
            headerTitle: "Former members",
            childElements: $.getMemberList({current:undefined})
        }],
        click: function(e){
            var win = $.create({ type: "Window", url:'bio.js' });
            win.data = e.rowData.def;
            Ti.UI.currentTab.open(win);
        }
    },{ // ************************ News table view ******************
        type: "TableView",
        id: "newsView",
        childElements: $.map($.getNews(),function(n){n.childElements = [{text : n.date, styleClass : "tableviewrowsublabel"}]; }),
        click: function(e){
            var win = $.create({ type: "Window", url:'news.js' });
            win.data = { news: e.rowData.def };
            Ti.UI.currentTab.open(win);
        }
    }]
});

win.add(view);

win.rightNavButton = $.create({
    type:"TabbedBar",
    labels:['News', 'Bio'],
    index:0,
    "click": function(e){
        switch(e.index){
            case 0: view.animate({view:view.childrenById.newsView,transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT}); break;
            case 1: view.animate({view:view.childrenById.bioView,transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT}); break;
        }
    }
});