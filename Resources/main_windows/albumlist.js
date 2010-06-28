Ti.include("../assets/utils.js");

var spinner = Ti.UI.createActivityIndicator({ style: Ti.UI.iPhone.ActivityIndicatorStyle.BIG });

function render(res){
    var data = [],table,list,rows = [];
    spinner.hide();
    win.remove(spinner);
    
    if (res.query.results.table.length<=1){
        $.msg(win,"Empty album!");
        return;
    }
    
    for (var i=0; i<res.query.results.table.length-1;i++){ // last row is bogus
        table = res.query.results.table[i];
        if (table.tr[0].td.span){ // last in uneven selection is bogus, need to test for existence
            var info = {
                name: table.tr[0].td.span.a.strong.clean(), // desc
                num: table.tr[0].td.span.a.href.substr(21,666),
                pics: table.tr[2].td[2].p.content.clean().match(/^\d*/)[0],
                desc: table.tr[2].td[2].p.content.clean().substr(-12,12) // TODO - change to regexp
            };
            data.push({
                title: info.name,
                info: info
            });
        }
    }
    
    data.map(function(item){
        rows.push({
            title: item.title,
            info: item.info,
            label: { text:"("+item.info.pics+")" }
        });
    });
    list = $.createTableView({rows:rows});
    
    list.addEventListener("click",function(e){
        Ti.UI.currentTab.open($.createWin({
            url:'photoalbum.js',
            info: e.rowData.info
        }));
    });

    win.add(list);
}
    
    
$.ajax({
    url: "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fmvonlonski.com%2Fcpg%2Findex.php%3Fcat%3D"+win.info.num+"%22%20and%20xpath%3D%22%2F%2Ftable%5B2%5D%2Ftr%2Ftd%2Ftable%22&format=json&callback=",
    success: render,
    fail: function(e){ $.msg(win,"Network fail!"); }
});

win.add(spinner);
spinner.show();
