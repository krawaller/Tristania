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
    "tabbedbar": {},
    "tableview": { backgroundColor: "#555" },
    "tableviewrow": { color: "#FFF" },
    "tableviewrowlabel": {
        color: "#AAA",
        right: 10,
        width: "auto",
        font:{fontSize:20,fontFamily:'Helvetica Neue'},
        textAlign:'center',
        width:'auto'
    },
 // ***************** Wins *******************
    "main_windows/gallery.js": {},
    "main_windows/photoalbum.js": {},
    "main_windows/albumlist.js": {}
}

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
                    //Ti.API.info(['responseText', this.responseText]);
                    switch (opts.dataType) {
                        case 'json':
                            Ti.API.info('parsing');
                            response = JSON.parse(this.responseText);
                            break;
                            
                        default:
                            Ti.API.info('noparse');
                            response = this.responseText;
                            break;
                    }
                    opts.success.call(opts.context || xhr, response, xhr.status, xhr);
                } 
                catch (e) { Ti.API.error(['e', e]); }
            }
            xhr.onerror = opts.error;
            xhr.open(opts.type, opts.url + (!opts.cache ? '?' + new Date().getTime() : ''));
            xhr.send(data);
        },
        ajaxSetup: function(opts){ $.merge(ajaxDefaults, opts); },
        msg: function(win,msg){ win.add(Titanium.UI.createLabel($.merge({ text:msg }, defopts.winlabel, defopts.all))); },
        createWin: function(o){
            return Ti.UI.createWindow($.merge(o, defopts[o.url], defopts.win, defopts.all ))
        },
        createTab: function(o){
            return Ti.UI.createTab(o);
        },
        createTabbedBar: function(o){
            return Ti.UI.createTabbedBar($.merge(o,defopts.tabbedbar,defopts.all))
        },
        createTableView: function(o){
            var table = Ti.UI.createTableView($.merge(o,defopts.tableview,defopts.all)),row;        
            if (o.rows){          
                o.rows.map(function(r){
                    row = $.createTableViewRow(r);
                    if (r.label){ row.add($.createTableViewRowLabel(r.label)); }
                    table.appendRow(row);
                });
            }
            return table;
        },
        createTableViewRow: function(o){
            return Ti.UI.createTableViewRow($.merge(o,defopts.tableviewrow,defopts.all));
        },
        createTableViewRowLabel: function(o){
            var arg = $.merge(o,defopts.tableviewrowlabel,defopts.all);
            Ti.API.log("CREATING ROW LABEL");
            Ti.API.log(arg);
            return Titanium.UI.createLabel($.merge(o,defopts.tableviewrowlabel,defopts.all));
        },
        createScrollableView: function(o){
            return Ti.UI.createScrollableView($.merge(o,defopts.scrollableview,defopts.all));
        },
        createImageView: function(o){
            return Ti.UI.createImageView($.merge(o,defopts.imageview,defopts.all));
        }
    });
    
    return $;
})();
