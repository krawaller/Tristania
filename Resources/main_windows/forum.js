Ti.include("../assets/utils.js");

win.title = win.info && win.info.title ? win.info.title : "Forum";

var spinner = Ti.UI.createActivityIndicator({ style: Ti.UI.iPhone.ActivityIndicatorStyle.BIG });

function getREST(){
    return "http://query.yahooapis.com/v1/public/yql?q=use%20%22http%3A%2F%2F79.99.1.153%2Fyql%2Ftrist%2Ftristania_forum.xml%22%20as%20tf%3B%20select%20*%20from%20tf%20where%20path%20%3D%20%22"
    + (win.path || "").replace(":","%3A").replace("/","%2F").replace("?","%3F") + 
    "%22&format=json";
}

win.add(spinner);
spinner.show();

Ti.API.log([win.path,getREST()]);

$.ajax({
    url: getREST(),
    success: receiveData,
    fail: function(e){ $.msg(win,"Network fail!"); }
});

function receiveData(d){
//Ti.API.log(d);
    var t = {
        type: "TableView",
        childElements: [],
        click: function(e){
        Ti.API.log(e.rowData.def);
            var win = $.create({ type: "Window", url:'forum.js' });
            win.path = e.rowData.def.link;
            Ti.UI.currentTab.open(win);
        }
    }
    if (d.posts){
        t.page = d.posts.page;
        t.pages = d.posts.pages;
        t.childElements = d.posts.post.map(function(p){
            return {
                title: p.title,
                path: p.path,
                type: "TableViewRow"
            };
        });
    }
    if (d.boards){
        t.childElements = d.boards.board.map(function(b){
            return {
                title: b.title,
                path: b.path,
                type: "TableViewRow"
            };
        });
    }
    if (d.topics){
        t.page = d.topics.page;
        t.pages = d.topics.pages;
        t.childElements = d.topics.topic.map(function(t){
            return {
                title: t.title,
                path: t.path,
                type: "TableViewRow"
            };
        });
    }
    if (d.cats){
        t.childElements = d.cats.map(function(c){
            return {
                title: c.title,
                type: "TableViewSection",
                childElements: d.cats.boards.map(function(b){
                    return {
                        title: b.title,
                        path: b.path,
                        type: "TableViewRow"
                    };
                })
            };
        });
    }
    
    win.add($.create(t));
}