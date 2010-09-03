Ti.include("../assets/utils.js");

win.title = win.info ? win.info.title : "Gallery";

var spinner = Ti.UI.createActivityIndicator({ style: Ti.UI.iPhone.ActivityIndicatorStyle.BIG });

function getREST(what){
    return what == "category" ? "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fmvonlonski.com%2Fcpg%2Findex.php%3Fcat%3D"+Ti.UI.currentWindow.info.num+"%22%20and%20xpath%3D%22%2F%2Ftable%5B2%5D%2Ftr%2Ftd%22&format=json&callback="
                              : "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fmvonlonski.com%2Fcpg%2Findex.php%3Fcat%3D"+Ti.UI.currentWindow.info.num+"%22%20and%20xpath%3D%22%2F%2Ftable%5B2%5D%2Ftr%2Ftd%2Ftable%22&format=json&callback=";
}

function renderList(children){
    var rows = [],table;
    table = $.create({
        type: "TableView",
        childElements: children,
        click: function(e){
            var win = $.create({
                type: "Window",
                url: e.rowData.info.num === -666 || e.rowData.info.spotlight ? 'photoalbum.js' : 
                     e.rowData.info.albums ? 'albumlist.js' : 
                     'gallery.js', // TODO - safe up this!
                info: e.rowData.info,
                transparent: e.rowData.info.num === -666
            });
            if(win.url == 'photoalbum.js'){
                win.orientationModes = [Titanium.UI.PORTRAIT, Titanium.UI.UPSIDE_PORTRAIT, Titanium.UI.LANDSCAPE_LEFT, Titanium.UI.LANDSCAPE_RIGHT];
                win.tabBarHidden = true;
                win.translucent = true;
            }
            Ti.UI.currentTab.open(win);
        }
    });
    
    win.add(table);
    win.table = table; // TODO - access more dexterously
}

function receiveData(res){
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
                num: row.table.tr.td[1].span.strong.a.href.substr(14,666),
                desc: (row.table.tr.td[1].p || "").clean()
            };
            info.title = info.name;
            if (row["class"]==="catrow"){
                info.albums = res.query.results.td[i+1].p;
                info.pics = res.query.results.td[i+2].p;
                //info.title += " ("+info.albums+"/"+info.pics+")";
                i+=2;
            }
            if (!(info.albums>0 && info.pics==0)){ // avoid empty entries
                row = {
                    info:info,
                    childElements: [{
                        text: info.title,
                        styleClass: "tableviewrowmainlabel"
                    }]
                };
                if (info.albums){
                    row.childElements.push({
                        text: "("+info.albums+"/"+info.pics+")",
                        styleClass: "tableviewrowsidelabel"
                    });
                }        
                data.push(row);
            }
        }
        i++;
    }
    renderList(data);
}

var favrow; // TODO - do this without stupid global variable

function updateFavourites(){
    if (!win.table || win.info) {return;} // only need to do this for first screen. TODO - only do when favs have been changed!
    win.table.childrenById[0].childrenById.fav.childrenById.num.text = "("+(Ti.App.Properties.getList('favPics') || []).length+")";
//    favrow.childrenById.num.text = "("+(Ti.App.Properties.getList('favPics') || []).length+")";
}

if (!win.info){ // gallery base, showing hardcoded categories.
    renderList([{
        type: "TableViewSection",
        headerTitle: "Spotlighted",
        childElements: $.getSelectedPhotoalbums().map(
            function(i){return {info:{title:i.title,num:i.id,spotlight:true},childElements:[{text:i.title,styleClass:"tableviewrowmainlabel"}]};}
        ).concat([{
            type: "TableViewRow",
            id: "fav",
            info: {
                title: "Favourites",
                num: -666
            },
            childElements: [{
                text: "Favourites",
                styleClass: "tableviewrowmainlabel"
            },{ 
                id: "num",
                type: "Label",
                styleClass: "tableviewrowsidelabel"
            }]
        }])
    },{
        type: "TableViewSection",
        headerTitle: "Categories",
        childElements: [{title: "Concerts",num:6},{title:"Photoshoots",num:3},{title:"Music videos",num:16},{title:"Scans",num:22},{title:"Collaboration",num:21},{title:"Miscellaneous",num:24}].map(function(i){return {info:i,childElements:[{text: i.title,styleClass: "tableviewrowmainlabel"}]};})
    }]);
    win.addEventListener("focus",updateFavourites);
}
else{ 
    win.add(spinner);
    spinner.show();
    $.ajax({
        url: getREST("category"),
        success: receiveData,
        fail: function(e){ $.msg(win,"Network fail!"); }
    });
}

updateFavourites();