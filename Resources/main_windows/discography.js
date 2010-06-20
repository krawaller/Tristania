Ti.API.log("GAHODSA");

var albums = [{
    title: "Widow's weeds",
    desc: "<p>First album! Gothic and nice.<p>",
    pic: "tristania-ww.jpg",
    tracks: [{
        title: "Evenfall",
        lyrics: "<p>Dark though embrace my bleeding heart</p>",
        info: "<p>Bla bla whatever</p>"
    },{
        title: "Angellore",
        lyrics: "<p>Angellore!</p>",
        info: "<p>Bla bla weeeee!</p>"
    }]
},{
    title: "Beyond the Veil",
    desc: "<p>Cult album!<p>",
    pic: "tristania-btv.jpg",
    tracks: [{
        title: "Angina",
        lyrics: "<p>My carrion kind!</p>",
        info: "<p>wuuu!</p>"
    },{
        title: "Heretique",
        lyrics: "<p>Lost in sacrilege!</p>",
        info: "<p>Tuff!</p>"
    }]
},{
    title: "World of Glass",
    desc: "<p>Rules!<p>",
    pic: "tristania-world.jpg",
    tracks: [{
        title: "The Shining Path",
        lyrics: "<p>Sacrifice her life for fire!</p>",
        info: "<p>megatuff</p>"
    },{
        title: "Selling Out",
        lyrics: "<p>I'm selling out!</p>",
        info: "<p>Bla bladmsaodmoas weeeee!</p>"
    }]
},{
    title: "Ashes",
    desc: "<p>Awesome album!<p>",
    pic: "tristania-ashes.jpg",
    tracks: [{
        title: "Libre",
        lyrics: "<p>For we have denominated the devil</p>",
        info: "<p>ascool sång</p>"
    },{
        title: "Shadowman",
        lyrics: "<p>He holds the pain!</p>",
        info: "<p>Så grymt bra låt!</p>"
    }]
},{
    title: "Illumination",
    desc: "<p>Atmospheric!<p>",
    pic: "tristania-illumination.jpg",
    tracks: [{
        title: "Mercyside",
        lyrics: "<p>The surface is smooth and cold but underneath the blood always boils!</p>",
        info: "<p>Grym live!</p>"
    },{
        title: "The Ravens",
        lyrics: "<p>I will not kneel!</p>",
        info: "<p>fräck!</p>"
    }]
},{
    title: "Rubicon",
    desc: "<p>The new album! Woo!<p>",
    pic: "tristania-rubicon.jpg",
    tracks: [{
        title: "Year of the Rat",
        lyrics: "<p>Woooo rat!</p>",
        info: "<p>Läcker!</p>"
    },{
        title: "Magical fix",
        lyrics: "<p>Magical fix! Magical fix! Magical fix!</p>",
        info: "<p>Tung!</p>"
    }]
}];

var images = [];

for (var i=0;i<albums.length;i++){
    images.push("../pics/"+albums[i].pic);
}

Ti.API.log("HMM");
Ti.API.log(images);

// create coverflow view with images
var view = Titanium.UI.createCoverFlowView({
	images:images,/*.map(function(path){
	    return Ti.UI.createImageView({
	        height: 100,
	        width: 100,
	        url: path
	    });
	})*/
	backgroundColor:'#000'
});

Ti.API.log("WUUUU!");

view.addEventListener("click",function(e){
    var a = albums[e.index], win = Titanium.UI.createWindow({
        url:'album.js',
        title: a.title,
        albumData: a,
        backgroundColor:'#fff'
    });
    Titanium.UI.currentTab.open(win);
});

Titanium.UI.currentWindow.add(view);