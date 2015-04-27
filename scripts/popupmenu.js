/*
  popupmenu.js - simple JavaScript popup menu library.
	http://spiritloose.net/misc/popupmenu/
	
  Copyright (C) 2006 Jiro Nishiguchi <jiro@cpan.org> All rights reserved.
  This is free software with ABSOLUTELY NO WARRANTY.

  You can redistribute it and/or modify it under the modified BSD license.

  Some modifications were made in order to use with logicSim
  
  Usage:
    var popup = new PopupMenu();
    popup.add(menuText, function(target){ ... });
    popup.addSeparator();
    popup.bind('targetElement');
    popup.bind(); // target is document;
	
	
*/

var MenuStyle ={
	menu: 'box-shadow: 1px 1px 6px #000; background-color: #FFF; border:1px solid #CCC; padding:2px; font: 14px Segoe UI,Helvetica,Garuda,Arial,sans-serif;',
	separator	: '1px outset #CCC', 	
	itemNormal	: 'padding:0px 20px; color:#000; background-color: #FFF; border:1px solid #FFF',
	itemHighlight:'padding:0px 20px; background-color: #EEF; border:1px solid #AAD; border-radius:2px'
};

function PopupMenuCreateStyles(){
	if (!this.created){
		var s = new Sheet();
		s.addRule('div.PopupMenu', MenuStyle.menu);
		s.addRule('div.PopupItem', MenuStyle.itemNormal);
		s.addRule('div.PopupItem:hover', MenuStyle.itemHighlight);
		s.addRule('div.PopupItem.Expand', 'background: url('+images.menuarrow.src+') no-repeat 100% 50%');
		this.created = true;
	}
}

new PopupMenuCreateStyles();


var PopupMenu = function() {
    this.init();
};

PopupMenu.SEPARATOR = 'PopupMenu.SEPARATOR';
PopupMenu.current = null;


PopupMenu.prototype = {
    init: function() {
        this.items  = [];
        this.width  = 0;
        this.height = 0;
    },
    setSize: function(width, height) {
        this.width  = width;
        this.height = height;
        if (this.element) {
            var self = this;
            var style = this.element.style;
            if (self.width)  style.width  = self.width  + 'px';
            if (self.height) style.height = self.height + 'px';
        }
    },
 
    add: function(text, callback, parent) {
		var item = { text: text, callback: callback, level:0, items:[] };
		if (parent) {
			item.level = parent.level+1;
			parent.items.push(item);
		}
		else
			this.items.push(item);
		return item;
    },
    addSeparator: function(parent) {
		if (parent)
			parent.items.push(PopupMenu.SEPARATOR);
		else
			this.items.push(PopupMenu.SEPARATOR);
    },
    setPos: function(e) {
        if (!this.element) return;
        if (!e) e = window.event;
        var x, y;
        if (window.opera) {
            x = e.clientX;
            y = e.clientY;
        } else if (document.all) {
            x = document.body.scrollLeft + event.clientX;
            y = document.body.scrollTop + event.clientY;
        } else if (document.layers || document.getElementById) {
            x = e.pageX;
            y = e.pageY;
        }

        this.element.style.top  = y + 'px';
        this.element.style.left = x + 'px';
    },
    show: function(e, object) {
		// object that pops up the menu
		this.object =  (object) ? object : null;
		
        if (PopupMenu.current && PopupMenu.current != this) return;
        PopupMenu.current = this;
        if (this.element) {
            this.setPos(e);
            this.element.style.display = '';
        } else {
            this.element = this.createMenu(this.items);
            this.setPos(e);
            document.body.appendChild(this.element);
        }
    },
    hide: function() {
        PopupMenu.current = null;
		this.hideMenuLevel(0);
    },
	hideMenuLevel: function(level){
		do {
			var elems = document.getElementsByClassName('PopupLevel'+level++);
			for (var i=0; i < elems.length; i++){
				elems[i].style.display = 'none';
			}
		} while (elems.length > 0);
	},
    createMenu: function(items, level) {
		if (!level) level = 0;
        var self = this;
        var menu = document.createElement('div');
		menu.addClass('PopupMenu PopupLevel'+level);
        var style = menu.style;
        if (self.width)  style.width  = self.width  + 'px';
        if (self.height) style.height = self.height + 'px';
        style.position   = 'absolute';
        style.display    = '';
		style.zIndex 	 = 100+level;
        for (var i = 0; i < items.length; i++) {
            var item;
            if (items[i] == PopupMenu.SEPARATOR) {
                item = this.createSeparator();
            } else {
                item = this.createItem(items[i]);
            }
            menu.appendChild(item);
        }
		
		
		var listener = function(ev) { 
			if (!ev) ev = window.event;
			var tgt = ev.target ? ev.target : ev.srcElement;
			if (!tgt.hasClass('PopupItem')) 
				self.hide.call(self);  
		};
        EventHandler.add(document, 'mousedown', listener, true);
		EventHandler.add(menu, 'contextmenu', function (ev) { EventHandler.preventDefault(ev); } );

        return menu;
    },
	
    createItem: function(item) {
        var self = this;
        var elem = document.createElement('div');
		elem.addClass('PopupItem');
		if (item.callback){
			var callback = item.callback;
			EventHandler.add(elem, 'click', function(_callback) {
				return function() {
					self.hide();
					_callback(self.object); 
				};
			}(callback), true);
		}
		if (item.items.length>0){
			elem.addClass('Expand');
			var submenu = this.createMenu(item.items, item.level+1);
			submenu.style.display = 'none';
			EventHandler.add(elem, 'mouseover', function(e) {
				var pos = elem.position();
				submenu.style.left= (pos.x+elem.offsetLeft+elem.offsetWidth+3)+'px';
				submenu.style.top = (pos.y+elem.offsetLeft-3)+'px';
				self.hideMenuLevel(item.level+1);
				submenu.style.display ='';
			}, true);

            document.body.appendChild(submenu);
		} else{
			
			EventHandler.add(elem, 'mouseover', function(e) {
				self.hideMenuLevel(item.level+1);
			}, true);
		}

		elem.appendChild(document.createTextNode(item.text));
		
        return elem;
    },
	
    createSeparator: function() {
        var sep = document.createElement('div');
        var style = sep.style;
        style.borderTop = MenuStyle.separator;
        style.fontSize  = '0px';
        style.height    = '0px';
        return sep;
    }
};

