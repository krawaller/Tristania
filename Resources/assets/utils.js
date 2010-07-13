var noop = function(){}, 
    ajaxDefaults = {
        cache: true,
        data: {},
        error: function(e){
            Ti.API.info(['onerror', e]);
            Ti.UI.createAlertDialog({
                title: 'Error',
                message: e
            }).show();
        },
        timeout: 30,
        success: noop,
        type: 'GET',
        dataType: 'json'
    }, 
    slice = Array.prototype.slice, 
    splice = Array.prototype.splice,
    win = Ti.UI.currentWindow;

var defopts = {
 // ******************* All ******************
    "all": { },
 // ****************** Types *****************
    "win": {
        barColor: "#AAA",
        backgroundColor: "#000"
    },
    "winlabel": {
        color:'#999',
       	font:{fontSize:20,fontFamily:'Helvetica Neue'},
        textAlign:'center',
        width:'auto'
    },
    "tab": {},
    "tabbedbar": {
        backgroundColor: "#555"
    },
    "tableview": { backgroundColor: "#555" },
    "tableviewrow": { color: "#FFF" },
    "tableviewrowlabel": {
        color: "#AAA",
        right: 10,
        width: "auto",
        font:{fontSize:20,fontFamily:'Helvetica Neue'},
        textAlign:'center'
    },
    "tableviewsection": {
    },
    "tableheaderview": {
    },
    "tableheaderlabel": {
        backgroundColor: "#FFF",
        color: "#000"
    },
    "coverflowview":{
        backgroundColor: "#000"
    },
    "imageview": {
    	defaultImage: "../pics/image_loader.png"
    },
    "webview": { backgroundColor: "#000" },
    "button": {},
    "view": { backgroundColor: "#000"},
    "label": {},
 // ***************** Wins *******************
    "main_windows/gallery.js": {},
    "main_windows/photoalbum.js": {
    },
    "main_windows/albumlist.js": {}
};

String.prototype.clean = function(){ return this.replace(/\xA0/g, '').replace(/\s+/g, ' '); };

var $ = (function(){
    var $ = {
        merge: function(){    
            for (var property in arguments[1]) {
                if (!arguments[0].hasOwnProperty(property)){ arguments[0][property] = arguments[1][property]; }
            }
            splice.call(arguments,1,1);
            return arguments.length === 1 ? arguments[0] : $.merge.apply(0,arguments);
        },
        clone: function(arr){ return slice.call(arr); }
    };
    
    $.merge($, {
        ajax: function(inOpts){
            var opts = $.merge(inOpts, ajaxDefaults), 
                xhr = Ti.Network.createHTTPClient(), 
                data = $.merge(opts.data, opts.extendData || {});
            xhr.onload = function(){
                try {
                    var response;
                    switch (opts.dataType) {
                        case 'json':
                            response = JSON.parse(this.responseText);
                            break;
                            
                        default:
                            response = this.responseText;
                            break;
                    }
                    opts.success.call(opts.context || xhr, response, xhr.status, xhr);
                } 
                catch (e) { Ti.API.error(['e', e]); }
            };
            xhr.onerror = opts.error;
            xhr.open(opts.type, opts.url + (!opts.cache ? '?' + new Date().getTime() : ''));
            xhr.send(data);
        },
        ajaxSetup: function(opts){ $.merge(ajaxDefaults, opts); },
        msg: function(o){ win.add(Ti.UI.createLabel($.merge(o, defopts.winlabel, defopts.all))); },
        createWin: function(o){
            return Ti.UI.createWindow($.merge(o, defopts[o.url], defopts.win, defopts.all ));
        },
        createLabel: function(o){
            return Ti.UI.createLabel($.merge(o,defopts.label,defopts.all));
        },
        createTab: function(o){
            return Ti.UI.createTab(o);
        },
        createTabbedBar: function(o){
            return Ti.UI.createTabbedBar($.merge(o,defopts.tabbedbar,defopts.all));
        },
        createTableView: function(o){
            var table = Ti.UI.createTableView($.merge(o,defopts.tableview,defopts.all));
            if (o.sections){
                var sects = [];
                o.sections.map(function(s){ sects.push($.createTableViewSection(s)); });
                table.setData(sects);
            }
            if (o.rows){
                o.rows.map(function(r){ table.appendRow($.createTableViewRow(r)); });
            }
            return table;
        },
        createTableViewRow: function(o){
            var row = Ti.UI.createTableViewRow($.merge(o,defopts.tableviewrow,defopts.all));
            if (o.label){ row.add($.createTableViewRowLabel(o.label)); }
            row.def = o;
            return row;
        },
        createTableViewRowLabel: function(o){
            return Titanium.UI.createLabel($.merge(o,defopts.tableviewrowlabel,defopts.all));
        },
        createTableViewSection: function(o){
            var h = $.createView( $.merge({  }, defopts.tableheaderview ));
            h.add( $.createLabel( $.merge({ backgroundColor: o.headerBackgroundColor, color: o.headerColor, text: o.headerTitle }, defopts.tableheaderlabel )) );
            o.headerView = h;
            delete o.headerTitle;
            var s = Ti.UI.createTableViewSection($.merge(o,defopts.tableviewsection,defopts.all))
            if (o.datarows){
                o.datarows.map(function(r){ s.add($.createTableViewRow(r)); });
            };
            return s;
        },
        createScrollableView: function(o){
            return Ti.UI.createScrollableView($.merge(o,defopts.scrollableview,defopts.all));
        },
        createImageView: function(o){
            return Ti.UI.createImageView($.merge(o,defopts.imageview,defopts.all));
        },
        createCoverFlowView: function(o){
            return Ti.UI.createCoverFlowView($.merge(o,defopts.coverflowview,defopts.all));
        },
        createWebView: function(o){
            return Ti.UI.createWebView($.merge(o,defopts.webview,defopts.all));
        },
        createView: function(o){
            return Ti.UI.createView($.merge(o,defopts.view,defopts.all));
        },
        createButton: function(o){
            return Ti.UI.createButton($.merge(o,defopts.button,defopts.all));
        },
        createKraWebView: function(o){
            var webview = $.createWebView({url: "../views/"+ (o.masterPageFile || "_masterpage.html")}),
                template = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory+"/views/"+o.templateFile).read().text,
                opts = { template: template, data: {data: o.data} };
            webview.addEventListener("load",function(){ webview.evalJS("render("+JSON.stringify(opts)+")"); });
            return webview;
        },
        
    // ************ DATA FUNCTIONS **********************
        
        getMemberList: function(conds){
            var ret = [];
            m:for(var m in data.members){
                if (conds) {
                    for(var p in conds){
                        if (conds[p] != data.members[m][p]){
                            continue m;
                        }
                    }
                }
                ret.push({id:m,title:data.members[m].name,label:data.members[m].role});
            }
            return ret;
        },
        getMember: function(id){
            var member = data.members[id];
            return !member ? 0 : $.merge({id:id, presentation: $.getPresentation(id), comments: $.getComments(id)},data.members[id]);
        },
        getAlbums: function(){
            var ret = [];
            for(var a in data.discography){
                ret.push({
                    id: a,
                    pic: data.discography[a].pic,
                    shorttitle: data.discography[a].shorttitle
                });
            }
            return ret;
        },
        getAlbum: function(id){
            var a = data.discography[id], lineup = [];
            a.lineup.map(function(who){
                lineup.push($.getMember(who));
            });
            return $.merge({id:id, presentation: $.getPresentation(id), comments: $.getComments(id), lineup: lineup},a);
        },
        getTracks: function(arr){
            var ret= [];
            arr.map(function(t){
                ret.push({
                    id: t,
                    title: data.tracks[t].title
                });
            });
            return ret;
        },
        getTrack: function(id){
            var albums = [], credits = {}, track = data.tracks[id], m;
            $.getAlbums().map(function(a){
                a = $.getAlbum(a.id); // need full data
                if (a.tracks.indexOf(id) != -1 || (a.bonustracks && a.bonustracks.indexOf(id) != -1)){
                    albums.push({
                        id: a.id,
                        title: a.title
                    });
                }
            });
           ["music","lyrics"].map(function(c){
                if (track[c]){
                    credits[c] = [];
                    track[c].map(function(mid){
                        m = $.getMember(mid);
                        credits[c].push( m ? { name: m.name, id: m.id } : mid );
                    });
                }
            });
            return $.merge({id:id, albums: albums, music: credits.music, lyrics: credits.lyrics, presentation: $.getPresentation(id), comments: $.getComments(id)},track);
        },
        getNews: function(){
            return data.news;
        },
        getPresentation: function(id){
            return data.presentations[id];
        },
        getComments: function(id){
            var comments = data.comments[id];
            if (comments){ // TODO - should only do this when we update!
                for(var c in comments){
                    comments[c].name = $.getMember(comments[c].by).name;
                }
            }
            return data.comments[id];
        }
    });
    
    
    // TODO - fix this poop, store as serialised text, update when necessary
    var data = {
        comments: {
            widowsweeds: [{
                by: "ole",
                content: "<p>I like this album. Very different from what we do now, but still!</p>"
            },{
                by: "anders",
                content: "<p>But it shows that we were 17 at the time... :P</p>"
            }],
            evenfall: [{
                by: "einar",
                content: "<p>Nah, don't like this one, and the video they made is horrid...</p>"
            }]
        },
        presentations: {
            widowsweeds: "<p>First full length album, really nice! Wee! Woo!</p>",
            beyondtheveil: "<p>Cult album, really neat, hehe weeee!</p>",
            worldofglass: "<p>First after Morten's departure. Still standing strong!</p>",
            ashes: "<p>Long awaited WoG followup. Rulezzz!</p>",
            illumination: "<p>Last Vibeke album, she left immediately after completion.</p><p>Brilliant album! Vorph guest growls.</p>",
            rubicon: "<p>The new album! Woooo!</p>",
            ole: "<p>Nice guy! Also heavily involved in composing.</p>"
        },
        news: [{
            date: "2010-07-20",
            title: "Wahahah!",
            content: "<p>Moo wee huhuhu!</p>"
        },{
            date: "2010-06-30",
            title: "ojoj! nuså!",
            content: "<p>Jojojo!</p><p>Men bla bla bla också!</p>"
        },{
            date: "2010-06-05",
            title: "Nu händer det grejjer!",
            content: "<p>bla bla mooooooo</p>"
        },{
            date: "2010-06-02",
            title: "hihi!",
            content: "<p>gwihiiii</p>"
        }],
        members: {
            ole: {
                current: true,
                name: "Ole Vistnes",
                role: "Bass, backing vocals",
                member: "2008 &rarr; present",
                info: "<p>mooooomo moo mo</p>"
            },
            kenneth: {
                name: "Kenneth Olsson",
                role: "Drums",
                member: "1997 &rarr; 2010"
            },
            tarald: {
                current: true,
                name: "Tarald Lie",
                role: "Drums",
                member: "2010 &rarr; present",
                info: "<p>drumm drumm drumm</p>"
            },
            sveinterje: {
                name: "Svein-Terje Solvang",
                info: "<p>Svenke benke lalala!</p>",
                member: "2005 &rarr; 2008",
                role: "Guitars"
            },
            gyri: {
                name: "Gyri Losnegaard",
                member: "2009 &rarr; present",
                role: "Guitars",
                current: true
            },
            einar: {
                name: "Einar Moen",
                member: "1997 &rarr; present",
                role: "Keyboards",
                current: true
            },
            kjetili: {
                name: "Kjetil Ingebrethsen",
                member: "2002 &rarr; 2006",
                role: "Growls"
            },
            morten: {
                name: "Morten Veland",
                member: "1997 &rarr; 2000",
                role: "Guitars, growls"
            },
            osten: {
                name: "Østen Bergøy",
                member: "2001 &rarr; present",
                role: "Clean vocals",
                current: true
            },
            rune: {
                name: "Rune Østerhus",
                member: "1997 &rarr; 2009",
                role: "Bass"
            },
            mary: {
                name: "Mariangela Demurtas",
                member: "2007 &rarr; present",
                current: true,
                role: "Vocals"
            },
            vibeke: {
                name: "Vibeke Stene",
                member: "1997 &rarr; 2007",
                role: "Vocals"
            },
            anders: {
                name: "Anders Høyvik Hidle",
                member: "1997 &rarr; present",
                role: "Guitars, vocals",
                current: true
            },
            kjetiln: {
                name: "Kjetil Nordhus",
                member: "2010 &rarr; present",
                current: true,
                role: "Clean vocals"
            }
        },
        discography: {
            widowsweeds: {
                title: "Widow's weeds",
                shorttitle: "WW",
                pic: "tristania-ww.jpg",
                year: 1998,
                scanalbum: 162,
                lineup: ["vibeke","morten","einar","rune","anders","kenneth","osten"],
                tracks: ["preludium","evenfall","paleenchantress","decemberelegy","midwintertears","angellore","mylostlenore","wastelandscaress","postludium"]
            },
            beyondtheveil: {
                title: "Beyond the Veil",
                shorttitle: "BtV",
                pic: "tristania-btv.jpg",
                year: 1999,
                scanalbum: 163,
                lineup: ["vibeke","morten","einar","rune","anders","kenneth","osten"],
                tracks: ["beyondtheveil","aphelion","asequelofdecay","opusrelinque","letheanriver","ofruinsandarednightfall","simbelmyne","angina","heretique","dementia"]
            },
            worldofglass: {
                title: "World of Glass",
                shorttitle: "WoG",
                pic: "tristania-world.jpg",
                scanalbum: 164,
                year: 2001,
                lineup: ["vibeke","einar","rune","anders","kenneth","osten"],
                tracks: ["theshiningpath","wormwood","tendertriponearth","lost","deadlocked","sellingout","hatredgrows","worldofglass","crusheddreams"],
                bonustracks: ["themodernend"]
            },
            ashes: {
                title: "Ashes",
                shorttitle: "Ashes",
                pic: "tristania-ashes.jpg",
                scanalbum: 165,
                year: 2005,
                lineup: ["vibeke","morten","einar","rune","anders","kenneth","osten","sveinterje","kjetili"],
                tracks: ["libre","equilibrium","thewretched","cure","circus","shadowman","endogenesis","bird"],
                bonustracks: ["thegate"]
            },
            illumination: {
                title: "Illumination",
                shorttitle: "Ilmntn",
                pic: "tristania-illumination.jpg",
                scanalbum: 166,
                year: 2007,
                lineup: ["vibeke","morten","einar","rune","anders","kenneth","osten","sveinterje"],
                tracks: ["mercyside","sanguinesky","openground","theravens","destinationdeparture","down","fate","lotus","sacrilege","deadlands"],
                bonustracks: ["inthewake","abinitio"]
            },
            rubicon: {
                title: "Rubicon",
                shorttitle: "Rbcn",
                pic: "tristania-rubicon.jpg",
                scanalbum: 194,
                year: 2010,
                lineup: ["mary","kjetiln","einar","ole","anders","tarald","osten","gyri"],
                tracks: ["yearoftherat","protection","patriotgames","thepassing","exile","sirens","vulture","amnesia","magicalfix","illumination"],
                bonustracks: ["theemeraldpiper"]
            }
        },
        tracks: {
            preludium: {
                title: "Preludium",
                length: "1:09",
                instrumental: true
            },
            evenfall: {
                title: "Evenfall",
                length: "6:54"
            },
            paleenchantress: {
                title: "Pale Enchantress",
                length: "6:32",
            },
            decemberelegy: {
                title: "December Elegy",
                length: "7:31",
            },
            midwintertears: {
                title: "Midwintertears",
                length: "8:32"
            },
            angellore: {
                title: "Angellore",
                length: "7:17"
            },
            mylostlenore: {
                title: "My Lost Lenore",
                length: "6:23"
            },
            wastelandscaress: {
                title: "Wasteland's Caress",
                length: "7:40"
            },
            postludium: {
                title: "Postludium",
                length: "1:10",
                instrumental: true
            },
            beyondtheveil: {
                title: "Beyond the Veil",
                length: "6:37",
                music: ["morten","einar"],
                lyrics: ["morten","einar"]
            },
            aphelion: {
                title: "Aphelion",
                length: "7:50",
                music: ["morten"],
                lyrics: ["morten"]
            },
            asequelofdecay: {
                title: "A Sequel of Decay",
                length: "6:33",
                music: ["morten","einar"],
                lyrics: ["morten"]
            },
            opusrelinque: {
                title: "Opus Relinque",
                length: "6:08",
                music: ["anders","einar"],
                lyrics: ["einar"]
            },
            letheanriver: {
                title: "Lethean River",
                length: "5:56",
                music: ["morten","einar"],
                lyrics: ["morten"]
            },
            ofruinsandarednightfall: {
                title: "Of Ruins and a Red Nightfall",
                length: "6:22",
                music: ["morten"],
                lyrics: ["morten"]
            },
            simbelmyne: {
                title: "Simbelmynë",
                length: "1:00",
                music: ["einar"],
                instrumental: true
            },
            angina: {
                title: "Angina",
                length: "4:39",
                music: ["morten"],
                lyrics: ["morten"]
            },
            heretique: {
                title: "Heretique",
                length: "4:51",
                music: ["anders","einar"],
                lyrics: ["einar"]
            },
            dementia: {
                title: "Dementia",
                length: "2:21",
                music: ["einar"],
                lyrics: ["einar"]
            },
            theshiningpath: {
                title: "The Shining Path",
                length: "6:46",
                music: ["anders","einar"],
                lyrics: ["einar","osten"]
            },
            wormwood: {
                title: "Wormwood",
                length: "5:56",
                music: ["anders","einar"],
                lyrics: ["osten"]
            },
            tendertriponearth: {
                title: "Tender Trip on Earth",
                length: "5:18",
                music: ["anders","einar"],
                lyrics: ["osten"]
            },
            lost: {
                title: "Lost",
                length: "6:03",
                music: ["anders","einar"],
                lyrics: ["Pete Johansen"]
            },
            deadlocked: {
                title: "Deadlocked",
                length: "5:56",
                music: ["anders","einar"],
                lyrics: ["einar"]
            },
            sellingout: {
                title: "Selling Out",
                length: "6:19",
                music: ["anders","einar"],
                lyrics: ["osten"]
            },
            hatredgrows: {
                title: "Hatred Grows",
                length: "6:20",
                music: ["anders","einar"],
                lyrics: ["osten"]
            },
            worldofglass: {
                title: "World of Glass",
                length: "5:26",
                music: ["anders","einar"],
                lyrics: ["osten"]
            },
            crusheddreams: {
                title: "Crushed Dreams",
                length: "7:41",
                music: ["anders","einar"],
                lyrics: ["einar"]
            },
            themodernend: {
                title: "The Modern End",
                length: "4:45",
                music: ["Seigmen"],
                lyrics: ["Seigmen"]
            },
            libre:{
                title: "Libre",
                length: "4:30",
                lyrics: ["Kjartan Hermansen"]
            },
            equilibrium:{
                title: "Equilibrium",
                length: "5:49"
            },
            thewretched:{
                title: "The Wretched",
                length: "7:00"
            },
            cure:{
                title: "Cure",
                length: "5:59"
            },
            circus:{
                title: "Circus",
                length: "5:09",
                lyrics: ["Kjartan Hermansen"]
            },
            shadowman:{
                title: "Shadowman",
                length: "6:31"
            },
            endogenesis:{
                title: "Endogenesis",
                length: "7:35"
            },
            bird:{
                title: "Bird",
                length: "5:09"
            },
            thegate:{
                title: "The Gate",
                length: "6:45"
            },
            mercyside:{
                title: "Mercyside",
                length: "4:39",
                music: ["anders","einar","Waldemar Sorychta"],
                lyrics: ["osten"]
            },
            sanguinesky:{
                title: "Sanguine Sky",
                length: "3:50",
                music: ["anders","einar"],
                lyrics: ["Kjartan Hermansen"]
            },
            openground:{
                title: "Open Ground",
                length: "4:40",
                music: ["anders","einar"],
                lyrics: ["osten"]
            },
            theravens:{
                title: "The Ravens",
                length: "5:06",
                music: ["anders","einar"],
                lyrics: ["osten"]
            },
            destinationdeparture:{
                title: "Destination Departure",
                length: "4:34",
                music: ["anders","einar"],
                lyrics: ["einar"]
            },
            down:{
                title: "Down",
                length: "4:32",
                music: ["anders","einar"],
                lyrics: ["osten"]
            },
            fate:{
                title: "Fate",
                length: "4:59",
                music: ["anders","einar"],
                lyrics: ["osten"]
            },
            lotus:{
                title: "Lotus",
                length: "5:08",
                music: ["anders","einar"],
                lyrics: ["osten"]
            },
            sacrilege:{
                title: "Sacrilege",
                length: "4:15",
                music: ["anders","einar"],
                lyrics: ["einar"]
            },
            deadlands:{
                title: "Deadlands",
                length: "6:39",
                music: ["anders","einar"],
                lyrics: ["einar"]
            },
            inthewake:{
                title: "In the Wake",
                length: "4:08"
            },
            abinitio:{
                title: "Ab Initio",
                length: "5:44"
            },
            yearoftherat:{
                title: "Year of the Rat",
                length: "?:??"
            },
            protection:{
                title: "Protection",
                length: "?:??"
            },
            patriotgames:{
                title: "Patriot Games",
                length: "?:??"
            },
            thepassing:{
                title: "The Passing",
                length: "?:??"
            },
            exile:{
                title: "Exile",
                length: "?:??"
            },
            sirens:{
                title: "Sirens",
                length: "?:??"
            },
            vulture:{
                title: "Vulture",
                length: "?:??"
            },
            amnesia:{
                title: "Amnesia",
                length: "?:??"
            },
            magicalfix:{
                title: "Magical Fix",
                length: "?:??"
            },
            illumination:{
                title: "Illumination",
                length: "?:??"
            },
            theemeraldpiper:{
                title: "The Emerald Piper",
                length: "?:??"
            }
        }
    }
    
    return $;
})();
