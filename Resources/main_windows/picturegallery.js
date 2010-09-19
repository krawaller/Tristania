Ti.include("../assets/utils.js");
Ti.include("../assets/localdata.js");

win.title = win.info ? win.info.title : "Gallery";

var spinner = Ti.UI.createActivityIndicator({ style: Ti.UI.iPhone.ActivityIndicatorStyle.BIG }),
    setupPageControl = false,
    page,
    pages,
    pageSelect = $.create({
        type: "View",
        opacity: 0,
        backgroundColor: "#000",
        childElements: [{
            type: "Button",
            title: "Go",
            top: 80,
            height: 20,
            width: 50,
            color: "black",
            click: function(e){
                var val = Math.round(pageSelect.childrenById.slider.value);
                togglePageSelect();
                if (table){
                    win.remove(table);
                }
                spinner.show();
                if (win.rightNavButton){
                    win.rightNavButton.title = "page "+val+"/"+pages;
                }
                $.ajax({
                    url: getREST(Math.round(val),win.info ? win.info.type : "category"),
                    success: function(d){
                        page = val;
                        renderList(d);
                    }
                });
            }
        },{
            type: "Label",
            top: 50,
            height: 20,
            color: "#FFF",
            id: "label",
            text: "page 1",
            textAlign: "center"
        },{
            type: "Slider",
            min: 1,
            max: 666,
            id: "slider",
            width: 250,
            top: 30,
            eventListeners: {
                change: function(e){
                    pageSelect.childrenById.label.text = "page "+Math.round(e.value);
                }
            }
        }]
    }),
    showingPageSelect = false,
    table;

function getREST(p,type){
    var id = win.info ? win.info.id : 0,
        url = "http://query.yahooapis.com/v1/public/yql?q=use%20%22http%3A%2F%2F79.99.1.153%2Fyql%2Ftrist%2Ftristania_gallery.xml%22%20as%20t%3B%20select%20*%20from%20t%20where%20id%20%3D%20"+id+"%20and%20type%20%3D%20%22"+type+"%22%20and%20page%20%3D%20"+(p||1)+"&format=json";
    Ti.API.log(["URLLLLLL",id,type,p,url]);
    return url;
}

function fixRow(row){
    var ret = {
        type: "TableViewRow",
        info: row,
        childElements: [{text: row.title, styleClass: "tableviewrowmainlabel"}]
    };
    if (row.desc){
        ret.childElements.push({text: row.desc, styleClass: "tableviewrowsublabel"});
    }
    if (row.pics && !row.page){
        ret.childElements.push({text: "("+(row.albums?row.albums+"/":"")+row.pics+")", styleClass: "tableviewrowsidelabel"});
    }
    if (row.page){
        ret.childElements.push({text: "("+(1+(row.page-1)*100)+"-"+Math.min(row.page*100,row.pics)+")", styleClass: "tableviewrowsidelabel"});
    }
    return ret;
}

function togglePageSelect(){
    (showingPageSelect ? pageSelect : table).animate({duration: 500, opacity: 0});
    (showingPageSelect ? table : pageSelect).animate({duration: 500, opacity: 1});
    showingPageSelect = !showingPageSelect;
    //win.rightNavButton.selected = showingPageSelect;
}

function pageControl(){
    if (pages>1 && !setupPageControl){
        pageSelect.childrenById.slider.max = pages;
        pageSelect.childrenById.slider.value = page;
        win.rightNavButton = $.create({
            type: "Button",
            title:"page 1/"+pages,
            click: togglePageSelect
        });
        setupPageControl = true;
    }
}

function clickRow(e){
    var r = e.rowData.info,
        paging = (r.type == "album" && r.pics>100 && !r.page),
        url = (r.type === "album" && !paging) || r.num == -666 || r.spotlight ? 'photoalbum.js' : 'picturegallery.js';  
    Ti.API.log(["CLICKEDICLICK",paging,url,r,"---------"]);
    win = $.create({
        type: "Window",
        url: url,
        info: r,
        paging: paging
    });
    if(win.url == 'photoalbum.js'){
        win.orientationModes = [Titanium.UI.PORTRAIT, Titanium.UI.UPSIDE_PORTRAIT, Titanium.UI.LANDSCAPE_LEFT, Titanium.UI.LANDSCAPE_RIGHT];
        win.tabBarHidden = true;
        win.translucent = true;
    }
    Ti.UI.currentTab.open(win);
}

function renderList(data){
    spinner.hide();
Ti.API.log(data);
    pages = data.query.results.res.pages || 1;
    table = $.create({
        opacity: 0,
        type: "TableView",
        childElements: !win.info ? 
            // first page, rendering spotlighted
            [{
                type: "TableViewSection",
                headerTitle: "Spotlighted",
                childElements: LDATA.getSelectedPhotoalbums().map(
                    function(i){
                        return {
                            info:{
                                title:i.title,
                                id:i.id,
                                spotlight:true
                            },
                            childElements:[{
                                text:i.title,
                                styleClass:"tableviewrowmainlabel"
                            },{
                                text: i.pics ? "("+i.pics+")" : "",
                                type: "Label",
                                styleClass:"tableviewrowsidelabel"
                            }]
                        };
                    }
                ).concat([{
                    type: "TableViewRow",
                    id: "fav",
                    info: {
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
                childElements: $.ensureArray(data.query.results.res.item).map(fixRow)
            }]
            :
            // rendering just list of items
            $.ensureArray(data.query.results.res.item).map(fixRow),
        click: clickRow
    });
    win.add(table);
    table.animate({opacity:1, duration: 500});
    updateFavourites();
    pageControl();
}


if (!win.paging){
    win.add(spinner);
    win.add(pageSelect);
    spinner.show();
    $.ajax({
        url: getREST(1,win.info ? win.info.type : "category"),
        success: renderList
    });
}
else {
    var pages = 1 + Math.floor(win.info.pics/100);
    Ti.API.log(["WEEE PAGING!",pages]);
    table = $.create({
        type: "TableView",
        childElements: (function(){
            var ret = [];
            for(var i=1; i<= pages; i++){
                ret.push(fixRow($.merge({title: "Section "+i,page: i},win.info)));
            }
            return ret;
        })(),
        click: clickRow
    });
    win.add(table);
}
win.addEventListener("focus",updateFavourites);


function updateFavourites(){
    if (!table || win.info) {return;}
    table.childrenById[0].childrenById.fav.childrenById.num.text = "("+(Ti.App.Properties.getList('favPics') || []).length+")";
}