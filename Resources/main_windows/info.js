Ti.include("../assets/utils.js");
    
win.title = "Info";

win.add($.create({
    type: "Label",
    text: "Bio",
    styleClass: "categoryButton",
    top: 10,
    click: function(e){
        Ti.UI.currentTab.open($.create({ type: "Window", url:'biolist.js' }));
    }
}));

win.add($.create({
    type: "Label",
    text: "News",
    styleClass: "categoryButton",
    top: 80,
    click: function(e){
        Ti.UI.currentTab.open($.create({ type: "Window", url:'newslist.js' }));
    }
}));

win.add($.create({
    type: "Label",
    text: "Discography",
    styleClass: "categoryButton",
    top: 150,
    click: function(e){
        Ti.UI.currentTab.open($.create({ type: "Window", url:'discography.js' }));
    }
}));


/*
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
        type: "View",
        id: "newsView",
            click: function(e){
                var win = $.create({ type: "Window", url:'news.js' });
                win.data = { news: e.rowData.def };
                Ti.UI.currentTab.open(win);
            },
    }]
});

win.add(view);

win.rightNavButton = $.create({
    type:"TabbedBar",
    labels:['News', 'Bio'],
    index:0,
    "click": function(e){
        view.animate({view:view.childrenById[e.index?"bioView":"newsView"],transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT});
    }
});

// *********************** News update code **********************

var table;

function updateNews(){
    var v = view.childrenById.newsView;
    if (table){
        v.remove(table)
    }
    table = $.create({
        type: "TableView",

        childElements: 
            $.map($.getNews(),function(n){n.childElements = [{text : n.date, styleClass : "tableviewrowsublabel"}]; })
    });
    v.add(table);
    Ti.API.log("redrew news");
}

updateNews();

Ti.App.addEventListener("resume",updateNews);

*/
