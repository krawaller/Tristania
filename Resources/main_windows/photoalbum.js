Ti.include("../assets/utils.js");

var win = Ti.UI.currentWindow,
    urls = [], // TODO - really need this as global var? Hacky!
    max = win.info.num == -666 ? (Ti.App.Properties.getList('favPics') || []).length : win.info.pics,
    saveButton = Ti.UI.createButton({ image: '../pics/icon_unstar.png' }),
    deleteButton = Ti.UI.createButton({ image: '../pics/icon_star.png' });

saveButton.addEventListener('click', function(e){
    var val = urls[win.sv.currentPage];
    if(!val){ return; }
    var list = Ti.App.Properties.getList('favPics') || [];
    list.indexOf(val) == -1 && list.push(val);
    Ti.App.Properties.setList('favPics', list);
    win.rightNavButton = deleteButton;
    Ti.UI.createAlertDialog({ title: 'Favourite saved', message: 'Pic added to the Favourites gallery' }).show();
});

deleteButton.addEventListener('click', function(e){
    var val = urls[win.sv.currentPage], list = Ti.App.Properties.getList('favPics') || [], idx;
    (idx = list.indexOf(val)) != -1 && list.splice(idx, 1);
    Ti.App.Properties.setList('favPics', list);
    win.rightNavButton = saveButton;
    Ti.UI.createAlertDialog({ title: 'Favourite erased', message: 'Pic removed from the Favourites gallery' }).show();
});

function toggleUI(){
    Ti.API.log("TOGGLE");
}

function updateView(){
    // update favourites button
    var url = urls[win.sv.currentPage];
    if ((Ti.App.Properties.getList('favPics') || []).indexOf(url) == -1) {
        Ti.API.log("this url is not in list, setting save button");
        win.rightNavButton = saveButton;
    } else {   
        Ti.API.log("this url is already in list, setting delete button");    
        win.rightNavButton = deleteButton;
    }
    // update title
    win.setTitle((win.sv.currentPage+1)+"/"+max);
}

function createGallery(picurls){
    var views = [],v;
    for (var i=0; i<picurls.length;i++){
        v = $.createImageView({
            url: picurls[i] // TODO - fix image size
        });
        views.push(v);
        urls.push(picurls[i]);
    }
    var scrollView = $.createScrollableView({
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


// main page logic - show favourites or load remote album
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
