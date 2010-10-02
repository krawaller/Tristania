$ = function(str){ return document.getElementById(str); };
$$ = function(str){ return document.querySelectorAll(str); };

document.addEventListener('click', function(e){
	if(e.target.nodeName == 'A'){
		e.preventDefault();
		Ti.App.fireEvent('openUrl', { url: e.target.getAttribute('href'), title: e.target.textContent });
	}
}, false);

var timer, startEl;
document.addEventListener('touchstart', function(e){ 
    startEl = e.target; 
    moved = false; 
    timer = setTimeout(function(){ 
        customEvent = document.createEvent("Events");
        customEvent.initEvent('down', true, true);
        startEl.dispatchEvent(customEvent);
    }, 100);  
}, false);
document.addEventListener('touchmove', function(){ moved = true; if(timer){ clearTimeout(timer); } }, false);
document.addEventListener('touchend', function(e){
    if(timer){ clearTimeout(timer); }
    
    customEvent = document.createEvent("Events");
    customEvent.initEvent('up', true, true);
    startEl.dispatchEvent(customEvent);
     
    if(!moved && e.target == startEl){
        customEvent = document.createEvent("Events");
        customEvent.initEvent('tap', true, true);
        startEl.dispatchEvent(customEvent);
    }
}, false);

var slice = Array.prototype.slice;

var tmpl = function(str, data){
    var err = "";
    try {
        var func = tmpl.cache[str];
        if (!func) {
            var strFunc = "var PPP666=[];with(obj){PPP666.push('" +
            str.replace(/[\r\t\n]/g, " ").replace(/'(?=[^#]*#>)/g, "\t").split("'").join("\\'").split("\t").join("'").replace(/<#=(.+?)#>/g, "',$1,'").split("<#").join("');").split("#>").join("PPP666.push('") +
            "');}return PPP666.join('');";
            func = new Function("obj", strFunc);
            tmpl.cache[str] = func;
        }
        return func(data);
    } 
    catch (e) {
        Ti.App.fireEvent('error', e);
    }
    return '<div style="width: 200px; margin: 0 auto; text-align: center; font-size: 20px; font-family: Helvetica; margin-top: 100px;">Something went wrong. Please try again!</div>';
};
tmpl.cache = {};

var _ = {
    each: function(obj, fn){
        (obj instanceof Array ? obj : [obj]).forEach(fn);
    }    
};

Array.prototype.remove = function(obj){
    var idx;
    while( (idx = this.indexOf(obj)) != -1 ){
        this.splice(idx, 1);
    }
    return this;
};

H = {
  renderAlbumLink: function(a){
    return "<span>"+a.title+"</span>"; //"<a href='#' class='tlink' cat='album' targetid='"+a.id+"'>"+a.title+"</a>";
  },
  renderMemberLink: function(b){
    if (typeof b === "string"){
      return "<span>"+b+"</span>";
    }
    return "<span>"+b.name+"</span>"; //"<a href='#' class='tlink' cat='bio' targetid='"+b.id+"'>"+b.name+"</a>";
  },
  ensureArray: function(d){
      return d instanceof Array ? d : d ? [d] : [];
  },
  linkify: (function(window){var k="[a-z\\d.-]+://",h="(?:(?:[0-9]|[1-9]\\d|1\\d{2}|2[0-4]\\d|25[0-5])\\.){3}(?:[0-9]|[1-9]\\d|1\\d{2}|2[0-4]\\d|25[0-5])",c="(?:(?:[^\\s!@#$%^&*()_=+[\\]{}\\\\|;:'\",.<>/?]+)\\.)+",n="(?:ac|ad|aero|ae|af|ag|ai|al|am|an|ao|aq|arpa|ar|asia|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|biz|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|cat|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|coop|com|co|cr|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|ec|edu|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gov|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|info|int|in|io|iq|ir|is|it|je|jm|jobs|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mil|mk|ml|mm|mn|mobi|mo|mp|mq|mr|ms|mt|museum|mu|mv|mw|mx|my|mz|name|na|nc|net|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|org|pa|pe|pf|pg|ph|pk|pl|pm|pn|pro|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tel|tf|tg|th|tj|tk|tl|tm|tn|to|tp|travel|tr|tt|tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|xn--0zwm56d|xn--11b5bs3a9aj6g|xn--80akhbyknj4f|xn--9t4b11yi5a|xn--deba0ad|xn--g6w251d|xn--hgbk6aj7f53bba|xn--hlcj6aya9esc7a|xn--jxalpdlp|xn--kgbechtv|xn--zckzah|ye|yt|yu|za|zm|zw)",f="(?:"+c+n+"|"+h+")",o="(?:[;/][^#?<>\\s]*)?",e="(?:\\?[^#<>\\s]*)?(?:#[^<>\\s]*)?",d="\\b"+k+"[^<>\\s]+",a="\\b"+f+o+e+"(?!\\w)",m="mailto:",j="(?:"+m+")?[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@"+f+e+"(?!\\w)",l=new RegExp("(?:"+d+"|"+a+"|"+j+")","ig"),g=new RegExp("^"+k,"i"),b={"'":"`",">":"<",")":"(","]":"[","}":"{","B;":"B+","b�:":"b�9"},i={callback:function(q,p){return p?'<a href="'+p+'" title="'+p+'">'+q+"</a>":q},punct_regexp:/(?:[!?.,:;'"]|(?:&|&amp;)(?:lt|gt|quot|apos|raquo|laquo|rsaquo|lsaquo);)$/};return function(u,z){z=z||{};var w,v,A,p,x="",t=[],s,E,C,y,q,D,B,r;for(v in i){if(z[v]===undefined){z[v]=i[v]}}while(w=l.exec(u)){A=w[0];E=l.lastIndex;C=E-A.length;if(/[\/:]/.test(u.charAt(C-1))){continue}do{y=A;r=A.substr(-1);B=b[r];if(B){q=A.match(new RegExp("\\"+B+"(?!$)","g"));D=A.match(new RegExp("\\"+r,"g"));if((q?q.length:0)<(D?D.length:0)){A=A.substr(0,A.length-1);E--}}if(z.punct_regexp){A=A.replace(z.punct_regexp,function(F){E-=F.length;return""})}}while(A.length&&A!==y);p=A;if(!g.test(p)){p=(p.indexOf("@")!==-1?(!p.indexOf(m)?"":m):!p.indexOf("irc.")?"irc://":!p.indexOf("ftp.")?"ftp://":"http://")+p}if(s!=C){t.push([u.slice(s,C)]);s=E}t.push([A,p])}t.push([u.substr(s)]);for(v=0;v<t.length;v++){x+=z.callback.apply(window,t[v])}return x||u}})(this)
};
