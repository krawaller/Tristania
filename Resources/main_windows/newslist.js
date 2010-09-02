Ti.include("../assets/utils.js");
    
win.title = "News";
    
win.add($.create({
    type: "TableView",
    childElements: $.map($.getNews(),function(n){n.childElements = [{text : n.date, styleClass : "tableviewrowsublabel"}]; }),
    click: function(e){
        var win = $.create({ type: "Window", url:'news.js' });
        win.data = { news: e.rowData.def };
        Ti.UI.currentTab.open(win);
    }
}));