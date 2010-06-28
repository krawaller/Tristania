Ti.include("../assets/utils.js");

var albums = [{
    title: "Widow's weeds",
    desc: "<p>First album! Gothic and nice.<p>",
    pic: "tristania-ww.jpg",
    year: 1997,
    scanalbum: 162,
    lineup: ["Vibeke","Morten","Einar"],
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
    year: 1998,
    scanalbum: 163,
    lineup: ["Vibeke","Morten","Einar"],
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
    scanalbum: 164,
    year: 2001,
    lineup: ["Vibeke","Anders","Einar"],
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
    scanalbum: 165,
    year: 2004,
    lineup: ["Vibeke","Anders","Einar","Kjetil"],
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
    scanalbum: 166,
    year: 2006,
    lineup: ["Vibeke","Anders","Einar"],
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
    scanalbum: 194,
    year: 2010,
    lineup: ["Mariangela","Ole","Gyri","Tarald"],
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

var images = [], view;

albums.map(function(a){ images.push("../pics/"+a.pic); });

view = $.createCoverFlowView({ images:images });

view.addEventListener("click",function(e){
    var a = albums[e.index], win = $.createWin({
        url:'album.js',
        title: a.title,
        albumData: a
    });
    Ti.UI.currentTab.open(win);
});

win.add(view);