Ti.include("../assets/utils.js");
Ti.include("../assets/localdata.js");
    
win.title = "Biography";
    
win.add($.create({
    type: "TableView",
    childElements: [{
        type: "TableViewSection",
        headerTitle:"Members",
        childElements: $.map(LDATA.getMemberList({current:true}),function(n){
           n.childElements = [{text: n.title, styleClass: "tableviewrowmainlabel"}]; delete n.title;
        })
    },{ 
        type: "TableViewSection",
        headerTitle: "Former members",
        childElements: $.map(LDATA.getMemberList({current:undefined}),function(n){
           n.childElements = [{text: n.title, styleClass: "tableviewrowmainlabel"}]; delete n.title;
        })
    }],
    click: function(e){
        var win = $.create({ type: "Window", url:'bio.js' });
        win.data = e.rowData.def;
        Ti.UI.currentTab.open(win);
    }
}));