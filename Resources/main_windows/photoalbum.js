Ti.include("../assets/utils.js");

var REST = "http://query.yahooapis.com/v1/public/yql?q=select%20src%20from%20html%20where%20url%3D%22http%3A%2F%2Fmvonlonski.com%2Fcpg%2Fthumbnails.php%3Falbum%3D"+Ti.UI.currentWindow.info.num+"%22%20and%20xpath%3D%22%2F%2Fimg%5B%40class%3D'image'%5D%22&format=json&callback=";

$.ajax({
    url: REST,
    success: render
});

function render(res){
    var views = [];
    for (var i=0; i<res.query.results.img.length;i++){
        views.push(Ti.UI.createImageView({
            url: "http://mvonlonski.com/cpg/" + res.query.results.img[i].src.replace("thumb_","") // TODO - fix image size
        }));
    }
    var scrollView = Titanium.UI.createScrollableView({
        views:views,
    	showPagingControl:true,
    	pagingControlHeight:30,
    	maxZoomScale:2.0,
    	currentPage:0
    });

    Titanium.UI.currentWindow.add(scrollView);
}
    
