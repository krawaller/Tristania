Ti.include("../assets/utils.js");
Ti.include("../assets/localdata.js");

var tourdates = LDATA.getTourDates(),
    nodates = [{
        type: "TableViewRow",
        childElements: [{
            styleClass: "tableviewrowmainlabel",
            text: "No upcoming dates!"
        }]
    }];

win.title = "Tourdates";

function fixDate(info){
    return {
        type: "TableViewRow",
        hasChild: info.href ? true : false,
        childElements: [{
            styleClass: "tableviewrowmainlabel",
            text: info.venue+", "+info.date
        },{
            styleClass: "tableviewrowsublabel",
            text: (" in "+info.city+", "+info.country+(info["with"] ? " with "+info["with"] : "")).truncate(60)
        }],
        click: function(e){
            if(info.href){
                Ti.App.fireEvent("openUrl",{url:info.href});
            }
        }
    };
}

var view = $.create({
    type: "View",
    childElements: [{
        id: "upcomingView",
        type: "TableView",
        opacity: 0,
        childElements: tourdates && tourdates.upcoming && tourdates.upcoming.concert && tourdates.upcoming.concert.length>0 ? tourdates.upcoming.concert.map(fixDate) : nodates
    },{
        id: "pastView",
        type: "TableView",
        opacity: 0
    }]
});

win.add(view);
setTimeout(function(e){
    view.childrenById.upcomingView.animate({opacity:1,duration:500});
},500);

var i = 0;
function render(){
    //Ti.API.log([view,tourdates.previous.concert.length,i,(view && tourdates.previous.concert.length > i),tourdates.previous.concert[i]]);
    if (view && tourdates.previous.concert.length > i){
        view.childrenById.pastView.appendRow($.create(fixDate(tourdates.previous.concert[i])));
        i++;
        setTimeout(render,0);
    }
}

if (!tourdates || !tourdates.previous){
        $.create({
            type: "AlertDialog",
            title: "Error",
            message: "Haven't yet loaded tourdates from the net. Please navigate to Application/Data handling and download the info!",
            click: function(){
                win.close();
            }
        }).show();
}
else {
    render();
}

win.rightNavButton = $.create({ 
    type: "TabbedBar",
    labels:[
       "future",
       "past"
    ], 
    index:0,
    click: function(e){
        view.childrenById[e.index == 0 ? "upcomingView" : "pastView"].animate({duration: 500, opacity: 1});
        view.childrenById[e.index == 1 ? "upcomingView" : "pastView"].animate({duration: 500, opacity: 0});
    }
});


