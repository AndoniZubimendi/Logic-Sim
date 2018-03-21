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
//
//
// Array.prototype.apply = function (fnc) {
//     for (var i = 0; i < this.length; i++) {
//         fnc(this, i);
//     }
//     return this;
// };
//
//
// // map compatibility
// if (!Array.prototype.map) {
//     Array.prototype.map = function (fun /*, thisp*/) {
//         var len = this.length;
//         if (typeof fun != "function")
//             throw new TypeError();
//
//         var res = new Array(len);
//         var thisp = arguments[1];
//         for (var i = 0; i < len; i++) {
//             if (i in this)
//                 res[i] = fun.call(thisp, this[i], i, this);
//         }
//
//         return res;
//     };
// }
//
//
// Array.prototype.find = function (fnc, start) {
//     for (var i = (start ? start : 0); i < this.length; i++) {
//         if (fnc(this[i]))
//             return this[i];
//     }
//     return null;
// };
//
function arraySameValues (o, arr) {
    if (o.length != arr.length)
        return false;
    var i = o.length;
    while (--i >= 0)
        if (o[i] != arr[i])
            return false;

    return true;
}
