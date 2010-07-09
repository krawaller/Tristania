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
    "coverflowview":{
        backgroundColor: "#000"
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
        getMemberList: function(conds){
            var ret = [];
            m:for(var m in data.members){
                if (conds) {
                    for(var p in conds){
                        Ti.API.log(p);
                        Ti.API.log(conds[p]);
                        Ti.API.log(data.members[m][p]);
                        if (conds[p] != data.members[m][p]){
                            continue m;
                        }
                    }
                }
                ret.push({id:m,title:data.members[m].name});
            }
            return ret;
        },
        getMember: function(id){
            return data.members[id];
        }
    });
    
    
    // TODO - fix this poop, store as serialised text, update when necessary
    var data = {
        "members": {
            "ole": {
                current: true,
                name: "Ole",
                info: "<p>mooooomo moo mo</p>"
            },
            "tarald": {
                current: true,
                name: "Tarald",
                info: "<p>drumm drumm drumm</p>"
            },
            "sveinterje": {
                name: "Svein-Terje",
                info: "<p>Svenke benke lalala!</p>",
            }
        },
    }
    
    return $;
})();