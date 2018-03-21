function Pos(x, y) {
    this.x = x;
    this.y = y;

    this.add = function (pos) {
        return new Pos(this.x + pos.x, this.y + pos.y);
    };

    this.sub = function (pos) {
        return new Pos(this.x - pos.x, this.y - pos.y);
    };

    this.equals = function (pos) {
        return this.x === pos.x && this.y === pos.y;
    };

    this.toString = function () {
        return "(" + this.x + "," + this.y + ")";
    };
}
