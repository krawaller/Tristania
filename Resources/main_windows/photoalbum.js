Ti.include("../assets/utils.js");

var start,
    navHidden = false,
    urls = [], // TODO - really need this as global var? Hacky!
    max = win.info.num == -666 ? favs().length : win.info.pics,
    scrollView,
    picView = $.createView({ backgroundColor: "#000" }),
    //infoView = $.createKraWebView({templateFile: "image.tmpl", data: {}}),
    infoView = $.createWebView({ url: "../views/image.html" }),
    info = $.createButton({
        systemButton: Ti.UI.iPhone.SystemButton.INFO_LIGHT,
        width: 18,
        height: 19,
        top: 55,
        left: 25,
        zIndex: 2,
        backgroundImage: '../pics/info_light.png'
    }),
    fav = $.createButton({
        width: 18,
        height: 19,
        top: 105,
        left: 25,
        zIndex: 2,
        backgroundImage: '../pics/icon_unstar.png'
    }),
    save = $.createButton({
        width: 18,
        height: 19,
        top: 155,
        left: 25,
        zIndex: 2,
        backgroundImage: '../pics/save.png'
    });
    
win.add(infoView);
win.add(picView);


    // ********** Dealing with hiding of UI when clicking pic *************

win.addEventListener('touchstart', function(e){
	start = { x: e.x, y: e.y, at: new Date().getTime() };
});

win.addEventListener('touchend', function(e){
	if(start && (new Date().getTime() - start.at) > 10 && (Math.abs(e.x-start.x) + Math.abs(e.y-start.y)) < 20){
		if(navHidden){
			// Might need to change the order of these to get the best result
			win.sv.showPagingControl = true;
			win.showNavBar();
			win.showTabBar();
			Ti.UI.iPhone.showStatusBar();
			
			info.opacity = fav.opacity = save.opacity = 1;
		} else {
			info.opacity = fav.opacity = save.opacity = 0;
			win.sv.showPagingControl = false;
			win.hideNavBar();
			win.hideTabBar();
			Ti.UI.iPhone.hideStatusBar();
		}
		navHidden = !navHidden;
	}
});

    // *************** Favourites code *************************************

function favs(){ return Ti.App.Properties.getList('favPics') || []; }

function updateView(){
    // update favourites button
    fav.backgroundImage = favs().indexOf(urls[win.sv.currentPage]) == -1 ? '../pics/icon_unstar.png' : '../pics/icon_star.png';
    // update title
    win.setTitle((win.sv.currentPage+1)+"/"+max);
}

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

win.add(fav);

    // ******************** Saving picture *************************

save.addEventListener("click",function(){
    try {
        Ti.Media.saveToGallery(win.sv.views[win.sv.currentPage].toBlob());
        Ti.UI.createAlertDialog({ title: 'Saved', message: 'Pic is now in your photo gallery' }).show();
    }
    catch(e){
        Ti.UI.createAlertDialog({ title: 'Save failed', message: "Couldn't save pic to photo gallery! boo!" }).show();
    }
});

win.add(save);


    // ******************** Infoview code **************************
   
info.addEventListener("click",function(){
    var pic = {
        title: win.info.title,
        url: urls[win.sv.currentPage]
    };
    //infoView.evalJS("reRender({ data: "+JSON.stringify(pic)+"})");
    infoView.evalJS("render({ pic: "+JSON.stringify(pic)+"})");
//    infoView.opacity = 0.8;
    win.animate({ 
        view: infoView, 
        transition: Ti.UI.iPhone.AnimationStyle.CURL_DOWN
    });
   /* Ti.UI.createAlertDialog({
        title: 'Info',
        message: win.info.num == -666 ? "These are your favourit pics! Wee!" : "Album "+win.info.name+", last updated "+win.info.desc+". Yeah yeah, I will show more stuff here later, probably in a webview."
    }).show(); */
});

win.add(info);

var hideInfoView = function(){
    win.animate({ 
        view: scrollView, 
        transition: Ti.UI.iPhone.AnimationStyle.CURL_UP
    });
    info.zIndex = 2;
    fav.zIndex = 2;
    save.zIndex = 2;
}

infoView.addEventListener('click', hideInfoView );

infoView.opacity = 0.8; // <-- Remove hack when Titanium honors z-indexes


var infoViewDoneButton = $.createBottomButton({});
infoView.add(infoViewDoneButton);
infoViewDoneButton.addEventListener('click', hideInfoView );




    // ***************** Main page logic - building favourite or remote gallery ************

function createGallery(picurls){
    var views = [],v;
    for (var i=0; i<picurls.length;i++){
        v = $.createImageView({
            image: picurls[i], // TODO - fix image size
            width:  320,
    		height: 480
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
    picView.add(scrollView);
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

if (win.info.num != -666){
    $.ajax({
        url: "http://query.yahooapis.com/v1/public/yql?q=select%20src%20from%20html%20where%20url%3D%22http%3A%2F%2Fmvonlonski.com%2Fcpg%2Fthumbnails.php%3Falbum%3D"+win.info.num+"%22%20and%20xpath%3D%22%2F%2Fimg%5B%40class%3D'image'%5D%22&format=json&callback=",
        success: buildRemoteGallery
    });
}
else {
    createGallery(favs());
}
