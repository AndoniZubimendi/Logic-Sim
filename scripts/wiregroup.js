'use strict';

class WireGroup {
    constructor() {
        this.myWires = [];
        this.myBounds = null;

        this.input = null;
        this.outputs = [];

        this.isEmpty = false;
    }

    getWires() {
        return this.myWires;
    }

    canAddWire(wire) {
        if (this.myBounds == null || !this.myBounds.intersectsWire(wire, true)) return false;

        for (let i = 0; i < this.myWires.length; ++i) {
            if (this.myWires[i].canConnect(wire)) {
                return true;
            }
        }

        return false;
    }

    crossesPos(pos) {
        if (this.myBounds == null || !arrayContains(this.myBounds,pos)) return false;

        for (let i = 0; i < this.myWires.length; ++i) {
            if (this.myWires[i].crossesPos(pos)) {
                return true;
            }
        }

        return false;
    }

    getWireAt(pos) {
        if (this.myBounds == null || !arrayContains(this.myBounds,pos)) return null;

        for (let i = 0; i < this.myWires.length; ++i) {
            if (this.myWires[i].crossesPos(pos)) return this.myWires[i];
        }
        return null;
    }

    setInput(gate, output) {
        this.input = new Link(gate, output);

        for (const link of this.outputs) {
            link.gate.linkInput(this.input.gate, this.input.socket, link.socket);
        }
    }

    removeInput() {
        this.input = null;

        const wires = this.myWires;
        this.myWires = [];

        for (const link of this.outputs) {
            logicSim.removeGate(link.gate);
            logicSim.placeGate(link.gate);
        }

        this.myWires = wires;
    }

    addOutput(gate, input) {
        const link = new Link(gate, input);

        if (arrayContains(this.outputs,link)) return;

        if (this.input != null) {
            gate.linkInput(this.input.gate, this.input.socket, link.socket);
        }

        this.outputs.push(link);
    }

    removeOutput(link) {
        logicSim.removeGate(link.gate);
        logicSim.placeGate(link.gate);
    }

    removeAllOutputs() {
        const wires = this.myWires;
        this.myWires = [];

        for (let i = this.outputs.length - 1; i >= 0; --i) {
            this.removeOutput(this.outputs[i]);
        }

        this.myWires = wires;
    }

    addWire(wire) {
        if (wire.group == this) return;

        if (this.myBounds == null) {
            this.myBounds = new Rect(wire.start.x, wire.start.y,
                wire.end.x - wire.start.x, wire.end.y - wire.start.y);
        } else {
            this.myBounds.union(wire.start);
            this.myBounds.union(wire.end);
        }

        wire.group = this;

        this.myWires.push(wire);
    }

    shiftBy(dx, dy) {
        for (let i = 0; i < this.myWires.length; ++i) {
            this.myWires[i].shiftBy(dx,dy);
        }
        if (this.myBounds){
            this.myBounds.shiftBy(dx, dy);
        }
    }

    render(context, offset, selectClr) {
        for (let i = 0; i < this.myWires.length; ++i) {
            this.myWires[i].render(context, offset, selectClr);
        }
    }
}

