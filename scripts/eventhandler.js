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
    }
}
