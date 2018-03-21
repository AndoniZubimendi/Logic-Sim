/**
 * Created by andoni on 01/04/16.
 */

// Element
Element.prototype.clearClass = function () {
    this.className = '';
};

Element.prototype.hasClass = function (className) {
    return (' ' + this.className + ' ').indexOf(' ' + className + ' ') != -1;
};

Element.prototype.addClass = function (className) {
    if (!this.hasClass(className))
        this.className += ' ' + className + ' ';
};

Element.prototype.getParentIndex = function () {
    return Array.prototype.indexOf.call(this.parentNode.children, this);
};





// Element.prototype.appendElement = function (elementName, container, className, id) {
//     var element = document.createElement(elementName);
//     if (id)
//         element.setAttribute('id', id);
//     if (className)
//         element.addClass(className);
//     if (container)
//         container.appendChild(element);
//     return element;
// };



// Element.prototype.getId = function () {
//     var id = this.getAttribute('id');
//     if (!id) {
//         if (!window.automaticId)
//             window.automaticId = 0;
//         id = 'automaticId_' + window.automaticId++;
//         this.setAttribute('id', id);
//     }
//     return id;
// };

// Element.prototype.removeClass = function (className) {
//     if (this.hasClass(className))
//         this.className = this.className.replace(new RegExp('(\\s|^)' + className + '(\\s|$)'), '');
// };


// Element.prototype.position = function () {
//     var elem = this;
//     var p = {x: elem.offsetLeft || 0, y: elem.offsetTop || 0};
//     while (elem = elem.offsetParent) {
//         p.x += elem.offsetLeft;
//         p.y += elem.offsetTop;
//     }
//     return p;
// };
