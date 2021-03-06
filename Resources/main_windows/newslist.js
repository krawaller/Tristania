Ti.include("../assets/utils.js");
Ti.include("../assets/localdata.js");
    
win.title = "News";
    
var view = $.create({
    type: "TableView",
    childElements: $.map(LDATA.getNews(),function(n){n.heading = n.title; n.childElements = [{text: n.title, styleClass: "tableviewrowmainlabel"},{text : n.date, styleClass : "tableviewrowsublabel"}]; delete n.title;}),
    click: function(e){
        var win = $.create({ type: "Window", url:'news.js' });
        win.data = { news: e.rowData.def };
        Ti.UI.currentTab.open(win);
    },
    opacity: 0
});

view.animate({opacity:1,duration:500});

win.add(view);