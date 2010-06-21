Ti.include("../assets/utils.js");

var cats = [{title: "Concerts",num:6},{title:"Photoshoots",num:3},{title:"Music videos",num:16},{title:"Scans",num:22},{title:"Collaboration",num:21},{title:"Miscellaneous",num:24},{title:"Favourites",num:-666}];

var data = [];

for (var i in cats){
    data.push({
        title: cats[i].title,
        info: cats[i]
    });
}

var table = $.createTableView({data:data});

table.addEventListener("click",function(e){
    var win = $.createWin({
        url: e.rowData.info.num === -666 ? 'photoalbum.js' : 'category.js',
        title: e.rowData.info.title,
        info: e.rowData.info
    });
    Titanium.UI.currentTab.open(win);
});

Ti.UI.currentWindow.add(table);

