Ti.include("../assets/utils.js");

win.title = win.info && win.info.title ? win.info.title : "Forum";
//Ti.UI.createAlertDialog({title:"DEBUG",message:"Came this far!"}).show();
var spinner = Ti.UI.createActivityIndicator({ style: Ti.UI.iPhone.ActivityIndicatorStyle.BIG }),
    setupPageControl = false,
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
                win.remove(view);
                win.rightNavButton.title = "page "+val+"/"+win.pages;
                $.ajax({
                    url: getREST(win.path,Math.round(val),win.perpage),
                    success: receiveData,
                    fail: function(e){ $.msg(win,"Network fail!"); }
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
    view;
    
//Ti.UI.createAlertDialog({title:"DEBUG",message:"Came THIS far! WEEE!"}).show();

function getREST(path,page,perpage){
    var bit = (page>1 ? path.replace("/?wap2","/"+((page-1)*perpage)+"/?wap2") : path || "");
    REST = 'http://query.yahooapis.com/v1/public/yql?q=use "http://79.99.1.153/yql/trist/tristania_forum.xml?20" as tf; select * from tf where path = "@bit"&format=json'.esc({
		bit: bit
	});
    Ti.API.log(["REST",bit,REST]);
    return REST;
}

win.add(spinner);
spinner.show();
win.add(pageSelect);

$.ajax({
    url: getREST(win.path,win.page,win.perpage),
    success: receiveData,
    fail: function(e){ $.msg(win,"Network fail!"); }
});

function togglePageSelect(){
    (showingPageSelect ? pageSelect : view).animate({duration: 500, opacity: 0});
    (showingPageSelect ? view : pageSelect).animate({duration: 500, opacity: 1});
    showingPageSelect = !showingPageSelect;
    win.rightNavButton.selected = showingPageSelect;
}

function pageControl(){
    if (win.pages>1 && !setupPageControl){
        pageSelect.childrenById.slider.max = win.pages;
        pageSelect.childrenById.slider.value = win.page;
        win.rightNavButton = $.create({
            type: "Button",
            title:"page 1/"+win.pages,
            click: togglePageSelect
        });
        setupPageControl = true;
    }
}

function receiveData(d){
if (!d.query || !d.query.results || !d.query.results.res){
    Ti.API.error("WTF?!?!");
    Ti.API.log(d);
    return;
}
    d = d.query.results.res;
    win.title = d.title || win.title;
Ti.API.log("POOP!");

    if (d.posts){
        win.pages = d.posts.pages;
        win.page = d.posts.page;
        win.perpage = 5;
Ti.API.log(["WEBVIEWPOSTS!",d.posts]);
        view = $.create({
            type: "WebView",
            templateFile: "forum_posts.tmpl",
            templateData: d.posts
        });
        win.add(view);
        spinner.hide();
        pageControl();
        return;
    }

    var t = {
        type: "TableView",
        opacity: 0,
        childElements: [],
        click: function(e){
            var win = $.create({ type: "Window", url:'forum.js' });
            win.path = e.rowData.def.path;
            win.backButtonTitle = "back";
            Ti.UI.currentTab.open(win);
        }
    };
/*    if (d.posts){
Ti.API.log("POSTS!");
        t.page = d.posts.page;
        t.pages = d.posts.pages;
        t.childElements = t.childElements.concat({
            type: "TableViewRow",
            childElements: [{
                type: "WebView",
                templateFile: "forum_posts.tmpl",
                templateData: d.posts
            }]
        });
        $.ensureArray(d.posts.post).map(function(p){
            return {
                title: p.title,
                type: "TableViewRow",
                text: p.content,
                childElements: [{
                    text: p.who,
                    type: "Label",
                    styleClass: "TableViewRowSuperLabel"
                }]
            };
        }));
    }*/
    if (d.boards){
Ti.API.log("BOARDS!");
        t.childElements = t.childElements.concat($.ensureArray(d.boards.board).map(function(b){
            return {
                childElements:[{text:b.title,styleClass:"tableviewrowmainlabel"}],
                path: b.path,
                type: "TableViewRow"
            };
        }));
    }
    if (d.topics){
Ti.API.log("TOPICS!");
        win.page = d.topics.page;
        win.pages = d.topics.pages;
        win.perpage = 9;
        t.childElements = t.childElements.concat($.ensureArray(d.topics.topic).map(function(t){
            return {
                childElements:[{text:t.title,styleClass:"tableviewrowmainlabel"}],
                path: t.path,
                type: "TableViewRow"
            };
        }));
    }
    if (d.cats){
Ti.API.log("CATEGORIES!");
        t.childElements = t.childElements.concat($.ensureArray(d.cats.cat).map(function(c){
            return {
                headerTitle: c.title,
                type: "TableViewSection",
                childElements: $.ensureArray(c.boards.board).map(function(b){
                    return {
                        childElements:[{text:b.title,styleClass:"tableviewrowmainlabel"}],
                        path: b.path,
                        type: "TableViewRow"
                    };
                })
            };
        }));
    }
Ti.API.log("RENDERING TABLES");
    view = $.create(t);
    win.add(view);
    view.animate({opacity: 1, duration: 500});
    spinner.hide();
    pageControl();
}