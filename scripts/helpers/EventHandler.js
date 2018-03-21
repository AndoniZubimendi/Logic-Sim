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
