/**
 * Created by andoni on 01/04/16.
 */

//Returns true if it is a DOM element
Object.prototype.isElement = function () {
    var ok = typeof HTMLElement === "object" ? this instanceof HTMLElement : //DOM2
        (typeof this === "object" && this !== null && this.nodeType && this.nodeType === 1 && typeof this.nodeName === "string");
    return ok;
};

