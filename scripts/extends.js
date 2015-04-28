// IE 11 doesn't support Math.log2
if (!Math.log2)
	Math.log2 = function (value){
		return Math.log(value) / Math.log(2);
	};
	
// IE 9 no longer support name property
Function.prototype.getName = function() {
  var ret = this.toString().substr('function '.length);
  return ret.substr(0, ret.indexOf('('));
};

// Safari 5 doesn't support setLineDash
if (CanvasRenderingContext2D && !CanvasRenderingContext2D.prototype.setLineDash)
	CanvasRenderingContext2D.prototype.setLineDash = function (){};


var $Find=function(element){
	if (element.isElement())
		return element;
	return document.getElementById(element);
};

Document.prototype.generateId = function(prefix){
	if (!prefix)
		prefix = 'automaticId';
	if (!window.generatedId)
		window.generatedId = [];
	if (!window.generatedId[prefix])
		window.generatedId[prefix] = 0;
	return prefix + '_' + window.generatedId[prefix]++;
};

//Returns true if it is a DOM element    
Object.prototype.isElement = function(){
  var  ok = typeof HTMLElement === "object" ? this instanceof HTMLElement : //DOM2
    (typeof this === "object" && this !== null && this.nodeType && this.nodeType === 1 && typeof this.nodeName==="string");
  return ok;
};

Array.prototype.contains = function(obj)
{
    var i = this.length;
    while (--i >= 0)
        if (this[i] === obj)
            return true;
			
    return false;
};

Array.prototype.pushMany = function(arr)
{
    for (var i = 0; i < arr.length; ++i) {
    	this.push(arr[i]);
    }
};

Array.prototype.containsEqual = function(obj)
{
    var i = this.length;
    while (--i >= 0)
        if (this[i].equals(obj))
            return true;
			
    return false;
};

Array.prototype.apply = function(fnc)
{
    for (var i = 0; i < this.length; i++) {
		fnc(this, i);   
	}
	return this;
};


// map compatibility
if (!Array.prototype.map)
{
  Array.prototype.map = function(fun /*, thisp*/)
  {
    var len = this.length;
    if (typeof fun != "function")
      throw new TypeError();

    var res = new Array(len);
    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in this)
        res[i] = fun.call(thisp, this[i], i, this);
    }

    return res;
  };
}


Array.prototype.find = function(fnc, start)
{
    for (var i = (start ? start :0); i < this.length; i++) {
		if ( fnc(this[i]) )
			return this[i];
	}
	return null;
};

Array.prototype.sameValues = function(arr)
{
	if (this.length != arr.length)
		return false;
    var i = this.length;
    while (--i >= 0)
        if (this[i] != arr[i])
            return false;
			
    return true;
};

// Element 
Element.prototype.clearClass = function () {
	this.className='';
};

Element.prototype.hasClass = function (className) {
	return (' '+this.className+' ').indexOf(' '+className+' ') != -1;
};
 
Element.prototype.addClass = function(className) {
	if (!this.hasClass(className)) 
		this.className+= ' '+className+' ';
};
 
Element.prototype.removeClass = function (className) {
	if (this.hasClass(className)) 
		this.className=this.className.replace(new RegExp('(\\s|^)'+className+'(\\s|$)'),'');
};

Element.prototype.position = function () {
	var elem = this;
	var p = {x: elem.offsetLeft || 0, y:elem.offsetTop || 0};
	while (elem = elem.offsetParent) {
		p.x += elem.offsetLeft;
		p.y += elem.offsetTop;
	}
	return p;
};

Element.prototype.getId = function(){
	var id = this.getAttribute('id');
	if (!id) {
		if (!window.automaticId)
			window.automaticId = 0;
		id = 'automaticId_'+ window.automaticId++;
		this.setAttribute('id', id);
	}
	return id;
};


Element.prototype.getParentIndex = function() {
  return Array.prototype.indexOf.call(this.parentNode.children, this);
};

Element.prototype.appendElement = function(elementName, container, className, id){
	var element = document.createElement(elementName);	
	if (id)
		element.setAttribute('id', id);
	if (className)
		element.addClass(className);
	if (container)
		container.appendChild(element);
	return element;
};

function Rect(x, y, width, height)
{
	this.x = x;
	this.y = y;
	
	this.width = width;
	this.height = height;
	
	this.left = x;
	this.top = y;
	this.right = x + width;
	this.bottom = y + height;

	this.setLeft = function(value)
	{
		this.left = value;
		this.x = value;
		this.width = this.right - value;
	};

	this.setTop = function(value)
	{
		this.top = value;
		this.y = value;
		this.height = this.bottom - value;
	};

	this.setRight = function(value)
	{
		this.right = value;
		this.width = value - this.left;
	};

	this.setBottom = function(value)
	{
		this.bottom = value;
		this.height = value - this.top;
	};
	
	this.intersects = function(rect)
	{
		return this.left < rect.right && rect.left < this.right
			&& this.top < rect.bottom && rect.top < this.bottom;
	};

	this.intersectsWire = function(wire, ends)
	{
		if (ends) {
			return wire.start.x <= this.right && wire.end.x >= this.left
                && wire.start.y <= this.bottom && wire.end.y >= this.top;
		}

		if (wire.isHorizontal()) {
			return wire.start.x < this.right && wire.end.x > this.left
                && wire.start.y <= this.bottom && wire.end.y >= this.top;
		} else {
			return wire.start.x <= this.right && wire.end.x >= this.left
                && wire.start.y < this.bottom && wire.end.y > this.top;
		}
	};
	
	this.contains = function(pos)
	{
		return pos.x >= this.left && pos.x <= this.right
			&& pos.y >= this.top && pos.y <= this.bottom;
	};
	
	this.clone = function(){
		return new Rect(this.left, this.top, this.width, this.height);
	};
	
	this.unionPt = function(x,y){
		if (x < this.left) 
			this.setLeft(x);
		else
			if (x > this.right) 
				this.setRight(x);			
		if (y < this.top) 
			this.setTop(y);
		else
			if (y > this.bottom) 
				this.setBottom(y)	
	};
	
	this.union = function (pr){
		this.unionPt(pr.x, pr.y);
		if (pr.right != undefined)
			this.unionPt(pr.right, pr.bottom);	
	};
	
	this.shiftBy = function(dx, dy){
		this.x+= dx;
		this.y+= dy;
		this.left= this.x;
		this.top = this.y;
		this.right = this.left+this.width;
		this.bottom= this.top +this.height;
	};
}

function Pos(x, y)
{
	this.x = x;
	this.y = y;
	
	this.add = function(pos)
	{
		return new Pos(this.x + pos.x, this.y + pos.y);
	};
	
	this.sub = function(pos)
	{
		return new Pos(this.x - pos.x, this.y - pos.y);
	};
	
	this.equals = function(pos)
	{
		return this.x == pos.x && this.y == pos.y;
	};
	
	this.toString = function()
	{
		return "(" + this.x + "," + this.y + ")";
	};
}

function clearDocumentSelection(){
	if (!this.clearSelection) {
		if (window.getSelection) {
			if (window.getSelection().empty) {  // Chrome
				this.clearSelection = function () { 
					window.getSelection().empty(); 
				};
			} else if (window.getSelection().removeAllRanges) {  // Firefox
				this.clearSelection = function () {
					window.getSelection().removeAllRanges();
				};
			} else if (document.selection) {  // IE?
				this.clearSelection = function(){ 
					document.selection.empty();
				};
			}
		}
	}
	this.clearSelection();
}

