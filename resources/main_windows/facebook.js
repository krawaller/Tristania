Ti.include("../assets/utils.js");

win.title = "Facebook";

var spinner = Ti.UI.createActivityIndicator({ style: Ti.UI.iPhone.ActivityIndicatorStyle.BIG });

win.add(spinner);
spinner.show();

win.rightNavButton = $.create({
    type: "Button",
    image: '../pics/action.png',
    click: function(e){
        Ti.App.fireEvent("openUrl",{url:"http://www.facebook.com/pages/Official-Tristania/124865974216395"});
    }
});

$.ajax({
    url: "https://graph.facebook.com/124865974216395/posts?limit=25",
    success: receiveData,
    dataType: "text",
    fail: function(e){ $.msg(win,"Network fail!"); }
});

function receiveData(d){
    if (typeof d != "object"){
        d = JSON.parse(d);
    }
    spinner.hide();
    win.add($.create({type: "WebView", templateFile:"facebook.tmpl", templateData: d.data}));
}