Ti.include("../assets/utils.js");

var win = Ti.UI.currentWindow,
    urls = []; // TODO - really need this as global var? Hacky!


function loadFavState(){
Ti.API.log("DMADSA");
Ti.API.log(win.sv.currentPage);
    var url = urls[win.sv.currentPage];
    if ((Ti.App.Properties.getList('favPics') || []).indexOf(url) == -1) {
        Ti.API.log("this url is not in list, setting save button");
        win.rightNavButton = saveButton;
    } else {   
        Ti.API.log("this url is already in list, setting delete button");    
        win.rightNavButton = deleteButton;
    }
}

function buildRemoteGallery(res){
    var picurls = [];
    for (var i=0; i<res.query.results.img.length;i++){
        picurls.push("http://mvonlonski.com/cpg/" + res.query.results.img[i].src.replace("thumb_","")); // TODO - fix image size
    }
    createGallery(picurls);
}

function createGallery(picurls){
    var views = [],v;
    for (var i=0; i<picurls.length;i++){
        v = Ti.UI.createImageView({
            url: picurls[i] // TODO - fix image size
        });
        views.push(v);
        urls.push(picurls[i]);
    }
    var scrollView = Titanium.UI.createScrollableView({
        views:views,
    	showPagingControl:true,
    	pagingControlHeight:30,
    	maxZoomScale:2.0,
    	currentPage:0
    });
    scrollView.addEventListener("scroll",function(e){
        loadFavState();
    });

    win.add(scrollView);
    win.sv = scrollView; // TODO - access this more dexterously
    loadFavState();
}
    

// Let user favorize search
var saveButton = Ti.UI.createButton({
    image: '../pics/icon_unstar.png'
});


saveButton.addEventListener('click', function(e){
Ti.API.log("DSA");
    var val = urls[win.sv.currentPage];
Ti.API.log(val);    
    if(!val){ return; }
    var list = Ti.App.Properties.getList('favPics') || [];
    list.indexOf(val) == -1 && list.push(val);
    Ti.App.Properties.setList('favPics', list);
    Ti.App.fireEvent('favsUpdated', {
        searches: list
    });
    win.rightNavButton = deleteButton;
    Ti.UI.createAlertDialog({ title: 'Favourite saved', message: 'Pic added to the Favourites gallery' }).show();
});


var deleteButton = Ti.UI.createButton({
    image: '../pics/icon_star.png'
});
deleteButton.addEventListener('click', function(e){
    var val = urls[win.sv.currentPage];
    var list = Ti.App.Properties.getList('favPics') || [];
    (idx = list.indexOf(val)) != -1 && list.splice(idx, 1);
    Ti.App.Properties.setList('favPics', list);
    Ti.App.fireEvent('favsUpdated', {
        searches: list
    });
    win.rightNavButton = saveButton;
    Ti.UI.createAlertDialog({ title: 'Favourite erased', message: 'Pic removed from the Favourites gallery' }).show();
});


if (win.info.num != -666){
    $.ajax({
        url: "http://query.yahooapis.com/v1/public/yql?q=select%20src%20from%20html%20where%20url%3D%22http%3A%2F%2Fmvonlonski.com%2Fcpg%2Fthumbnails.php%3Falbum%3D"+win.info.num+"%22%20and%20xpath%3D%22%2F%2Fimg%5B%40class%3D'image'%5D%22&format=json&callback=",
        success: buildRemoteGallery
    });
}
else
{
    createGallery(Ti.App.Properties.getList('favPics') || []);
}
