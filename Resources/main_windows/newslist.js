Ti.include("../assets/utils.js");
    
win.title = "News";
    
win.add($.create({
    type: "TableView",
    childElements: $.map($.getNews(),function(n){n.heading = n.title; n.childElements = [{text: n.title, styleClass: "tableviewrowmainlabel"},{text : n.date, styleClass : "tableviewrowsublabel"}]; delete n.title;}),
    click: function(e){
        var win = $.create({ type: "Window", url:'news.js' });
        win.data = { news: e.rowData.def };
        Ti.UI.currentTab.open(win);
    }
}));