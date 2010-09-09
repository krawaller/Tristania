Ti.include("../assets/utils.js");

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
                win.remove(table);
                spinner.show();
                win.rightNavButton.title = "page "+val+"/"+pages;
                $.ajax({
                    url: getREST(Math.round(val)),
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
            text: "page",
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
    table,
    datatype;

function getREST(p){
    var id = win.info ? win.info.id : 0,
        type = p ? "category" : datatype || "category",
        url = "http://query.yahooapis.com/v1/public/yql?q=use%20%22http%3A%2F%2F79.99.1.153%2Fyql%2Ftrist%2Ftristania_gallery.xml%22%20as%20t%3B%20select%20*%20from%20t%20where%20id%20%3D%20"+id+"%20and%20type%20%3D%20%22"+type+"%22%20and%20page%20%3D%20"+(p||1)+"&format=json";
    Ti.API.log([id,type,p,url]);
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
    if (row.pics){
        ret.childElements.push({text: "("+(row.albums?row.albums+"/":"")+row.pics+")", styleClass: "tableviewrowsidelabel"});
    }
    return ret;
}

function togglePageSelect(){
    (showingPageSelect ? pageSelect : table).animate({duration: 500, opacity: 0});
    (showingPageSelect ? table : pageSelect).animate({duration: 500, opacity: 1});
    showingPageSelect = !showingPageSelect;
    win.rightNavButton.selected = showingPageSelect;
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

function renderList(data){
    spinner.hide();
Ti.API.log(data);    
    datatype = data.query.results.res.type;
    pages = data.query.results.res.pages || 1;
    table = $.create({
        type: "TableView",
        childElements: !win.info ? 
            // first page, rendering spotlighted
            [{
                type: "TableViewSection",
                headerTitle: "Spotlighted",
                childElements: $.getSelectedPhotoalbums().map(
                    function(i){return {info:{title:i.title,id:i.id,spotlight:true},childElements:[{text:i.title,styleClass:"tableviewrowmainlabel"}]};}
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
        click: function(e){
            var win = $.create({
                type: "Window",
                url: datatype === "album" || e.rowData.info.num == -666 || e.rowData.info.spotlight ? 'photoalbum.js' : 'picturegallery.js',
                info: e.rowData.info
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
    updateFavourites();
    pageControl();
}

win.add(spinner);
win.add(pageSelect);
spinner.show();
$.ajax({
    url: getREST(),
    success: renderList
});
win.addEventListener("focus",updateFavourites);


function updateFavourites(){
    if (!table || win.info) {return;}
    table.childrenById[0].childrenById.fav.childrenById.num.text = "("+(Ti.App.Properties.getList('favPics') || []).length+")";
}