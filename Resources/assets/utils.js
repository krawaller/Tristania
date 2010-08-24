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
    "win": { // TODO - remove this when all is translated
    //    barColor: "#AAA",
    //    backgroundColor: "#222"
    },
    "window": {
        barColor: "#AAA",
//        backgroundImage: "pics/tristaniabg.jpg"
    },
    "winlabel": {
        color:'#999',
       	font:{fontSize:20,fontFamily:'Helvetica Neue'},
        textAlign:'center',
        width:'auto'
    },
    "tab": {},
    "tabbedbar": {
        backgroundColor: "#aaa"
    },
    "tableview": { backgroundColor: "transparent", separatorStyle: Ti.UI.iPhone.TableViewSeparatorStyle.NONE },
    "tableviewrow": { color: "#000", selectedBackgroundImage: '../pics/row.png' },
    "tableviewrowsidelabel": {
        color: "#AAA",
        right: 10,
        width: "auto",
        font:{fontSize:20,fontFamily:'Helvetica Neue'},
        textAlign:'center'
    },
    "tableviewrowsublabel": {
        color: "#AAA",
        bottom: -30,
        left: 10,
        width: "auto",
        font:{fontSize:10,fontFamily:'Helvetica Neue'},
        textAlign:'center'
    },
    "tableviewsection": {
    },
    "tableviewheaderview": {
        backgroundImage: '../pics/section.png'
    },
    "tableviewrowmainlabel": {
        color: "#fff",
        font: { fontWeight: "bold", fontSize: 20 },
        left: 10,
        width: 260,
        height: 36
    },
    "tableviewheaderlabel": {
        color: "#000",
        left: 10
    },
    "coverflowview":{
//        backgroundColor: "#222",
//        backgroundImage: "../pics/tristaniabg.jpg"
    },
    "imageview": {
    	defaultImage: "../pics/image_loader.png"
    },
    "webview": {
        backgroundColor: "transparent"
    },
    "button": {},
    "view": { 
    //    backgroundColor: "#222"
    //      backgroundImage: "../pics/tristaniabg.jpg"
    },
    "label": {},
    "bottombutton": {
        bottom: 0,
        title: 'Done',
        width: 320,
        height: 44,
        color: '#000',
        backgroundColor: '#ccc',
        backgroundImage: '',
    //    backgroundSelectedImage: '../ui/select-background.png',
        font: { fontFamily: 'Helvetica', fontSize: 17, fontWeight: 'bold'}
    },
 // ***************Styleclasses **************
 
    "categoryButton": {
        type: "Label",
        color: "#FFF",
        width: "100",
        height: "50",
        backgroundColor: "#333",
        font:{
            fontSize: 40,
            fontFamily: "Bleeding Cowboys"
        }
    },
 
 
 // ***************** Wins *******************
    "main_windows/gallery.js": {},
    "main_windows/photoalbum.js": {},
    "main_windows/albumlist.js": {}
};

String.prototype.clean = function(){ return this.replace(/\xA0/g, '').replace(/\s+/g, ' '); };

var $ = (function(){
    var $ = {
        merge: function(){
            if (!arguments[0]){
                arguments[0] = {};
            }
            if (!arguments[1]){
                arguments[1] = {};
            }
            for (var property in arguments[1]) {
                if (!arguments[0].hasOwnProperty(property)){ arguments[0][property] = arguments[1][property]; }
            }
            splice.call(arguments,1,1);
            return arguments.length === 1 ? arguments[0] : $.merge.apply(0,arguments);
        },
        clone: function(arr){ return slice.call(arr); },
        map: function(arr,func){ // simple wrapper around native map that also returns manipulated array (duh)
            arr.map(func);
            return arr;
        }
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
                catch (e) { Ti.API.error(['e', e, this.responseText]); }
            };

            xhr.onerror = opts.error;
            xhr.open(opts.type, opts.url + (!opts.cache ? '?' + new Date().getTime() : ''));
            xhr.send(data);
        },
        ajaxSetup: function(opts){ $.merge(ajaxDefaults, opts); },
        msg: function(o){ win.add(Ti.UI.createLabel($.merge(o, defopts.winlabel, defopts.all))); },
        create: function(o){
            if (typeof o === "string"){
                o = { type: "Label", text: o };
            }
         //   delete o.id;
            if (!o.type) {
                if (o.parentType == "TableViewSection" || o.parentType == "TableView"){
                    o.type = "TableViewRow";
                } 
                else if (o.text) {
                    o.type = "Label";
                }
            }
            o.childElements = o.childElements || [];
            if (o.type == "TableViewSection" && o.headerTitle){
                o.headerView = $.create({
                    type:"View",
                    styleClass: "tableviewheaderview",
                    childElements:[{
                        text: o.headerTitle,
                        styleClass: "tableviewheaderlabel"
                    }]
                });
                delete o.headerTitle;
            }
            if (o.type == "Window" && defopts[o.url]){
                 o = $.merge(o,defopts[o.url]);
            }
            if (o.styleClass){
                 if (typeof o.styleClass === "string") {
                     o = $.merge(o,defopts[o.styleClass] || {});
                 }
                 else {
                     o.styleClass.map(function(s){
                          o = $.merge(o,defopts[s] || {});
                     });
                 }
            }
            if (o.type == "WebView" && o.templateFile){
                o = $.merge(o, {
                    url: "../views/"+ (o.masterPageFile || "_masterpage.html"),
                    kraWebView: true
                });
            }
            var o = $.merge(o, defopts[o.type.toLowerCase()], defopts.all),
                e = Ti.UI["create"+o.type](o);
            e.def = o;
            if (o.kraWebView){
                var template = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory+"/views/"+o.templateFile).read().text,
                    opts = { template: template, data: {data: o.templateData} };
                e.addEventListener("load",function(){ e.evalJS("render("+JSON.stringify(opts)+")"); });
            }
            if (o.eventListeners){
                for(var event in o.eventListeners){
                    e.addEventListener(event,o.eventListeners[event]);
                }
            }
            if (o.click){
                e.addEventListener("click",o.click);
            }
            if (o.childElements.length){
                var child, children = [], i = 0, childrenById = {};
                o.childElements.map(function(c){
                    var child = $.create($.merge(c,{parentType:o.type})),
                        func = o.type=="TableView" && child.def.type == "TableViewRow" ? "appendRow" : "add";
                    childrenById[i++] = child;
                    if (c.id){
                        childrenById[c.id] = child;
                    }
                    if (o.type == "TableView" && child.def.type == "TableViewSection"){
                        children.push(child);
                    } else {
                        e[func](child); 
                    }
                });
                if (o.type == "TableView" && children.length){
                    e.setData(children);
                }
                e.childrenById = childrenById;
            }
            return e;
        },
        createWin: function(o){
            return Ti.UI.createWindow($.merge(o, defopts[o.url], defopts.win, defopts.all ));
        },
        createBottomButton: function(o){
            return Ti.UI.createButton($.merge(o, defopts.bottombutton, defopts.all ));
        },
        createLabel: function(o,add){
            if (typeof o === "string"){
                o = { text: o };
            }
            return Ti.UI.createLabel($.merge(o,add || {}, defopts.label,defopts.all));
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
            var t = o._title = o.title;
            delete o.title;
            var row = Ti.UI.createTableViewRow($.merge(o,defopts.tableviewrow,defopts.all));
            if (t){ row.add($.createLabel(t,defopts.tableviewrowmainlabel)); }
            if (o.sidelabel){ row.add($.createLabel(o.sidelabel,defopts.tableviewrowsidelabel)); }
            if (o.sublabel){ row.add($.createLabel(o.sublabel,defopts.tableviewrowsublabel)); }
            row.def = o;
            return row;
        },
        createTableViewSection: function(o){
            var h = $.createView( $.merge({  }, defopts.tableviewheaderview ));
            h.add( $.createLabel( $.merge({ text: o.headerTitle }, defopts.tableviewheaderlabel )) );
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
            return JSON.parse(Ti.App.Properties.getString("news"));
        },
        getPresentation: function(id){
            return JSON.parse(Ti.App.Properties.getString("presentations"))[id];
        },
        getComments: function(id){
            var comments = JSON.parse(Ti.App.Properties.getString("comments"))[id];
            if (comments){ // TODO - should only do this when we update!
                for(var c in comments){
                    comments[c].name = $.getMember(comments[c].by).name;
                }
            }
            return comments;
        },
        getSelectedVideos: function(){
            return JSON.parse(Ti.App.Properties.getString("selectedvideos"));
        },
        getOfficialVideos: function(){
            return JSON.parse(Ti.App.Properties.getString("officialvideos"));
        },
        getSelectedPhotoalbums: function(){
            return JSON.parse(Ti.App.Properties.getString("photoalbums"));
        },
        updateData: function(){
        
        // TODO - load all at once from opentable
        
// loading news from tristania.com RSS feed
$.ajax({
    url: "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20feed%20where%20url%20%3D%20%22http%3A%2F%2Fwww.tristania.com%2F2010%2Findex.php%2Ffeed%22&format=json",
    success: function(data){
	    var newslist = [], rows = data.query.results.item instanceof Array ? data.query.results.item : [data.query.results.item];
	    rows.map(function(news){
		    newslist.push({
		        date: news.pubDate.substr(0,news.pubDate.length-15),
		        title: news.title,
		        content: news.encoded
		    });
		});
		Ti.App.Properties.setString("news",JSON.stringify(newslist));
		Ti.API.log("UPDATED NEWS!");
	}
});
        
/*// loading news  ---- OLD DEPRECATED, need to use the feed from homepage instead
$.ajax({
    url: "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%20%3D%20%22https%3A%2F%2Fspreadsheets.google.com%2Fpub%3Fkey%3D0AtXFhtKoQjGsdFc1bnhoXzBBc0pKU2gyVUduZE9vd3c%26hl%3Den%26output%3Dcsv%22&format=json",
    success: function(data){
	    var newslist = [], rows = data.query.results.row instanceof Array ? data.query.results.row : [data.query.results.row];
	    rows.map(function(news){
		    newslist.push({
		        date: news.col0,
		        title: news.col1,
		        content: news.col2.replace(/"/g,"") // cleaning away the random bloody quote marks
		    });
		});
		Ti.App.Properties.setString("news",JSON.stringify(newslist));
		Ti.API.log("UPDATED NEWS!");
	}
});*/

// loading comments
$.ajax({
    url: "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%20%3D%20%22https%3A%2F%2Fspreadsheets.google.com%2Fpub%3Fkey%3D0AtXFhtKoQjGsdDlod0RsUUlkclZIY3puSlpTeTRFZlE%26hl%3Den%26output%3Dcsv%22&format=json",
    success: function(data){
	    var commentlist = {}, rows = data.query.results.row instanceof Array ? data.query.results.row : [data.query.results.row];
	    rows.map(function(comment){
	        var about = comment.col1;
	        if (!commentlist[about]){
	            commentlist[about] = [];
	        }
		    commentlist[about].push({
		        by: comment.col0,
		        date: comment.col2,
		        content: comment.col3.replace(/"/g,"") // cleaning away the random bloody quote marks
		    });
		});
		Ti.App.Properties.setString("comments",JSON.stringify(commentlist));
		Ti.API.log("UPDATED COMMENTS!");
	}
});

// loading presentations
$.ajax({
    url: "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%20%3D%20%22https%3A%2F%2Fspreadsheets.google.com%2Fpub%3Fkey%3D0AtXFhtKoQjGsdHFINVcyNExtdXBBWlBGUmRoT1Nvamc%26hl%3Den%26output%3Dcsv%22&format=json",
    success: function(data){
	    var presentations = {}, rows = data.query.results.row instanceof Array ? data.query.results.row : [data.query.results.row];
	    rows.map(function(pres){
	        presentations[pres.col0] = pres.col1.replace(/"/g,""); // cleaning away the random bloody quote marks
		});
		Ti.App.Properties.setString("presentations",JSON.stringify(presentations));
		Ti.API.log("UPDATED PRESENTATIONS");
	}
});

// loading selected videos
$.ajax({
    url: "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%20%3D%20%22https%3A%2F%2Fspreadsheets.google.com%2Fpub%3Fkey%3D0AtXFhtKoQjGsdFU1Mk8zMHFOLWJGVGJubnN1NXMzb2c%26hl%3Den%26output%3Dcsv%22&format=json",
    success: function(data){
	    var videos = [], rows = data.query.results.row instanceof Array ? data.query.results.row : [data.query.results.row];
	    rows.map(function(vid){
	        videos.push({
	            title:vid.col0,
	            id:vid.col1
	        });
		});
		Ti.App.Properties.setString("selectedvideos",JSON.stringify(videos));
		Ti.API.log("UPDATED SELECTED VIDEOS");
	}
});

// loading official videos
$.ajax({
    url: "http://gdata.youtube.com/feeds/api/videos?q=&author=TristaniaVideos&orderby=published&v=2&alt=json",
	success: function(data){
	    var vids = data.feed.entry.map(function(entry){
	        return {
			    title: entry.title.$t,
    			id: entry.media$group.yt$videoid.$t,
	    		duration: entry.media$group.yt$duration.seconds,
		    	description: entry.media$group.media$description.$t,
		    	thumbnail: entry.media$group.media$thumbnail[0].url
	    	};
    	});
		Ti.App.Properties.setString("officialvideos",JSON.stringify(vids));
		Ti.API.log("UPDATED OFFICIAL VIDEOS");
	}
});

// loading spotlighted photoalbums
$.ajax({
    url: "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%20%3D%20%22https%3A%2F%2Fspreadsheets.google.com%2Fpub%3Fkey%3D0AtXFhtKoQjGsdF9rSXpsbUp5eTU5dmh4ZG5RTk9tYmc%26hl%3Den%26output%3Dcsv%22&format=json",
	success: function(data){
	    var photoalbums = [], rows = data.query.results.row instanceof Array ? data.query.results.row : [data.query.results.row];
	    rows.map(function(p){
	        photoalbums.push({
	            title:p.col0,
	            id:p.col1
	        });
		});
		Ti.App.Properties.setString("photoalbums",JSON.stringify(photoalbums));
		Ti.API.log("UPDATED PHOTOALBUMS");
	}
});
        
        }
    });
    
    
    // TODO - fix this poop, store as serialised text, update when necessary
    var data = {
    /*    comments: {
            widowsweeds: [{
                by: "ole",
                content: "<p>I like this album. Very different from what we do now, but still!</p>"
            },{
                by: "anders",
                content: "<p>But it shows that we were almost teenagers at the time...</p>"
            }],
            evenfall: [{
                by: "einar",
                content: "<p>The video they made for this track is absolutely horrid...</p>"
            }]
        },
        presentations: {
            widowsweeds: "<p>First full length album, which defined the gothic metal genre.</p>",
            beyondtheveil: "<p>Continuing the path embarked upon with Widow's Weeds, Beyond the Veil secured Tristania's claim to the gothic metal throne.</p>",
            worldofglass: "<p>With World of Glass, Tristania proved they were still standing strong in spite of Veland's departure.</p>",
            ashes: "<p>The long-awaited World of Glass followup showed a more mature Tristania, yet still retaining a gothic undercurrent.</p>",
            illumination: "<p>Yet again Tristania releases a different but similar album, with new musical approaches but still somehow woven from the same cloth.</p>",
            rubicon: "<p>With Rubicon Tristania enters a new era, where many of the new members contribute actively to the composing. This will also be the album premiere for Mariangela, new singer after Vibeke's departure.</p>",
            ole: "<p>Ole inherited Rune's bass responsibilities, but have quickly also become an important cog in the composing procedure. He also does backing vocals.</p>"
        },
        news: [{
            date: "2010-07-16",
            title: "New app version",
            content: "<p>A new version of the app is out! Hit the app store and update!</p>"
        },{
            date: "2010-07-02",
            title: "Rubicon release party",
            content: "<p>Make sure you're in Stavanger on september 25th!</p><p>More info blah blah etc etc aso aso.</p>"
        },{
            date: "2010-06-15",
            title: "Second Rubicon teaser",
            content: "<p>Check out the official youtube channel (just hit the tab right here in the app!) for a new Rubicon teaser!</p><p>This time featuring the previously announced work of the illustrious Pete Johanssen.</p>"
        }], */
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
                tracks: ["yearoftherat","protection","patriotgames","thepassing","exile","sirens","vulture","amnesia","magicalfix","illuminationtrack"],
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
                length: "4:35",
                lyrics: ["osten"],
                music: ["anders","ole","mary"],
            },
            protection:{
                title: "Protection",
                length: "4:15",
                lyrics: ["osten","mary"],
                music: ["anders","ole","mary"],
            },
            patriotgames:{
                title: "Patriot Games",
                length: "3:25",
                lyrics: ["osten"],
                music: ["anders","ole"],
            },
            thepassing:{
                title: "The Passing",
                length: "4:48",
                lyrics: ["tarald","Fredrik Sele","mary"],
                music: ["anders","ole","mary"],
            },
            exile:{
                title: "Exile",
                length: "4:26",
                lyrics: ["osten"],
                music: ["anders","ole","mary"],
            },
            sirens:{
                title: "Sirens",
                length: "4:27",
                lyrics: ["osten"],
                music: ["anders","ole","mary"],
            },
            vulture:{
                title: "Vulture",
                length: "3:43",
                lyrics: ["anders","tarald"],
                music: ["ole","Waldemar Sorychta","Sigmund Vegge","kjetiln"],
            },
            amnesia:{
                title: "Amnesia",
                length: "4:54",
                lyrics: ["ole","tarald"],
                music: ["ole","mary"],
            },
            magicalfix:{
                title: "Magical Fix",
                length: "4:20",
                lyrics: ["tarald"],
                music: ["ole","anders","tarald","Waldemar Sorychta"],
            },
            illuminationtrack:{
                title: "Illumination",
                length: "8:13",
                lyrics: ["osten"],
                music: ["einar"],
            },
            theemeraldpiper:{
                title: "The Emerald Piper",
                length: "3:07",
                lyrics: ["osten"],
                music: ["anders","ole"],
            }
        }
    }
    
    return $;
})();
