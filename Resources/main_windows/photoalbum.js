Ti.include("../assets/utils.js");

function favs(){ return Ti.App.Properties.getList('favPics') || []; }

var win = Ti.UI.currentWindow,
    urls = [], // TODO - really need this as global var? Hacky!
    max = win.info.num == -666 ? favs().length : win.info.pics,
    scrollView,
    infoView = $.createWebView({
        zIndex: 0,
        opacity: 0 // <-- Remove hack when Titanium honors z-indexes
    });

function toggleUI(){
    Ti.API.log("TOGGLE");
}

function updateView(){
    // update favourites button
    fav.backgroundImage = favs().indexOf(urls[win.sv.currentPage]) == -1 ? '../pics/icon_unstar.png' : '../pics/icon_star.png';
    // update title
    win.setTitle((win.sv.currentPage+1)+"/"+max);
}

function createGallery(picurls){
    var views = [],v;
    for (var i=0; i<picurls.length;i++){
        v = $.createImageView({
            url: picurls[i], // TODO - fix image size
            width:  320,
    		height: 336
        });
        views.push(v);
        urls.push(picurls[i]);
    }
    scrollView = $.createScrollableView({
        views:views,
    	showPagingControl:true,
    	pagingControlHeight:30,
    	maxZoomScale:2.0,
    	currentPage:0
    });
    scrollView.addEventListener("scroll", updateView );
    scrollView.addEventListener("touch", toggleUI );

    win.add(scrollView);
    win.sv = scrollView; // TODO - access this more dexterously
    updateView();
}

function buildRemoteGallery(res){
    var picurls = [];
    res.query.results.img.map(function(img){
        picurls.push("http://mvonlonski.com/cpg/" + img.src.replace("thumb_","")); // TODO - fix image size
    });
    createGallery(picurls);
}

var info = $.createButton({
    systemButton: Ti.UI.iPhone.SystemButton.INFO_LIGHT,
    width: 18,
    height: 19,
    top: 15,
    left: 15,
    zIndex: 2,
    backgroundImage: '../pics/info_light.png'
});
win.add(info);

infoView.addEventListener('click', function(){
    win.animate({ 
        view: scrollView, 
        transition: Ti.UI.iPhone.AnimationStyle.CURL_UP
    });
    info.zIndex = 2;
    fav.zIndex = 2;
    save.zIndex = 2;
});

var fav = $.createButton({
    width: 18,
    height: 19,
    top: 45,
    left: 15,
    zIndex: 2,
    backgroundImage: '../pics/icon_unstar.png'
});
win.add(fav);

var save = $.createButton({
    width: 18,
    height: 19,
    top: 75,
    left: 15,
    zIndex: 2,
    backgroundImage: '../pics/save.png'
});
win.add(save);

info.addEventListener("click",function(){
    infoView.html = "<html><head><link rel='stylesheet' href='css/tristania.css' /><link rel='stylesheet' href='css/picinfo.css' /></head><body>" + 
                    "<h2>Picture</h2><dl><dt>URL</dt><dd>"+urls[win.sv.currentPage]+"</dd></dl>"+
                    "<h2>Album</h2><dl><dt>Name</dt><dd>"+win.info.title+"</dd></dl>"+
                    "</body></html";
    win.animate({ 
        view: infoView, 
        transition: Ti.UI.iPhone.AnimationStyle.CURL_DOWN
    });
   /* Ti.UI.createAlertDialog({
        title: 'Info',
        message: win.info.num == -666 ? "These are your favourit pics! Wee!" : "Album "+win.info.name+", last updated "+win.info.desc+". Yeah yeah, I will show more stuff here later, probably in a webview."
    }).show(); */
});

fav.addEventListener("click",function(){
    var val = urls[win.sv.currentPage],
        list = favs(),
        idx = list.indexOf(val);
    if (idx == -1){ // saving new pic
        list.push(val);
        Ti.UI.createAlertDialog({ title: 'Favourite stored', message: 'Pic added to the Favourites gallery' }).show();
        fav.backgroundImage = '../pics/icon_star.png';
    }
    else {
        list.splice(idx, 1);
        Ti.UI.createAlertDialog({ title: 'Favourite erased', message: 'Pic removed to the Favourites gallery' }).show();
        fav.backgroundImage = '../pics/icon_unstar.png';
    }
    Ti.App.Properties.setList('favPics', list);
});

save.addEventListener("click",function(){
    try {
        Ti.Media.saveToGallery(win.sv.views[win.sv.currentPage].toBlob());
        Ti.UI.createAlertDialog({ title: 'Saved', message: 'Pic is now in your photo gallery' }).show();
    }
    catch(e){
        Ti.UI.createAlertDialog({ title: 'Save failed', message: "Couldn't save pic to photo gallery! boo!" }).show();
    }
});

// main page logic - show favourites or load remote album

infoView.opacity = 0.8; // <-- Remove hack when Titanium honors z-indexes

if (win.info.num != -666){
    $.ajax({
        url: "http://query.yahooapis.com/v1/public/yql?q=select%20src%20from%20html%20where%20url%3D%22http%3A%2F%2Fmvonlonski.com%2Fcpg%2Fthumbnails.php%3Falbum%3D"+win.info.num+"%22%20and%20xpath%3D%22%2F%2Fimg%5B%40class%3D'image'%5D%22&format=json&callback=",
        success: buildRemoteGallery
    });
}
else {
    createGallery(favs());
}
