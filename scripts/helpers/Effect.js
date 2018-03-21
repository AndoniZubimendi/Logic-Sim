// Simple animation effects
var Effect = {
    duration: 2000,
    delay: 25
};


Effect.animate = function (opts) {
    var start = new Date;
    var id = setInterval(function () {
        var timePassed = new Date - start;
        var progress = timePassed / opts.duration;
        if (progress > 1)
            progress = 1;

        var delta = opts.delta(progress);
        opts.step(delta);

        if (progress === 1)
            clearInterval(id);

    }, opts.delay || this.delay);

};

Effect.highlight = function (elem, fromColor, toColor, effDuration, effDelay) {
    if (elem.hasAttribute('HL')) return;
    elem.setAttribute('HL', toColor || elem.style.backgroundColor);
    var from = Color.parse(fromColor), to = Color.parse(toColor || elem.style.backgroundColor || 'transparent');

    this.animate({
        delay: effDelay || this.delay,
        duration: effDuration || this.duration,
        delta: function (progress) {
            return progress;
        },
        step: function (delta) {
            elem.style.backgroundColor = 'rgba(' +
                Math.max(Math.min(parseInt((delta * (to[0] - from[0])) + from[0], 10), 255), 0) + ',' +
                Math.max(Math.min(parseInt((delta * (to[1] - from[1])) + from[1], 10), 255), 0) + ',' +
                Math.max(Math.min(parseInt((delta * (to[2] - from[2])) + from[2], 10), 255), 0) + ',' +
                (delta * (to[3] - from[3]) + from[3]) + ')';
            if (delta == 1 && !toColor) {
                elem.style.backgroundColor = elem.getAttribute('HL');
                elem.removeAttribute('HL');
            }
        }
    });
};
