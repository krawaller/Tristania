Ti.include("../assets/utils.js");

win.title = "Discography";

var images = [],
    albums = $.getAlbums();
    
albums.map(function(a){ images.push("../pics/"+a.pic); });

win.add( $.create({ 
  //  type: "View",
  //  childElements: {
        type: "CoverFlowView",
        images:images, 
        click: function(e){
            Ti.UI.currentTab.open($.create({
                type: "Window",
                url:'album.js',
                data: { id: albums[e.index].id }
            }));
        }
  //  }
}) );