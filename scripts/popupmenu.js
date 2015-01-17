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

MenuStyle ={
	menu: 'box-shadow: 1px 1px 6px #000; background: #FFF; border:1px solid #CCC; padding:2px; font: 14px Segoe UI,Helvetica,Garuda,Arial,sans-serif;',
	separator	: '1px outset #CCC', 	
	itemNormal	: 'padding:0px 20px; color:#000; background: #FFF; border:1px solid #FFF',
	itemHighlight:'padding:0px 20px; background: #EEF; border:1px solid #AAD; border-radius:2px'
}

var PopupMenu = function() {
    this.init();
}
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
            with (this.element.style) {
                if (self.width)  width  = self.width  + 'px';
                if (self.height) height = self.height + 'px';
            }
        }
    },
 
    add: function(text, callback) {
        this.items.push({ text: text, callback: callback });
    },
    addSeparator: function() {
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
        if (this.element) this.element.style.display = 'none';
    },
    createMenu: function(items) {
        var self = this;
        var menu = document.createElement('div');
		menu.setAttribute('style', MenuStyle.menu)
        with (menu.style) {
            if (self.width)  width  = self.width  + 'px';
            if (self.height) height = self.height + 'px';
            position   = 'absolute';
            display    = 'block';
        }
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
			if (tgt.parentNode != menu) 
				self.hide.call(self);  
		};
        EventHandler.add(document, 'mousedown', listener, true);
		EventHandler.add(menu, 'contextmenu', function (ev) { EventHandler.preventDefault(ev); } );

        return menu;
    },
	
    createItem: function(item) {
        var self = this;
        var elem = document.createElement('div');
        elem.setAttribute('style', MenuStyle.itemNormal);
        var callback = item.callback;
        EventHandler.add(elem, 'click', function(_callback) {
            return function() {
                self.hide();
                _callback(self.object); 
            };
        }(callback), true);
        EventHandler.add(elem, 'mouseover', function(e) {
            elem.setAttribute('style', MenuStyle.itemHighlight);
        }, true);
        EventHandler.add(elem, 'mouseout', function(e) {
            elem.setAttribute('style', MenuStyle.itemNormal);
        }, true);
        elem.appendChild(document.createTextNode(item.text));
		
        return elem;
    },
	
    createSeparator: function() {
        var sep = document.createElement('div');
        with (sep.style) {
            borderTop = MenuStyle.separator;
            fontSize  = '0px';
            height    = '0px';
        }
        return sep;
    }
};

