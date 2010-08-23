Ti.include("../assets/utils.js");
    
win.title = "Biography";
    
win.add($.create({
    type: "TableView",
    childElements: [{
        type: "TableViewSection",
        headerTitle:"Members",
        childElements: $.getMemberList({current:true})
    },{ 
        type: "TableViewSection",
        headerTitle: "Former members",
        childElements: $.getMemberList({current:undefined})
    }],
    click: function(e){
        var win = $.create({ type: "Window", url:'bio.js' });
        win.data = e.rowData.def;
        Ti.UI.currentTab.open(win);
    }
}));