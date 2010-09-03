var noop = function(){}, 
    ajaxDefaults = {
        cache: true,
        data: {},
        error: function(){},
        defError: function(e){
			Ti.API.error(['xhr', this.opts]);
            var a = Ti.UI.createAlertDialog({
				buttonNames: ['Try Again','Cancel'],
				cancel: 1,
                title: 'Communication Error',
                message: "Couldn't contact the server. \nPlease fix your connection and try again."
            });
			var xhr = this;
			a.addEventListener('click', function(e){
				if(e.index == 0){
					$.ajax(xhr.inOpts);
				}
			});
			a.show();
        },
		appcacheAge: 3600,
        timeout: 30000,
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
        barColor: "#AAA"
    },
    "winlabel": {
        color:'#999',
       	font:{fontSize:20,fontFamily:'Helvetica Neue'},
        textAlign:'center',
        width:'auto'
    },
    "tab": {},
    "tabbedbar": {
        backgroundColor: "#aaa",
        height: 30,
  	    style:Titanium.UI.iPhone.SystemButtonStyle.BAR
    },
    "tableview": { backgroundColor: "transparent", separatorStyle: Ti.UI.iPhone.TableViewSeparatorStyle.NONE },
    "tableviewrow": { 
        color: "fuchsia", 
        selectedBackgroundImage: '../pics/row.png',
    },
    "tableviewrowmainlabel": {
        color: "black",
        font: { fontWeight: "bold", fontSize: 22, fontFamily: "AquilineTwo" },
        top: -15,
        left: 10,
        width: 260,
        height: 50
    },
    "tableviewrowsidelabel": {
        color: "#333",
        right: 10,
        width: "auto",
        font:{fontSize:15,fontFamily:'Helvetica Neue'},
        textAlign:'center'
    },
    "tableviewrowsublabel": {
        color: "#333",
        bottom: -30,
        left: 10,
        width: "auto",
        font:{fontSize:10,fontFamily:'Helvetica Neue'},
        textAlign:'center'
    },
    "tableviewrowsuperlabel": {
        color: "#333",
        top: -30,
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
    "tableviewheaderlabel": {
        color: "black",
        font: { fontWeight: "normal", fontStyle: "normal", fontSize: 14, fontFamily: "Bleeding Cowboys" },
        left: 10,
        height: 20
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
        color: "#000",
        width: "350",
        height: "50",
        textAlign: "center",
        font:{
            fontSize: 40,
            fontFamily: "Bleeding Cowboys"
        }
    },
 
    "sectionButton": {
        type: "WebView",
        templateFile: "sectionbutton.tmpl",
        height: 50,
        width: 200
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
        },
		extend: function(destination, source){
	        for (var property in source) { destination[property] = source[property]; }
	        return destination;
	    }
    };
    
	var crc32tab = [0x00000000,0x77073096,0xee0e612c,0x990951ba,0x076dc419,0x706af48f,0xe963a535,0x9e6495a3,0x0edb8832,0x79dcb8a4,0xe0d5e91e,0x97d2d988,0x09b64c2b,0x7eb17cbd,0xe7b82d07,0x90bf1d91,0x1db71064,0x6ab020f2,0xf3b97148,0x84be41de,0x1adad47d,0x6ddde4eb,0xf4d4b551,0x83d385c7,0x136c9856,0x646ba8c0,0xfd62f97a,0x8a65c9ec,0x14015c4f,0x63066cd9,0xfa0f3d63,0x8d080df5,0x3b6e20c8,0x4c69105e,0xd56041e4,0xa2677172,0x3c03e4d1,0x4b04d447,0xd20d85fd,0xa50ab56b,0x35b5a8fa,0x42b2986c,0xdbbbc9d6,0xacbcf940,0x32d86ce3,0x45df5c75,0xdcd60dcf,0xabd13d59,0x26d930ac,0x51de003a,0xc8d75180,0xbfd06116,0x21b4f4b5,0x56b3c423,0xcfba9599,0xb8bda50f,0x2802b89e,0x5f058808,0xc60cd9b2,0xb10be924,0x2f6f7c87,0x58684c11,0xc1611dab,0xb6662d3d,0x76dc4190,0x01db7106,0x98d220bc,0xefd5102a,0x71b18589,0x06b6b51f,0x9fbfe4a5,0xe8b8d433,0x7807c9a2,0x0f00f934,0x9609a88e,0xe10e9818,0x7f6a0dbb,0x086d3d2d,0x91646c97,0xe6635c01,0x6b6b51f4,0x1c6c6162,0x856530d8,0xf262004e,0x6c0695ed,0x1b01a57b,0x8208f4c1,0xf50fc457,0x65b0d9c6,0x12b7e950,0x8bbeb8ea,0xfcb9887c,0x62dd1ddf,0x15da2d49,0x8cd37cf3,0xfbd44c65,0x4db26158,0x3ab551ce,0xa3bc0074,0xd4bb30e2,0x4adfa541,0x3dd895d7,0xa4d1c46d,0xd3d6f4fb,0x4369e96a,0x346ed9fc,0xad678846,0xda60b8d0,0x44042d73,0x33031de5,0xaa0a4c5f,0xdd0d7cc9,0x5005713c,0x270241aa,0xbe0b1010,0xc90c2086,0x5768b525,0x206f85b3,0xb966d409,0xce61e49f,0x5edef90e,0x29d9c998,0xb0d09822,0xc7d7a8b4,0x59b33d17,0x2eb40d81,0xb7bd5c3b,0xc0ba6cad,0xedb88320,0x9abfb3b6,0x03b6e20c,0x74b1d29a,0xead54739,0x9dd277af,0x04db2615,0x73dc1683,0xe3630b12,0x94643b84,0x0d6d6a3e,0x7a6a5aa8,0xe40ecf0b,0x9309ff9d,0x0a00ae27,0x7d079eb1,0xf00f9344,0x8708a3d2,0x1e01f268,0x6906c2fe,0xf762575d,0x806567cb,0x196c3671,0x6e6b06e7,0xfed41b76,0x89d32be0,0x10da7a5a,0x67dd4acc,0xf9b9df6f,0x8ebeeff9,0x17b7be43,0x60b08ed5,0xd6d6a3e8,0xa1d1937e,0x38d8c2c4,0x4fdff252,0xd1bb67f1,0xa6bc5767,0x3fb506dd,0x48b2364b,0xd80d2bda,0xaf0a1b4c,0x36034af6,0x41047a60,0xdf60efc3,0xa867df55,0x316e8eef,0x4669be79,0xcb61b38c,0xbc66831a,0x256fd2a0,0x5268e236,0xcc0c7795,0xbb0b4703,0x220216b9,0x5505262f,0xc5ba3bbe,0xb2bd0b28,0x2bb45a92,0x5cb36a04,0xc2d7ffa7,0xb5d0cf31,0x2cd99e8b,0x5bdeae1d,0x9b64c2b0,0xec63f226,0x756aa39c,0x026d930a,0x9c0906a9,0xeb0e363f,0x72076785,0x05005713,0x95bf4a82,0xe2b87a14,0x7bb12bae,0x0cb61b38,0x92d28e9b,0xe5d5be0d,0x7cdcefb7,0x0bdbdf21,0x86d3d2d4,0xf1d4e242,0x68ddb3f8,0x1fda836e,0x81be16cd,0xf6b9265b,0x6fb077e1,0x18b74777,0x88085ae6,0xff0f6a70,0x66063bca,0x11010b5c,0x8f659eff,0xf862ae69,0x616bffd3,0x166ccf45,0xa00ae278,0xd70dd2ee,0x4e048354,0x3903b3c2,0xa7672661,0xd06016f7,0x4969474d,0x3e6e77db,0xaed16a4a,0xd9d65adc,0x40df0b66,0x37d83bf0,0xa9bcae53,0xdebb9ec5,0x47b2cf7f,0x30b5ffe9,0xbdbdf21c,0xcabac28a,0x53b39330,0x24b4a3a6,0xbad03605,0xcdd70693,0x54de5729,0x23d967bf,0xb3667a2e,0xc4614ab8,0x5d681b02,0x2a6f2b94,0xb40bbe37,0xc30c8ea1,0x5a05df1b,0x2d02ef8d];
	$.crc32 = function crc32 (str) {
	    var local_crc32tab = crc32tab,
	        crc = ~0;
	    for (var i = 0; i < str.length; i++){ crc = (crc >>> 8) ^ crc32tab[(crc ^ str.charCodeAt(i)) & 0xff]; }
	    crc = (~crc >>> 16) & 0x7fff;
	    return crc == 0 ? 1 : crc;
	};
	
    $.merge($, {
        ensureArray: function(d){
            return d instanceof Array ? d : d ? [d] : [];
        },
        ajax: function(inOpts){
            var opts = $.extend($.extend({}, ajaxDefaults), inOpts), 
                xhr = Ti.Network.createHTTPClient(opts), 
                data = $.extend(opts.data, opts.extendData || {}),
				loader = { hide: function(){} };
			
			if(opts.loader){
				loader = $.createActivityIndicator();
				Ti.UI.currentWindow.add(loader);
				loader.show();
			}
			xhr.inOpts = inOpts;
			
			if(!opts.url){
				loader.hide();
				return false;
			}
			
			if(opts.appcache){
				hash = $.crc32(opts.url+JSON.stringify(data)).toString();
				cache = Ti.App.Properties.getString(hash);
				if(!cache || ((d = JSON.parse(cache)) && new Date().getTime() - d.t > (opts.appcacheAge * 1000) )){
					bust = true;
				} else {
					Ti.API.info(['loaded from appcache', hash])
					opts.success.call(opts.context || xhr, (d.f == 'json' ? JSON.parse(d.c) : d.c) );
					loader.hide();
					return;
				}
			}
			   
            xhr.onload = function(){
                try {
                    var response;
                    switch (opts.dataType) {
                        case 'json':
                            response = JSON.parse(this.responseText);
							
							if(response.error){ // För helvete jacob, detta spränger allt utom YQL queries! :P || !(response.query && response.query.results)){
								Ti.API.error("=== Couldn't fetch " + xhr.opts.url + " because: "+response.error);
								//this.defError();
								//loader.hide();
								return;
							}
                            break;
                            
                        default:
                            response = this.responseText;
                            break;
                    }
	
					if(opts.appcache && bust && hash){
						Ti.API.info(['saving to appcache', hash]);
						Ti.App.Properties.setString(hash, JSON.stringify({ t: new Date().getTime(), f: opts.dataType, c: this.responseText }));
					}
					
                    opts.success.call(opts.context || xhr, response, xhr.status, xhr);
					loader.hide();
                } 
                catch (e) {
                    Ti.API.error(['e', e]);
                }
            }
            xhr.opts = opts;
            
            xhr.onerror = function(e){
				loader.hide();
				if( (opts.error && opts.error(e) !== false) || !opts.error){ xhr.defError(e); }
			}
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
            if (!o.type) {
                if (o.parentType == "TableViewSection" || o.parentType == "TableView"){
                    o.type = "TableViewRow";
                } 
                else if (o.text) {
                    o.type = "Label";
                }
            }
            if (!o.type){
                Ti.API.log(o);
                throw "What the heck, no type!";
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
                    shorttitle: data.discography[a].shorttitle,
                    title: data.discography[a].title,
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
        getAppData: function(){
            return JSON.parse(Ti.App.Properties.getString("appdata"));
        },
        
        
        
        updateData: function(){
        
        
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

// loading data from spreadsheet
$.ajax({
    url: "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%20%3D%20%22https%3A%2F%2Fspreadsheets.google.com%2Fpub%3Fkey%3D0AtXFhtKoQjGsdHpOSUd0TThVSHBRQlNPQUNQTkZQSUE%26hl%3Den%26output%3Dcsv%22&format=json&callback=",
    success: function(data){
        var store = {
            presentations: {},
            comments: [],
            selectedvideos: [],
            selectedphotoalbums: []
        },
            rows = data.query.results.row,
            len = rows.length;
        for(var i=0;i<len;i++){
            var table = rows[i].col1, j = i+1;
            switch(table){
                case "APPDATA":
                    store.appdata = {
                        info: rows[i+1].col0.replace(/"/g,""),
                        date: rows[i+1].col1
                    };
                    i+= 1;
                    break;
                case "PRESENTATIONS":
                    while(j<len && rows[j].col0!="TABLE"){
                        store.presentations[rows[j].col0] = rows[j].col1.replace(/"/g,"");
                        j++;
                    }
                    i = j - 1;
                    break;
                case "COMMENTS":
                    while(j<len && rows[j].col0!="TABLE"){
                        var about = rows[j].col1;
                        if (!store.comments[about]){
                            store.comments[about] = [];
                        }
                        store.comments[about].push({
                            by: rows[j].col0,
                            date: rows[j].col2,
                            content: rows[j].col3.replace(/"/g,"")
                        });
                        j++;
                    }
                    i = j - 1;
                    break;
                case "SELECTEDVIDEOS":
                    while(j<len && rows[j].col0!="TABLE"){
                        store.selectedvideos.push({
                            title: rows[j].col0,
                            id: rows[j].col1
                        });
                        j++;
                    }
                    i = j - 1;
                    break;
                case "SELECTEDPHOTOALBUMS":
                    while(j<len && rows[j].col0!="TABLE"){
                        store.selectedphotoalbums.push({
                            title: rows[j].col0,
                            id: rows[j].col1
                        });
                        j++;
                    }
                    i = j - 1;
                    break;
            }
        }
        Ti.App.Properties.setString("appdata",JSON.stringify(store.appdata));
		Ti.App.Properties.setString("comments",JSON.stringify(store.comments));
		Ti.App.Properties.setString("presentations",JSON.stringify(store.presentations));
		Ti.App.Properties.setString("selectedvideos",JSON.stringify(store.selectedvideos));
		Ti.App.Properties.setString("photoalbums",JSON.stringify(store.selectedphotoalbums));
		Ti.API.log("UPDATED DATA! YEAH!");
    }
});
/*

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
*/


// loading official videos
$.ajax({
    url: "http://gdata.youtube.com/feeds/api/videos?q=&author=TristaniaVideos&orderby=published&v=2&alt=json",
	success: function(data){
        if (typeof data === "string"){ data = JSON.parse(data); }
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
        }
    });
    
    
    // TODO - fix this poop, store as serialised text, update when necessary
    var data = {
        members: {
            ole: {
                current: true,
                name: "Ole Vistnes",
                role: "Bass, backing vocals",
                member: "2008 &rarr; present"
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
                member: "2010 &rarr; present"
            },
            sveinterje: {
                name: "Svein-Terje Solvang",
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
                member: "2001 &rarr; 2010",
                role: "Clean vocals"
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
            rubicon: {
                title: "Rubicon",
                shorttitle: "Rbcn",
                pic: "tristania-rubicon.jpg",
                scanalbum: 194,
                year: 2010,
                lineup: ["mary","kjetiln","einar","ole","anders","tarald","osten","gyri"],
                tracks: ["yearoftherat","protection","patriotgames","thepassing","exile","sirens","vulture","amnesia","magicalfix","illuminationtrack"],
                bonustracks: ["theemeraldpiper","caprice"]
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
            beyondtheveil: {
                title: "Beyond the Veil",
                shorttitle: "BtV",
                pic: "tristania-btv.jpg",
                year: 1999,
                scanalbum: 163,
                lineup: ["vibeke","morten","einar","rune","anders","kenneth","osten"],
                tracks: ["beyondtheveil","aphelion","asequelofdecay","opusrelinque","letheanriver","ofruinsandarednightfall","simbelmyne","angina","heretique","dementia"]
            },
            widowsweeds: {
                title: "Widow's weeds",
                shorttitle: "WW",
                pic: "tristania-ww.jpg",
                year: 1998,
                scanalbum: 162,
                lineup: ["vibeke","morten","einar","rune","anders","kenneth","osten"],
                tracks: ["preludium","evenfall","paleenchantress","decemberelegy","midwintertears","angellore","mylostlenore","wastelandscaress","postludium"]
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
                length: "6:32"
            },
            decemberelegy: {
                title: "December Elegy",
                length: "7:31"
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
                music: ["anders","ole","mary"]
            },
            protection:{
                title: "Protection",
                length: "4:15",
                lyrics: ["osten","mary"],
                music: ["anders","ole","mary"]
            },
            patriotgames:{
                title: "Patriot Games",
                length: "3:25",
                lyrics: ["osten"],
                music: ["anders","ole"]
            },
            thepassing:{
                title: "The Passing",
                length: "4:48",
                lyrics: ["tarald","Fredrik Sele","mary"],
                music: ["anders","ole","mary"]
            },
            exile:{
                title: "Exile",
                length: "4:26",
                lyrics: ["osten"],
                music: ["anders","ole","mary"]
            },
            sirens:{
                title: "Sirens",
                length: "4:27",
                lyrics: ["osten"],
                music: ["anders","ole","mary"]
            },
            vulture:{
                title: "Vulture",
                length: "3:43",
                lyrics: ["anders","tarald"],
                music: ["ole","Waldemar Sorychta","Sigmund Vegge","kjetiln"]
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
                music: ["ole","anders","tarald","Waldemar Sorychta"]
            },
            illuminationtrack:{
                title: "Illumination",
                length: "8:13",
                lyrics: ["osten"],
                music: ["einar"]
            },
            theemeraldpiper:{
                title: "The Emerald Piper",
                length: "3:07",
                lyrics: ["osten"],
                music: ["anders","ole"]
            },
            caprice:{
                title: "Caprice",
                length: "3:38",
                lyrics: ["tarald"],
                music: ["anders","ole"]
            }
        }
    };
    
    return $;
})();
