Ti.include("../assets/utils.js");

$.ajax({
    url: "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fmvonlonski.com%2Fcpg%2Findex.php%3Fcat%3D"+Ti.UI.currentWindow.info.num+"%22%20and%20xpath%3D%22%2F%2Ftable%5B2%5D%2Ftr%2Ftd%2Ftable%22&format=json&callback=",
    success: render,
    fail: function(e){ $.msg(win,"Network fail!"); }
});

var win = Ti.UI.currentWindow, spinner = Ti.UI.createActivityIndicator({ style: Ti.UI.iPhone.ActivityIndicatorStyle.BIG });
win.add(spinner);
spinner.show();

function render(res){
    var data = [],table;
    spinner.hide();
    win.remove(spinner);
    
    if (res.query.results.table.length<=1){
        $.msg(win,"Empty album!");
        return;
    }
    
    for (var i=0; i<res.query.results.table.length-1;i++){ // last row is bogus
        table = res.query.results.table[i];
        if (table.tr[0].td.span){ // last in uneven selection is bogus
            var info = {
                name: table.tr[0].td.span.a.strong.clean(),
                num: table.tr[0].td.span.a.href.substr(21,666),
                pics: table.tr[2].td[2].p.content.clean().match(/^\d*/)[0] 
            };
            data.push({
                title: info.name + " ("+info.pics+")",
                info: info
            });
        }
    }
    
    var list = Titanium.UI.createTableView({data:data});
    
    list.addEventListener("click",function(e){
        var win = Titanium.UI.createWindow({
            url:'photoalbum.js',
            title: e.rowData.title,
            info: e.rowData.info,
            backgroundColor:'#fff'
        });
        Titanium.UI.currentTab.open(win);
    });

    Titanium.UI.currentWindow.add(list);
}
    
