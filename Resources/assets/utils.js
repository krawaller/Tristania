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
    "webview": {},
    "button": {},
    "view": {},
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
            return $.merge({id:id, presentation: $.getPresentation(id), comments: $.getComments(id)},data.members[id]);
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
            var albums = [];
            $.getAlbums().map(function(a){
                a = $.getAlbum(a.id); // need full data
                if (a.tracks.indexOf(id) != -1 || (a.bonustracks && a.bonustracks.indexOf(id) != -1)){
                    albums.push(a);
                }
            });
            return $.merge({id:id, albums: albums, comments: $.getComments(id)},data.tracks[id]);
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
                desc: "<p>First album! Gothic and nice.<p>",
                pic: "tristania-ww.jpg",
                year: 1997,
                scanalbum: 162,
                lineup: ["vibeke","morten","einar","rune","anders","kenneth","osten"],
                tracks: ["evenfall","paleenchantress","decemberelegy","midwintertears","angellore","mylostlenore","wastelandscaress"]
            },
            beyondtheveil: {
                title: "Beyond the Veil",
                shorttitle: "BtV",
                desc: "<p>Cult album!<p>",
                pic: "tristania-btv.jpg",
                year: 1998,
                scanalbum: 163,
                lineup: ["vibeke","morten","einar","rune","anders","kenneth","osten"],
                tracks: ["beyondtheveil","aphelion","asequelofdecay","opusrelinque","letheanriver","ofruinsandarednightfall","angina","heretique","dementia"]
            },
            worldofglass: {
                title: "World of Glass",
                shorttitle: "WoG",
                desc: "<p>Rules!<p>",
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
                desc: "<p>Awesome album!<p>",
                pic: "tristania-ashes.jpg",
                scanalbum: 165,
                year: 2004,
                lineup: ["vibeke","morten","einar","rune","anders","kenneth","osten","sveinterje","kjetili"],
                tracks: ["libre","equilibrium","thewretched","cure","circus","shadowman","endogenesis","bird"],
                bonustracks: ["thegate"]
            },
            illumination: {
                title: "Illumination",
                shorttitle: "Ilmntn",
                desc: "<p>Atmospheric!<p>",
                pic: "tristania-illumination.jpg",
                scanalbum: 166,
                year: 2006,
                lineup: ["vibeke","morten","einar","rune","anders","kenneth","osten","sveinterje"],
                tracks: ["mercyside","sanguinesky","openground","theravens","destinationdeparture","down","fate","lotus","sacrilege","deadlands"],
                bonustracks: ["inthewake","abinitio"]
            },
            rubicon: {
                title: "Rubicon",
                shorttitle: "Rbcn",
                desc: "<p>The new album! Woo!<p>",
                pic: "tristania-rubicon.jpg",
                scanalbum: 194,
                year: 2010,
                lineup: ["mary","kjetiln","einar","ole","anders","tarald","osten","gyri"],
                tracks: ["yearoftherat","protection","patriotgames","thepassing","exile","sirens","vulture","amnesia","magicalfix","illumination"],
                bonustracks: ["theemeraldpiper"]
            }
        },
        tracks: {
            evenfall: {
                title: "Evenfall"
            },
            paleenchantress: {
                title: "Pale Enchantress"
            },
            decemberelegy: {
                title: "December Elegy"
            },
            midwintertears: {
                title: "Midwintertears"
            },
            angellore: {
                title: "Angellore"
            },
            mylostlenore: {
                title: "My Lost Lenore"
            },
            wastelandscaress: {
                title: "Wasteland's Caress"
            },
            beyondtheveil: {
                title: "Beyond the Veil"
            },
            aphelion: {
                title: "Aphelion"
            },
            asequelofdecay: {
                title: "A Sequel of Decay"
            },
            opusrelinque: {
                title: "Opus Relinque"
            },
            letheanriver: {
                title: "Lethean River"
            },
            ofruinsandarednightfall: {
                title: "Of Ruins and a Red Nightfall"
            },
            angina: {
                title: "Angina"
            },
            heretique: {
                title: "Heretique"
            },
            dementia: {
                title: "Dementia"
            },
            theshiningpath: {
                title: "The Shining Path"
            },
            wormwood: {
                title: "Wormwood"
            },
            tendertriponearth: {
                title: "Tender Trip on Earth"
            },
            lost: {
                title: "Lost"
            },
            deadlocked: {
                title: "Deadlocked"
            },
            sellingout: {
                title: "Selling Out"
            },
            hatredgrows: {
                title: "Hatred Grows"
            },
            worldofglass: {
                title: "World of Glass"
            },
            crusheddreams: {
                title: "Crushed Dreams"
            },
            themodernend: {
                title: "The Modern End"
            },
            libre:{
                title: "Libre"
            },
            equilibrium:{
                title: "Equilibrium"
            },
            thewretched:{
                title: "The Wretched"
            },
            cure:{
                title: "Cure"
            },
            circus:{
                title: "Circus"
            },
            shadowman:{
                title: "Shadowman"
            },
            endogenesis:{
                title: "Endogenesis"
            },
            bird:{
                title: "Bird"
            },
            thegate:{
                title: "The Gate"
            },
            mercyside:{
                title: "Mercyside"
            },
            sanguinesky:{
                title: "Sanguine Sky"
            },
            openground:{
                title: "Open Ground"
            },
            theravens:{
                title: "The Ravens"
            },
            destinationdeparture:{
                title: "Destination Departure"
            },
            down:{
                title: "Down"
            },
            fate:{
                title: "Fate"
            },
            lotus:{
                title: "Lotus"
            },
            sacrilege:{
                title: "Sacrilege"
            },
            deadlands:{
                title: "Deadlands"
            },
            inthewake:{
                title: "In the Wake"
            },
            abinitio:{
                title: "Ab Initio"
            },
            yearoftherat:{
                title: "Year of the Rat"
            },
            protection:{
                title: "Protection"
            },
            patriotgames:{
                title: "Patriot Games"
            },
            thepassing:{
                title: "The Passing"
            },
            exile:{
                title: "Exile"
            },
            sirens:{
                title: "Sirens"
            },
            vulture:{
                title: "Vulture"
            },
            amnesia:{
                title: "Amnesia"
            },
            magicalfix:{
                title: "Magical Fix"
            },
            illumination:{
                title: "Illumination"
            },
            theemeraldpiper:{
                title: "The Emerald Piper"
            }
        }
    }
    
    return $;
})();
