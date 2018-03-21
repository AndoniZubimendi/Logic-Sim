function Rect(x, y, width, height) {
    this.x = x;
    this.y = y;

    this.width = width;
    this.height = height;

    this.left = x;
    this.top = y;
    this.right = x + width;
    this.bottom = y + height;

    this.setLeft = function (value) {
        this.left = value;
        this.x = value;
        this.width = this.right - value;
    };

    this.setTop = function (value) {
        this.top = value;
        this.y = value;
        this.height = this.bottom - value;
    };

    this.setRight = function (value) {
        this.right = value;
        this.width = value - this.left;
    };

    this.setBottom = function (value) {
        this.bottom = value;
        this.height = value - this.top;
    };

    this.intersects = function (rect) {
        return this.left < rect.right && rect.left < this.right
            && this.top < rect.bottom && rect.top < this.bottom;
    };

    this.intersectsWire = function (wire, ends) {
        if (ends) {
            return wire.start.x <= this.right && wire.end.x >= this.left
                && wire.start.y <= this.bottom && wire.end.y >= this.top;
        }

        if (wire.isHorizontal()) {
            return wire.start.x < this.right && wire.end.x > this.left
                && wire.start.y <= this.bottom && wire.end.y >= this.top;
        } else {
            return wire.start.x <= this.right && wire.end.x >= this.left
                && wire.start.y < this.bottom && wire.end.y > this.top;
        }
    };

    this.contains = function (pos) {
        return pos.x >= this.left && pos.x <= this.right
            && pos.y >= this.top && pos.y <= this.bottom;
    };

    this.clone = function () {
        return new Rect(this.left, this.top, this.width, this.height);
    };

    this.unionPt = function (x, y) {
        if (x < this.left)
            this.setLeft(x);
        else if (x > this.right)
            this.setRight(x);
        if (y < this.top)
            this.setTop(y);
        else if (y > this.bottom)
            this.setBottom(y)
    };

    this.union = function (pr) {
        this.unionPt(pr.x, pr.y);
        if (pr.right !== undefined)
            this.unionPt(pr.right, pr.bottom);
    };

    this.shiftBy = function (dx, dy) {
        this.x += dx;
        this.y += dy;
        this.left = this.x;
        this.top = this.y;
        this.right = this.left + this.width;
        this.bottom = this.top + this.height;
    };
}