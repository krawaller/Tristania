function calculateDistance(p1, p2){
    if(!(p1 && p2)){ return -1; }
    var R = 6371;
    var dLat = toRad((p1.lat - p2.lat));
    var dLon = toRad((p1.lon - p2.lon));
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(p1.lat)) * Math.cos(toRad(p2.lat)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}

function toRad(deg){
    return deg * Math.PI / 180;
}

Number.prototype.dec = function(decimals){
    var multiplier = Math.pow(10, decimals);
    return Math.round(this * multiplier) / multiplier;
};

var $ = (function(){
    var $ = {};
    
    
    $.extend = function(destination, source){
        for (var property in source) {
            destination[property] = source[property];
        }
        return destination;
    };
    
    var noop = function(){
    }, ajaxDefaults = {
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
    }, slice = Array.prototype.slice;
    
    $.clone = function(arr){
        return slice.call(arr);
    };
    
    $.extend($, {
        ajax: function(inOpts){
            var opts = $.extend($.extend({}, ajaxDefaults), inOpts), 
                xhr = Ti.Network.createHTTPClient(), 
                data = $.extend(opts.data, opts.extendData || {});
               
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
                catch (e) {
                    Ti.API.error(['e', e]);
                }
            }
            
            xhr.onerror = opts.error;
            xhr.open(opts.type, opts.url + (!opts.cache ? '?' + new Date().getTime() : ''));
            xhr.send(data);
        },
        ajaxSetup: function(opts){
            $.extend(ajaxDefaults, opts);
        },
        msg: function(win,msg){
            var label1 = Titanium.UI.createLabel({
        	    color:'#999',
        	    text:msg,
            	font:{fontSize:20,fontFamily:'Helvetica Neue'},
    	        textAlign:'center',
    	        width:'auto'
            });
            win.add(label1);
        },
        createWin: function(o){
            return Ti.UI.createWindow($.extend(o,{backgroundColor: "#000",translucent:false}))
        },
        createTab: function(o){
            return Ti.UI.createTab(o);
        },
        createTabbedBar: function(o){
            return Ti.UI.createTabbedBar($.extend(o,{backgroundColor: "#000"}))
        },
        createTableView: function(o){
            return Ti.UI.createTableView($.extend(o,{backgroundColor: "#555"}));
        },
        createScrollableView: function(o){
            return Ti.UI.createScrollableView($.extend(o,{backgroundColor: "#000"}));
        },
        createImageView: function(o){
            return Ti.UI.createImageView($.extend(o,{backgroundColor: "#000"}));
        }
    });
    
    return $;
})();




          var reclean = /\xA0/g,
		  	  restrip = /\s+/g;
		  	  
		  String.prototype.clean = function(){
		  	  return this.replace(reclean, '').replace(restrip, ' ');
		  };