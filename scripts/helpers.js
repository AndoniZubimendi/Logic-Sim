var EventHandler = {
    add:function(el, ev, fn){
		if (el.addEventListener) {
			EventHandler.add = function (el, ev, fn) {
				el.addEventListener(ev, fn, false);
			};
		} else if (el.attachEvent) {
			EventHandler.add = function (el, ev, fn) {
				el.attachEvent('on' + ev, fn);
			};
		} else {
			EventHandler.add = function (el, ev, fn) {
				el['on' + ev] =  fn;
			};
		}
		EventHandler.add(el, ev, fn);
	},
 
    remove:function(el, ev, fn){
        if(el.removeEventListener){
			EventHandler.remove = function (el, ev, fn) {
				el.removeEventListener(ev, fn, false);
			}
        } else if(el.detachEvent) {
            EventHandler.remove = function (el, ev, fn) {
				el.detachEvent('on' + ev, fn);
			}
        } else {
            EventHandler.remove = function (el, ev, fn) { 
				elem['on' + ev] = null;
			}
		}
		EventHandler.remove(el, ev, fn);
    },
 
    stop:function(ev) {
        var e = ev || window.event;
        e.cancelBubble = true;
        if (e.stopPropagation) e.stopPropagation();
    },
	
	preventDefault:function(ev) {
		var e = ev || window.event;
		if (e.preventDefault) { 
			e.preventDefault();
		} else {
			e.returnValue = false; 
		}	
	},
	
	calcOffset: function (ev) {
		if(!ev.offsetX){		 
			var el = ev.target;
			var offset = {x:0,y:0};
			 
			while(el.offsetParent){
				offset.x+=el.offsetLeft;
				offset.y+=el.offsetTop;
				el = el.offsetParent;
			}
			ev.offsetX = ev.pageX - offset.x;
			ev.offsetY = ev.pageY - offset.y;
		}
		return ev;
	},
	
	fixMouseButtons: function (ev){
		if (!ev.which && ev.button) {
			if (ev.button & 1) 
				ev.which = 1;  // Left Btn
			else if (ev.button & 4) 
				ev.which = 2; // Middle Btn
			else if (ev.button & 2)
				ev.which = 3; // Right Btn
		}
		return ev;
	},
	
	fixMouse: function (ev){
		return this.fixMouseButtons(this.calcOffset(ev));
	}
	
};

// CSS Sheets
var Sheet = function() {
	// Create the <style> tag
	this.style = document.createElement("style");

	// Add a media (and/or media query) here if you'd like!
	this.style.setAttribute("media", "screen");
	// style.setAttribute("media", "only screen and (max-width : 1024px)")

	// WebKit hack :(
	this.style.appendChild(document.createTextNode(""));

	// Add the <style> element to the page
	document.head.appendChild(this.style);

	return this;
};

Sheet.prototype.addRule = function(selector, rules, index){
	var sheet = this.style.sheet;
	if (!index) 
		index = 0;
	if("insertRule" in sheet) {
		sheet.insertRule(selector + "{" + rules + "}", index);
	}
	else if("addRule" in sheet) {
		sheet.addRule(selector, rules, index);
	}
};


var BitHelper = {};

BitHelper.arrayToBits = function ( boolArray, first, count )
{
	first = first | 0;
	count  = count  | boolArray.length;

	for (var i=first, msk=1, bits=0; i < first+count; i++, msk = msk << 1)
		if (boolArray[i])
			bits = bits | msk;
	return bits;
};

BitHelper.bitsToArray = function ( bits, count )
{
	var boolArray = [];
	for (var i=0, msk=1; i < count; i++, msk = msk << 1)
		boolArray[i] = (bits & msk) ? 1 : 0;
	return boolArray;
};



// Table
function Table(rows, cols) {
	if (rows && cols){
		this.setDimension(rows,cols);
	}else{
		this.header = [];
		this.rows = [];
	}
	return this;
}

Table.prototype.setDimension=function(rows, cols){
	if (!cols) 
		cols=0;
	this.header	= [];
	this.rows 	= [];
	for (var i=0; i<rows; i++)
		this.rows[i] = new Array(cols);
	for (i=0; i<cols; i++)
		this.header[i] 	= '';
};

Table.prototype.setRow=function(rowId, cols){
	this.rows[rowId] = cols;
};

Table.prototype.setHeader=function(cols){
	this.header = cols;
};

Table.prototype.create = function(container, id, className, cellClick, headerClick)
{
    var table = this.appendElement('TABLE', container, className, id);
	
	var thead = this.appendElement('THEAD', table);
	var tr = this.appendElement('TR', thead); 
	var inCount = Math.log2(this.rows.length);
	for (var j=0; j<this.header.length; j++){
		   var cnt = this.header[j] ? this.header[j] : '';
           var th = this.appendElement('TH', tr);
		   	if (headerClick)
				EventHandler.add(th,'click', headerClick);
		   th.addClass( j<inCount ? 'In' : 'Out' );
		   th.appendChild(document.createTextNode(cnt));
    }
	
    var tableBody = this.appendElement('TBODY', table);
    for (var i=0; i<this.rows.length; i++){
		tr = this.appendElement('TR', tableBody);
		if (i & 1)
			tr.addClass('Alt');
		for (j=0; j<this.rows[i].length; j++){
			cnt = this.rows[i][j] != undefined ? this.rows[i][j] : '';
			var td = this.appendElement('TD', tr);
			if (cellClick)
				EventHandler.add(td,'click', cellClick);
			td.addClass( j<inCount ? 'In' : 'Out' );
			td.appendChild(document.createTextNode(cnt));
       }
    }
	return table;
};

Table.prototype.appendElement = function(element, container, className, id){
	element = document.createElement(element);	
	if (id)
		element.setAttribute('id', id);
	if (className)
		element.addClass(className);
	if (container)
		container.appendChild(element);
	return element;
};








// Color
var Color  = {};

Color.parse =  function (input) {
    var m = input.match(/^#([0-9a-f]{3})$/i);
    if (m) 
        return [ parseInt(m.charAt(0),16)*0x11, parseInt(m.charAt(1),16)*0x11, parseInt(m.charAt(2),16)*0x11, 1];
    
    m = input.match(/^#([0-9a-f]{6})$/i);
    if (m) 
        return [ parseInt(m.substr(0,2),16), parseInt(m.substr(2,2),16), parseInt(m.substr(4,2),16), 1 ];
    
    m = input.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
    if (m) 
        return [m[1], m[2], m[3], 1];
    
    return ({
		"transparent": [0,0,0,0], "aliceblue": [240,248,255,1], "antiquewhite": [250,235,215,1], "aqua": [0,255,255,1], "aquamarine": [127,255,212,1], 
		"azure": [240,255,255,1], "beige": [245,245,220,1], "bisque": [255,228,196,1], "black": [0,0,0,1], "blanchedalmond": [255,235,205,1], 
		"blue": [0,0,255,1], "blueviolet": [138,43,226,1], "brown": [165,42,42,1], "burlywood": [222,184,135,1], "cadetblue": [95,158,160,1], 
		"chartreuse": [127,255,0,1], "chocolate": [210,105,30,1], "coral": [255,127,80,1], "cornflowerblue": [100,149,237,1], "cornsilk": [255,248,220,1], "crimson": [220,20,60,1], "cyan": [0,255,255,1], "darkblue": [0,0,139,1], "darkcyan": [0,139,139,1], "darkgoldenrod": [184,134,11,1], 
		"darkgray": [169,169,169,1], "darkgreen": [0,100,0,1], "darkgrey": [169,169,169,1], "darkkhaki": [189,183,107,1], "darkmagenta": [139,0,139,1], "darkolivegreen": [85,107,47,1], "darkorange": [255,140,0,1], "darkorchid": [153,50,204,1], "darkred": [139,0,0,1], "darksalmon": [233,150,122,1], "darkseagreen": [143,188,143,1], "darkslateblue": [72,61,139,1], "darkslategray": [47,79,79,1], "darkslategrey": [47,79,79,1], 
		"darkturquoise": [0,206,209,1], "darkviolet": [148,0,211,1], "deeppink": [255,20,147,1], "deepskyblue": [0,191,255,1], "dimgray": [105,105,105,1], "dimgrey": [105,105,105,1], "dodgerblue": [30,144,255,1], "firebrick": [178,34,34,1], "floralwhite": [255,250,240,1], "forestgreen": [34,139,34,1], "fuchsia": [255,0,255,1], "gainsboro": [220,220,220,1], "ghostwhite": [248,248,255,1], "gold": [255,215,0,1], "goldenrod": [218,165,32,1], 
		"gray": [128,128,128,1], "green": [0,128,0,1], "greenyellow": [173,255,47,1], "grey": [128,128,128,1], "honeydew": [240,255,240,1], "hotpink": [255,105,180,1], "indianred": [205,92,92,1], "indigo": [75,0,130,1], "ivory": [255,255,240,1], "khaki": [240,230,140,1], "lavender": [230,230,250,1], "lavenderblush": [255,240,245,1], "lawngreen": [124,252,0,1], "lemonchiffon": [255,250,205,1], "lightblue": [173,216,230,1], 
		"lightcoral": [240,128,128,1], "lightcyan": [224,255,255,1], "lightgoldenrodyellow": [250,250,210,1], "lightgray": [211,211,211,1], 
		"lightgreen": [144,238,144,1], "lightgrey": [211,211,211,1], "lightpink": [255,182,193,1], "lightsalmon": [255,160,122,1], 
		"lightseagreen": [32,178,170,1], "lightskyblue": [135,206,250,1], "lightslategray": [119,136,153,1], "lightslategrey": [119,136,153,1], "lightsteelblue": [176,196,222,1], "lightyellow": [255,255,224,1], "lime": [0,255,0,1], "limegreen": [50,205,50,1], "linen": [250,240,230,1], "magenta": [255,0,255,1], "maroon": [128,0,0,1], "mediumaquamarine": [102,205,170,1], "mediumblue": [0,0,205,1], "mediumorchid": [186,85,211,1], "mediumpurple": [147,112,219,1], "mediumseagreen": [60,179,113,1], "mediumslateblue": [123,104,238,1], "mediumspringgreen": [0,250,154,1], "mediumturquoise": [72,209,204,1], "mediumvioletred": [199,21,133,1], "midnightblue": [25,25,112,1], "mintcream": [245,255,250,1], 
		"mistyrose": [255,228,225,1], "moccasin": [255,228,181,1], "navajowhite": [255,222,173,1], "navy": [0,0,128,1], "oldlace": [253,245,230,1], 
		"olive": [128,128,0,1], "olivedrab": [107,142,35,1], "orange": [255,165,0,1], "orangered": [255,69,0,1], "orchid": [218,112,214,1], 
		"palegoldenrod": [238,232,170,1], "palegreen": [152,251,152,1], "paleturquoise": [175,238,238,1], "palevioletred": [219,112,147,1], 
		"papayawhip": [255,239,213,1], "peachpuff": [255,218,185,1], "peru": [205,133,63,1], "pink": [255,192,203,1], "plum": [221,160,221,1], 
		"powderblue": [176,224,230,1], "purple": [128,0,128,1], "red": [255,0,0,1], "rosybrown": [188,143,143,1], "royalblue": [65,105,225,1], 
		"saddlebrown": [139,69,19,1], "salmon": [250,128,114,1], "sandybrown": [244,164,96,1], "seagreen": [46,139,87,1], "seashell": [255,245,238,1], "sienna": [160,82,45,1], "silver": [192,192,192,1], "skyblue": [135,206,235,1], "slateblue": [106,90,205,1], "slategray": [112,128,144,1], 
		"slategrey": [112,128,144,1], "snow": [255,250,250,1], "springgreen": [0,255,127,1], "steelblue": [70,130,180,1], "tan": [210,180,140,1], 
		"teal": [0,128,128,1], "thistle": [216,191,216,1], "tomato": [255,99,71,1], "turquoise": [64,224,208,1], "violet": [238,130,238,1], 
		"wheat": [245,222,179,1], "white": [255,255,255,1], "whitesmoke": [245,245,245,1], "yellow": [255,255,0,1], "yellowgreen": [154,205,50,1]
    })[input];
	
};


// Simple animation effects 
var Effect = {
	duration : 2000,
	delay	 : 25
};


Effect.animate = function(opts) {
	var start = new Date;   
	var id = setInterval(function() {
				var timePassed = new Date - start;
				var progress = timePassed / opts.duration;
				if (progress > 1) 
					progress = 1;
    
				var delta = opts.delta(progress);
				opts.step(delta);
				
				if (progress == 1) 
				  clearInterval(id);
				
			}, opts.delay || this.delay);
  
};

Effect.highlight = function (elem , fromColor, toColor, effDuration, effDelay) {
	if (elem.hasAttribute('HL')) return;
	elem.setAttribute('HL', toColor || elem.style.backgroundColor);
	var from = Color.parse(fromColor), to = Color.parse(toColor || elem.style.backgroundColor || 'transparent');

	this.animate({ delay: effDelay || this.delay,
		duration: effDuration || this.duration,
		delta: function(progress){return progress;},
		step: function(delta) {
			elem.style.backgroundColor = 'rgba(' +
			Math.max(Math.min(parseInt((delta * (to[0]-from[0])) + from[0], 10), 255), 0) + ',' +
			Math.max(Math.min(parseInt((delta * (to[1]-from[1])) + from[1], 10), 255), 0) + ',' +
			Math.max(Math.min(parseInt((delta * (to[2]-from[2])) + from[2], 10), 255), 0) + ',' +
			(delta * (to[3]-from[3]) + from[3])+ ')';
			if (delta==1 && !toColor){
				elem.style.backgroundColor =elem.getAttribute('HL');
				elem.removeAttribute('HL');
			}
		}
	}); 
};



var images = {};
images.myToLoadCount = 0;
images.onAllLoaded = function() {};

images.onImageLoad = function()
{	
	--images.myToLoadCount;
	
	if(images.myToLoadCount == 0)
		images.onAllLoaded();
};

images.load = function(path)
{
	++images.myToLoadCount;
	var img = new Image();
	img.src = "images/" + path;
	
	img.onload = images.onImageLoad;
	
	images[path.substring(0, path.length - 4)] = img;
	return img;
};


images.allImagesLoaded = function()
{
	return (images.myToLoadCount == 0);
};

images.load("and.png");
images.load("arrdown.png");
images.load("arrup.png");
images.load("btnsmallleft.png");
images.load("btnsmallleftover.png");
images.load("btnsmallmid.png");
images.load("btnsmallmidover.png");
images.load("btnsmallright.png");
images.load("btnsmallrightover.png");
images.load("buffer.png");
images.load("center.png");
images.load("clock.png");
images.load("constoff.png");
images.load("conston.png");
images.load("decoder.png");
images.load("delete.png");
images.load("delic.png");
images.load("dflipflop.png");
images.load("encoder.png");
images.load("grid.png");
images.load("grip.png");
images.load("input.png");
images.load("label.png");
images.load("move.png");
images.load("menuarrow.png");
images.load("nand.png");
images.load("newfile.png");
images.load("newic.png");
images.load("nor.png");
images.load("not.png");
images.load("open.png");
images.load("or.png");
images.load("outoff.png");
images.load("outon.png");
images.load("output.png");
images.load("pushswitchaclosed.png");
images.load("pushswitchaopen.png");
images.load("pushswitchbclosed.png");
images.load("pushswitchbopen.png");
images.load("save.png");
images.load("select.png");
images.load("sepend.png");
images.load("sepmid.png");
images.load("sevsega.png");
images.load("sevsegb.png");
images.load("sevsegbase.png");
images.load("sevsegc.png");
images.load("sevsegd.png");
images.load("sevsegdecoder.png");
images.load("sevsegdp.png");
images.load("sevsege.png");
images.load("sevsegf.png");
images.load("sevsegg.png");
images.load("switchclosed.png");
images.load("switchopen.png");
images.load("xnor.png");
images.load("xor.png");
