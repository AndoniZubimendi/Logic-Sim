'use strict';

class Wire {
    constructor(start, end) {
        this.myStartConns = [];
        this.myEndConns = [];

        this.group = null;

        this.start = new Pos(start.x, start.y);
        this.end = new Pos(end.x, end.y);

        this.selected = false;

        if (this.start.x > this.end.x || this.start.y > this.end.y) {
            const temp = this.start;
            this.start = this.end;
            this.end = temp;
        }

    }

    clone() {
        return new Wire(this.start, this.end);
    }

    equals(wire) {
        return wire.start.equals(this.start)
            && wire.end.equals(this.end);
    }

    render(context, offset, selectClr) {
        if (this.selected) {
            if (selectClr == null) selectClr = "#6666FF";

            context.globalAlpha = 0.5;
            context.fillStyle = selectClr;
            context.fillRect(this.start.x + offset.x - 4, this.start.y + offset.y - 4,
                this.end.x - this.start.x + 8, this.end.y - this.start.y + 8);
            context.globalAlpha = 1.0;
        }

        context.strokeStyle = "#000000";
        context.lineWidth = 2;

        context.beginPath();
        context.moveTo(this.start.x + offset.x, this.start.y + offset.y);
        context.lineTo(this.end.x + offset.x, this.end.y + offset.y);
        context.stroke();
        context.closePath();

        context.fillStyle = "#000000";

        if (this.myStartConns.length > 1) {
            context.beginPath();
            context.arc(this.start.x + offset.x, this.start.y + offset.y, 3, 0, Math.PI * 2, true);
            context.fill();
            context.closePath();
        }

        if (this.myEndConns.length > 1) {
            context.beginPath();
            context.arc(this.end.x + offset.x, this.end.y + offset.y, 3, 0, Math.PI * 2, true);
            context.fill();
            context.closePath();
        }
    }

    getConnections() {
        return this.myStartConns.concat(this.myEndConns);
    }

    isHorizontal() {
        return this.start.y === this.end.y;
    }

    isVertical() {
        return this.start.x === this.end.x;
    }

    runsAlong(wire) {
        return (this.isHorizontal() && wire.isHorizontal()
            && this.start.y === wire.start.y && this.start.x <= wire.end.x
            && this.end.x >= wire.start.x)
            || (this.isVertical() && wire.isVertical()
                && this.start.x === wire.start.x && this.start.y <= wire.end.y
                && this.end.y >= wire.start.y);
    }

    split(wire) {
        if (this.isHorizontal()) {
            if (wire.start.x === this.start.x || wire.start.x == this.end.x) {
                return [];
            }

            var splat = new Wire(new Pos(wire.start.x, this.start.y), this.end);
            splat.group = this.group;
            splat.selected = this.selected;
            this.end = new Pos(wire.start.x, this.start.y);

            return [splat];
        } else {
            if (wire.start.y == this.start.y || wire.start.y == this.end.y) {
                return [];
            }

            splat = new Wire(new Pos(this.start.x, wire.start.y), this.end);
            splat.group = this.group;
            splat.selected = this.selected;
            this.end = new Pos(this.start.x, wire.start.y);

            return [splat];
        }
    }

    merge(wire) {
        this.selected = this.selected || wire.selected;

        if (this.isHorizontal()) {
            this.start.x = Math.min(this.start.x, wire.start.x);
            this.end.x = Math.max(this.end.x, wire.end.x);
        } else {
            this.start.y = Math.min(this.start.y, wire.start.y);
            this.end.y = Math.max(this.end.y, wire.end.y);
        }
    }

    crossesPos(pos) {
        return (this.isHorizontal() && this.start.y == pos.y
            && this.start.x <= pos.x && this.end.x >= pos.x)
            || (this.isVertical() && this.start.x == pos.x
                && this.start.y <= pos.y && this.end.y >= pos.y);
    }

    intersects(wire) {
        return this.start.x <= wire.end.x && this.end.x >= wire.start.x &&
            this.start.y <= wire.end.y && this.end.y >= wire.start.y;
    }

    crosses(wire) {
        return this.start.x < wire.end.x && this.end.x > wire.start.x &&
            this.start.y < wire.end.y && this.end.y > wire.start.y;
    }

    crossPos(wire) {
        if (this.isVertical() && wire.isHorizontal()) {
            return new Pos(this.start.x, wire.start.y);
        } else {
            return new Pos(wire.start.x, this.start.y);
        }
    }

    canConnect(wire) {
        return !arrayContains(this.myStartConns, wire) && !arrayContains(this.myEndConns, wire)
            && this.intersects(wire) && !this.crosses(wire);
    }

    hasConnection(pos) {
        if (pos.equals(this.start)) {
            return this.myStartConns.length > 0;
        }

        if (pos.equals(this.end)) {
            return this.myEndConns.length > 0;
        }

        return false;
    }

    connect(wire) {
        if (wire === this)
            return;

        let conns = this.myStartConns;

        if (this.end.equals(wire.start) || this.end.equals(wire.end)) {
            conns = this.myEndConns;
        }

        if (!arrayContains(conns, wire)) {
            conns.push(wire);
        }
    }

    disconnect(wire) {
        const index = myConnections.indexOf(wire);
        myConnections.splice(index, 1);
    }

    toString() {
        return "(" + this.start.x + "," + this.start.y + ":" + this.end.x + "," + this.end.y + ")";
    }

    shiftBy(dx, dy) {
        this.start.x += dx;
        this.start.y += dy;
        this.end.x += dx;
        this.end.y += dy;
    }
}

