Ti.include("../assets/utils.js");

win.title = win.info && win.info.title ? win.info.title : "Forum";

var data = win.data || {},
    spinner = Ti.UI.createActivityIndicator({ style: Ti.UI.iPhone.ActivityIndicatorStyle.BIG });

function getREST(){
    return "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%20%3D%20%22http%3A%2F%2Fwww.theilluminated.net%2F" + 
    (data.path ? data.path : "") + 
  //  (data.page ? data.page*20+"%2F" : "") +
    "%22%20and%20xpath%20%3D%20%22%2F%2Fbody%2Fdiv%5B%40id%3D'bodyarea'%5D%2F*%22&format=json";
}

win.add(spinner);
spinner.show();

Ti.API.log([data.path,getREST()]);

$.ajax({
    url: getREST(),
    success: receiveData,
    fail: function(e){ $.msg(win,"Network fail!"); }
});

function receiveData(d){
    var list = d.query.results,
        table = {
            type: "TableView",
            childElements: [],
            click: function(e){
                var win = $.create({ type: "Window", url:'forum.js' });
                win.data = e.rowData.def;
                Ti.UI.currentTab.open(win);
            }
        },
        divs = list.div instanceof Array ? list.div : list.div ? [list.div] : [],
        tables = list.table instanceof Array ? list.table : list.table ? [list.table] : [];
Ti.API.log(["RECEIVING!",divs.length,tables.length]);
    for(var div in divs){
        var sec;
        div = divs[div];
  // categorylist
        if (div["class"] === "tborder" && div.div && div.div["class"] === "catbg"){
            sec = {
                type: "TableViewSection",
                headerTitle: div.div.a.content,
                childElements: []
            };
Ti.API.log("building "+div.div.a.content);
            var rows = div.table.tr instanceof Array ? div.table.tr : div.table.tr ? [div.table.tr] : [];
            for(var t=0;t<rows.length;t++){
                var row = rows[t];                
                if (row.td.length>1){
Ti.API.log("Adding row "+row.td[1].strong.a.content);
                    sec.childElements.push({
                        type: "TableViewRow",
                        title: row.td[1].strong.a.content,
                        path: row.td[1].strong.a.href.split("/?")[0].split("http://theilluminated.net/")[1]
                    });
                }
            }
            table.childElements.push(sec);
        }
        else if (div["class"] === "tborder" && div.table && div.table["class"] === "bordercolor" && div.table.tr){
            sec = {
                type: "TableViewSection",
                headerTitle: "Threads",
                childElements: []
            }
            var rows = div.table.tr instanceof Array ? div.table.tr : div.table.tr ? [div.table.tr] : [];
            for(var t=1;t<rows.length;t++){
                var row = rows[t];
try{
                sec.childElements.push({
                    type: "TableViewRow",
                    title: row.td[2].span.a.content,
                    path: row.td[2].span.a.href.split("/?")[0].split("http://theilluminated.net/")[1],
                    startedby: row.td[3].a.content,
                    replies: row.td[4].p,
                    views: row.td[5].p,
                });
}catch(e){Ti.API.log(["ERROR!",e,row.td[2]]);}
            }
            table.childElements.push(sec);
        }
    }

    
    
    var t = $.create(table);
    win.add(t);
}