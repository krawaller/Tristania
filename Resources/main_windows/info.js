Ti.include("../assets/utils.js");
    

    // ********* News section code ****************************
    
var news = $.getNews(),
    newsview = $.create({type: "View"});
    
news.map(function(n){n.childElements = [{text : n.date, styleClass : "tableviewrowsublabel"}]; });

newsview.add($.create({
    type: "TableView",
    childElements: news,
    "click": function(e){
        var win = $.create({ type: "Window", url:'news.js' });
        win.data = { news: e.rowData.def };
        Ti.UI.currentTab.open(win);
    }
}));

    // ******** Biography section code ************************

var bioview =  $.create({type: "View"}),
    biotable = $.create({
        type: "TableView"/*,
        childElements: [ { type: "TableViewSection", headerTitle:"Members", childElements: $.getMemberList({current:true}) },
                    { type: "TableViewSection", headerTitle: "Former members", childElements: $.getMemberList({current:undefined}) } ]
                    */
    });
    
// TODO - makes this work in one call with children!! :(
biotable.setData( [$.create({ type: "TableViewSection", headerTitle:"Members", childElements: $.getMemberList({current:true}) } ),
                   $.create({ type: "TableViewSection", headerTitle:"Former members", childElements: $.getMemberList({current:undefined}) }) ]  );

bioview.add(biotable);

biotable.addEventListener("click",function(e){
    var win = $.create({ type: "Window", url:'bio.js' });
    win.data = e.rowData.def;
    Ti.UI.currentTab.open(win);
});

    // ************* Main win code ****************************

var view = $.create({type:"View"}),
    tabbedbar = $.create({
        type:"TabbedBar",
        id: "tabbedbar",
	    labels:['News', 'Bio'],
        index:0,
        "click": function(e){
            switch(e.index){
                case 0: view.animate({view:newsview,transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT}); break;
                case 1: view.animate({view:bioview,transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT}); break;
            }
        }
    });

view.add(bioview);
view.add(newsview);
win.add(view);
win.rightNavButton = tabbedbar;

win.title = "Info";
