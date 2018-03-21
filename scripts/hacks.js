/**
 * Created by andoni on 01/04/16.
 */
Document.prototype.generateId = function (prefix) {
    if (!prefix)
        prefix = 'automaticId';
    if (!window.generatedId)
        window.generatedId = [];
    if (!window.generatedId[prefix])
        window.generatedId[prefix] = 0;
    return prefix + '_' + window.generatedId[prefix]++;
};

// IE 11 doesn't support Math.log2
if (!Math.log2)
    Math.log2 = function (value) {
        return Math.log(value) / Math.log(2);
    };

// IE 9 no longer support name property
if (!Function.prototype.getName) {
    Function.prototype.getName = function () {
        var ret = this.toString().substr('function '.length);
        return ret.substr(0, ret.indexOf('('));
    };
}

// Safari 5 doesn't support setLineDash
if (CanvasRenderingContext2D && !CanvasRenderingContext2D.prototype.setLineDash) {
    CanvasRenderingContext2D.prototype.setLineDash = function () {
    };
}

objectisElement = function (e) {
    return typeof HTMLElement === "object" ? e instanceof HTMLElement : //DOM2
        (typeof e === "object" && e !== null && e.nodeType && e.nodeType === 1 && typeof e.nodeName === "string");
};


var $Find = function (element) {
    if (objectisElement (element))
        return element;
    return document.getElementById(element);
};

function clearDocumentSelection() {
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
                this.clearSelection = function () {
                    document.selection.empty();
                };
            }
        }
    }
    this.clearSelection();
}


/**
 * Created by andoni on 01/04/16.
 */

function arrayContains(a, obj) {
    var i = a.length;
    while (i--) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

function arrayPushMany(a, arr) {
    for (var i = 0; i < arr.length; ++i) {
        a.push(arr[i]);
    }
}

function arraySameValues (o, arr) {
    if (o.length !== arr.length)
        return false;
    var i = o.length;
    while (--i >= 0)
        if (o[i] !== arr[i])
            return false;

    return true;
}
