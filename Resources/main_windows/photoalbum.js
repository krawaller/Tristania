Ti.include("../assets/utils.js");

win.backButtonTitle = "back";

function getREST(p){
    var id = win.info ? win.info.id : 0;
    return "http://query.yahooapis.com/v1/public/yql?q=use%20%22http%3A%2F%2F79.99.1.153%2Fyql%2Ftrist%2Ftristania_gallery.xml%22%20as%20t%3B%20select%20*%20from%20t%20where%20id%20%3D%20"+id+"%20and%20type%20%3D%20%22album%22%20and%20page%20%3D%20"+(p || 1)+"&format=json";
}

var start,
    pages = 1,
    page = 1,
    navHidden = false,
    urls = [], // TODO - really need this as global var? Hacky!
    max = win.info.num == -666 ? favs().length : win.info.pics,
    scrollView,
    spinner = Ti.UI.createActivityIndicator({ style: Ti.UI.iPhone.ActivityIndicatorStyle.BIG }),
    picView = $.create({
        type: "View",
        backgroundColor: "#000", 
        opacity: 0,
        eventListeners: {
            load: function(e){
                picView.animate({duration:500,opacity:1});
                spinner.hide();
            }
        }
    }),
    addfav = $.create({ type: "Button", image: '../pics/icon_unstar_light.png' }),
    delfav = $.create({ type: "Button", image: '../pics/icon_star_light.png'}),
    favbutton = $.create({type: "Button",height: 30, width: 30, right: 10, style: Ti.UI.iPhone.SystemButtonStyle.PLAIN, image: '../pics/icon_unstar_light.png',click:setFav}),
    pagebutton = $.create({type: "Button",height: 30,width: 40, left: 10, opacity: 0, color: "#000", title: "page"}),
    navbar = $.create({type: "View", height: 40, width: 100});
navbar.add(favbutton);
navbar.add(pagebutton);
win.add(picView);
if (!(win.info.num == -666 && favs().length == 0)){
    win.rightNavButton = addfav; //navbar;
}


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
		//	info.opacity = fav.opacity = save.opacity = 1;
		} else {
		//	info.opacity = fav.opacity = save.opacity = 0;
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
//    fav.backgroundImage = favs().indexOf(urls[win.sv.currentPage]) == -1 ? '../pics/icon_unstar_light.png' : '../pics/icon_star_light.png';
    win.rightNavButton = favs().indexOf(urls[win.sv.currentPage]) == -1 ? addfav : delfav;
//    favbutton.image = favs().indexOf(urls[win.sv.currentPage]) == -1 ? '../pics/icon_unstar_light.png' : '../pics/icon_star_light.png';
//    favbutton.animate({image:favs().indexOf(urls[win.sv.currentPage]) == -1 ? '../pics/icon_unstar_light.png' : '../pics/icon_star_light.png',duration:100});
    // update title    
    win.setTitle((win.sv.currentPage+1)+"/"+max);
}

function setFav(){
    var val = urls[win.sv.currentPage],
        list = favs(),
        idx = list.indexOf(val);
    if (idx == -1){ // saving new pic
        list.push(val);
        Ti.UI.createAlertDialog({ title: 'Favourite stored', message: 'Pic added to the Favourites gallery' }).show();
    }
    else {
        list.splice(idx, 1);
        Ti.UI.createAlertDialog({ title: 'Favourite erased', message: 'Pic removed to the Favourites gallery' }).show();
    }
    Ti.App.Properties.setList('favPics', list);
    updateView();
};

addfav.addEventListener("click",setFav);
delfav.addEventListener("click",setFav);



    // ***************** Main page logic - building favourite or remote gallery ************

function createGallery(picurls){
    var views = [],v;
    for (var i=0; i<picurls.length;i++){
        v = $.create({
            type: "ImageView",
            image: picurls[i], // TODO - fix image size
            width:  320,
    		height: 480
        });
        views.push(v);
        urls.push(picurls[i]);
    }
    max = views.length;
    scrollView = $.create({
        type: "ScrollableView",
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
    var picurls = $.ensureArray(res.query.results.res.item).map(function(i){
        return "http://mvonlonski.com/cpg/" + i.path;
    });
    pages = res.query.results.res.pages || 1;
    createGallery(picurls);
}

if (win.info.num != -666){
Ti.API.log("REMOTE GALLERY LOAD LOAD LOAD !!");
    win.add(spinner);
    spinner.show();
    $.ajax({
        url: getREST(win.info && win.info.page),
        success: buildRemoteGallery
    });
}
else {
    if (favs().length === 0){
        Ti.UI.createAlertDialog({ title: 'No favourites', message: "Browse the other photoalbums and select your favourites!" }).show();
        win.title = "Favourites";
    }
    else {
        createGallery(favs());
    }
}
