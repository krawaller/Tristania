Ti.include("../assets/utils.js");

$.ajax({
    url: "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fmvonlonski.com%2Fcpg%2Findex.php%3Fcat%3D"+Ti.UI.currentWindow.info.num+"%22%20and%20xpath%3D%22%2F%2Ftable%5B2%5D%2Ftr%2Ftd%22&format=json&callback=",
    success: render,
    fail: function(e){ $.msg(win,"Network fail!"); }
});

var win = Ti.UI.currentWindow, spinner = Ti.UI.createActivityIndicator({ style: Ti.UI.iPhone.ActivityIndicatorStyle.BIG });
win.add(spinner);
spinner.show();

function render(res){
    var data = [],name,albums,pics,i=0,row,num,info;
    spinner.hide();
    win.remove(spinner);
    
    if (!res.query.results.td.length){
        $.msg(win,"Emmmpty category!");
        return;
    }
    
    while(i<res.query.results.td.length){
        row = res.query.results.td[i];
        if (row["class"]==="catrow" || row["class"]==="catrow_noalb"){
            info = {
                name: row.table.tr.td[1].span.strong.a.content.clean(),
                num: row.table.tr.td[1].span.strong.a.href.substr(14,666)
            };
            info.title = info.name;
            if (row["class"]==="catrow"){
                info.albums = res.query.results.td[i+1].p;
                info.pics = res.query.results.td[i+2].p;
                info.title += " ("+info.albums+"/"+info.pics+")";
                i+=2;
            }
            data.push({
                title: info.title,
                info: info
            });
        }
        i++;
    }
    
    var table = Titanium.UI.createTableView({data:data});

    table.addEventListener("click",function(e){
        var win = Titanium.UI.createWindow({
            url: e.rowData.info.albums ? 'albumlist.js' : 'category.js', // TODO - safe up this!
            title: e.rowData.info.name,
            info: e.rowData.info,
            backgroundColor:'#fff'
        });
        if (e.rowData.info.albums){
            Ti.API.log("WUUU album");
            Ti.API.log(e.rowData.info);
        }
        Titanium.UI.currentTab.open(win);
    });
    win.add(table);
}
    
