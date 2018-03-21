function Environment() {
    // event notification: because of drag and drop implementation
    // some event call were moved to logicsim.js. Much refactoring
    // is needed in order to support better event notification
    this.myOnStateChanged = null;
    this.myOnChanged = null;

    this.gates = [];
    this.wireGroups = [];
}

Environment.prototype.setOnStateChanged = function (callback) {
    this.myOnStateChanged = callback;
};

Environment.prototype.stateChanged = function () {
    if (this.myOnStateChanged)
        this.myOnStateChanged(this);
};

Environment.prototype.setOnChanged = function (callback) {
    this.myOnChanged = callback;
};

Environment.prototype.changed = function () {
    if (this.myOnChanged)
        this.myOnChanged(this);
};

Environment.prototype.getSortFunction = function () {
    return function (a, b) {
        a = a.label || a.type.name;
        b = b.label || b.type.name;
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    };
};

Environment.prototype.find = function (gateType, sort) {
    let result = [];
    for (let i = 0; i < this.gates.length; i++) {
        if (this.gates[i].type.ctorname === gateType)
            result.push(this.gates[i]);
    }
    if (sort === undefined || sort)
        result.sort(this.getSortFunction());
    return result;
};

// Environment.prototype.findNot = function (gateType, sort) {
//     let result = [];
//     for (let i = 0; i < this.gates.length; i++) {
//         if (this.gates[i].type.ctorname !== gateType)
//             result.push(this.gates[i]);
//     }
//     if (sort === undefined || sort)
//         result.sort(this.getSortFunction());
//     return result;
// };

Environment.prototype.getGridSize = function () {
    return 1;
};

Environment.prototype.clear = function () {
    this.gates = [];
    this.wireGroups = [];
    this.changed();
};

Environment.prototype.save = function () {
    let obj = {gates: [], wires: []};

    for (let i = 0; i < this.gates.length; ++i) {
        let gate = this.gates[i];
        let gobj = {
            t: gate.type.ctorname,
            x: gate.x,
            y: gate.y,
            l: gate.label,
            dl: gate.displayLabel,
            o: gate.getOutputs(),
            d: gate.saveData()
        };

        if (gobj.t === "CustomIC") {
            gobj.i = logicSim.customGroup.items.indexOf(gate.type);
            gobj.e = gate.environment.save();
        }

        obj.gates.push(gobj);
    }

    for (let i = 0; i < this.wireGroups.length; ++i) {
        let wires = this.wireGroups[i].getWires();
        for (let j = 0; j < wires.length; ++j) {
            let wire = wires[j];
            obj.wires.push({
                sx: wire.start.x,
                sy: wire.start.y,
                ex: wire.end.x,
                ey: wire.end.y
            });
        }
    }
    return obj;
};

Environment.prototype.load = function (obj, ics) {
    let info;
    for (let i = 0; i < obj.gates.length; ++i) {
        info = obj.gates[i];
        let gate = null;

        if (info.t === "CustomIC") {
            gate = new Gate(ics[info.i], info.x, info.y);
            let env = new Environment();
            env.load(info.e, ics);
            gate.environment = env;
        } else {
            console.log(info);
            let ctor = window[info.t];
            console.log(ctor);
            gate = new Gate(new ctor(), info.x, info.y, info.l, info.dl);
        }

        this.placeGate(gate);
        gate.setOutputs(info.o);
        gate.loadData(info.d);
    }

    for (let i = 0; i < obj.wires.length; ++i) {
        info = obj.wires[i];
        this.placeWire(new Pos(info.sx, info.sy), new Pos(info.ex, info.ey));
    }
    this.changed();
};

Environment.prototype.clone = function () {
    let env = new Environment();

    for (let i = 0; i < this.gates.length; ++i) {
        env.placeGate(this.gates[i].clone());
    }

    let wires = this.getAllWires();
    for (let i = 0; i < wires.length; ++i) {
        env.placeWire(wires[i].start, wires[i].end);
    }

    return env;
};

var myIOSort = function (a, b) {
    if (a.y < b.y) return -1;
    if (a.y === b.y) return a.x < b.x ? -1 : a.x === b.x ? 0 : 1;
    return 1;
};

Environment.prototype.getInputs = function () {
    let inputs = [];
    for (let i = 0; i < this.gates.length; ++i) {
        const gate = this.gates[i];
        if (gate.type.ctorname === "ICInput") {
            inputs.push(gate);
        }
    }
    return inputs.sort(myIOSort);
};

Environment.prototype.getOutputs = function () {
    let outputs = [];
    for (let i = 0; i < this.gates.length; ++i) {
        const gate = this.gates[i];
        if (gate.type.ctorname === "ICOutput") {
            outputs.push(gate);
        }
    }

    return outputs.sort(myIOSort);
};

Environment.prototype.tryMerge = function (env, offset, selected, shallow) {
    if (offset == null)
        offset = new Pos(0, 0);
    if (selected == null)
        selected = false;
    if (shallow == null)
        shallow = false;

    for (let i = 0; i < env.gates.length; ++i) {
        let gate = env.gates[i].clone(shallow);
        gate.x += offset.x;
        gate.y += offset.y;
        gate.selected = selected;
        if (!this.canPlaceGate(gate)) return false;
        this.placeGate(gate);
    }

    let wires = env.getAllWires();
    for (let i = 0; i < wires.length; ++i) {
        let wire = wires[i];
        wire = new Wire(wire.start.add(offset), wire.end.add(offset));
        if (!this.canPlaceWire(wire)) return false;
        this.placeWire(wire.start, wire.end, selected);
    }

    return true;
};

Environment.prototype.getAllWires = function () {
    let wires = [];
    for (let i = this.wireGroups.length - 1; i >= 0; i--) {
        arrayPushMany(wires, this.wireGroups[i].getWires());
    }

    return wires;
};

Environment.prototype.deselectAll = function () {
    for (let i = this.gates.length - 1; i >= 0; --i) {
        this.gates[i].selected = false;
    }

    let wires = this.getAllWires();
    for (let i = wires.length - 1; i >= 0; --i) {
        wires[i].selected = false;
    }
};

Environment.prototype.canPlaceGate = function (gate) {
    let rect = gate.getRect();

    for (let i = 0; i < this.gates.length; ++i) {
        const other = this.gates[i].getRect();

        if (rect.intersects(other))
            return false;
    }

    let crossed = false;
    for (let i = 0; i < this.wireGroups.length; ++i) {
        let group = this.wireGroups[i];
        let wires = group.getWires();

        for (let j = 0; j < wires.length; ++j) {
            let wire = wires[j];
            if (wire.start.x < rect.right && wire.end.x > rect.left
                && wire.start.y <= rect.bottom && wire.end.y >= rect.top)
                return false;
        }

        for (let j = 0; j < gate.outputs.length; ++j) {
            let out = gate.outputs[j];
            if (group.crossesPos(out.getPosition(gate.type, gate.x, gate.y))) {
                if (crossed || group.input != null)
                    return false;

                crossed = true;
            }
        }
    }
    return true;
};

Environment.prototype.placeGate = function (gate) {
    gate.unlinkAll();

    let r0 = gate.getRect(this.getGridSize());

    for (let i = 0; i < this.gates.length; ++i) {
        let other = this.gates[i];
        let r1 = other.getRect(this.getGridSize());

        if (r0.left === r1.right || r1.left === r0.right
            || r0.top === r1.bottom || r1.top === r0.bottom) {
            for (let j = 0; j < gate.inputs.length; ++j) {
                let inp = gate.inputs[j];
                for (let k = 0; k < other.outputs.length; ++k) {
                    let out = other.outputs[k];

                    if (inp.getPosition(gate.type, gate.x, gate.y).equals(
                            out.getPosition(other.type, other.x, other.y))) {
                        gate.linkInput(other, out, inp);
                    }
                }
            }

            for (let j = 0; j < gate.outputs.length; ++j) {
                let out = gate.outputs[j];
                for (let k = 0; k < other.inputs.length; ++k) {
                    let inp = other.inputs[k];

                    if (out.getPosition(gate.type, gate.x, gate.y).equals(
                            inp.getPosition(other.type, other.x, other.y))) {
                        other.linkInput(gate, out, inp);
                    }
                }
            }
        }
    }

    for (let i = 0; i < this.wireGroups.length; ++i) {
        let group = this.wireGroups[i];

        for (let j = 0; j < gate.inputs.length; ++j) {
            let pos = gate.inputs[j].getPosition(gate.type, gate.x, gate.y);

            if (group.crossesPos(pos)) group.addOutput(gate, gate.inputs[j]);
        }

        for (let j = 0; j < gate.outputs.length; ++j) {
            let pos = gate.outputs[j].getPosition(gate.type, gate.x, gate.y);

            if (group.crossesPos(pos)) group.setInput(gate, gate.outputs[j]);
        }
    }

    this.gates.push(gate);

};

Environment.prototype.removeGate = function (gate) {
    let index = this.gates.indexOf(gate);

    this.gates.splice(index, 1);

    for (let i = 0; i < this.gates.length; ++i) {
        if (this.gates[i].isLinked(gate)) {
            this.gates[i].unlinkGate(gate);
        }

        if (gate.isLinked(this.gates[i])) {
            gate.unlinkGate(this.gates[i]);
        }
    }

    for (let i = 0; i < this.wireGroups.length; ++i) {
        let group = this.wireGroups[i];

        if (group.input != null && group.input.gate === gate) {
            group.input = null;
        }

        for (let j = group.outputs.length - 1; j >= 0; --j) {
            if (group.outputs[j].gate === gate) {
                group.outputs.splice(j, 1);
            }
        }
    }
};

Environment.prototype.canPlaceWire = function (wire) {
    let input = null;

    //if (!this.canPlaceRect(wire.start)) return false;

    for (let i = 0; i < this.wireGroups.length; ++i) {
        let group = this.wireGroups[i];

        if (group.canAddWire(wire)) {
            if (wire.start.equals(wire.end))
                return false;

            if (group.input != null) {
                if (input != null && !group.input.equals(input)) {
                    return false;
                }

                input = group.input;
            }
        }
    }

    for (let i = 0; i < this.gates.length; ++i) {
        let gate = this.gates[i];
        let rect = gate.getRect(this.getGridSize());

        if (wire.start.x < rect.right && wire.end.x > rect.left
            && wire.start.y <= rect.bottom && wire.end.y >= rect.top) {
            return false;
        }

        if (wire.start.x === rect.right || rect.left === wire.end.x
            || wire.start.y === rect.bottom || rect.top === wire.end.y) {
            for (let j = 0; j < gate.outputs.length; ++j) {
                let inp = new Link(gate, gate.outputs[j]);
                let pos = gate.outputs[j].getPosition(gate.type, gate.x, gate.y);

                if (wire.crossesPos(pos)) {
                    if (input != null && !inp.equals(input))
                        return false;

                    input = inp;
                }
            }
        }
    }

    return true;
};

Environment.prototype.canConnectToSocket = function (end) {

    let wire = new Wire(end, end);

    // Check for gate input / output intersections
    for (let i = 0; i < this.gates.length; ++i) {
        let gate = this.gates[i];
        const rect = gate.getRect(logicSim.getGridSize());

        if (wire.start.x === rect.right || rect.left === wire.end.x
            || wire.start.y === rect.bottom || rect.top === wire.end.y) {
            for (let j = 0; j < gate.inputs.length; ++j) {
                let pos = gate.inputs[j].getPosition(gate.type, gate.x, gate.y);

                if (wire.crossesPos(pos))
                    return true;
            }

            for (let j = 0; j < gate.outputs.length; ++j) {
                let pos = gate.outputs[j].getPosition(gate.type, gate.x, gate.y);

                if (wire.crossesPos(pos))
                    return true;
            }
        }
    }

    let wires = null;
    for (let i = this.wireGroups.length - 1; i >= 0; --i) {
        let oldGroup = this.wireGroups[i];
        if (oldGroup.canAddWire(wire))
            return true;
    }

    return false;
};

Environment.prototype.placeWire = function (start, end, selected) {

    if (start.equals(end)) {
        return;
    }

    // Here we go...

    selected = selected != null;
    let wire = new Wire(start, end);
    wire.selected = selected;

    let group = new WireGroup();
    group.addWire(wire);

    // Check for gate input / output intersections
    for (let i = 0; i < this.gates.length; ++i) {
        let gate = this.gates[i];
        let rect = gate.getRect(this.getGridSize());

        if (wire.start.x === rect.right || rect.left === wire.end.x
            || wire.start.y === rect.bottom || rect.top === wire.end.y) {
            for (let j = 0; j < gate.inputs.length; ++j) {
                let pos = gate.inputs[j].getPosition(gate.type, gate.x, gate.y);

                if (wire.crossesPos(pos)) {
                    wire.group.addOutput(gate, gate.inputs[j]);
                }
            }

            for (let j = 0; j < gate.outputs.length; ++j) {
                let pos = gate.outputs[j].getPosition(gate.type, gate.x, gate.y);

                if (wire.crossesPos(pos)) {
                    wire.group.setInput(gate, gate.outputs[j]);
                }
            }
        }
    }

    // Find all wire groups that are connected to the new wire, and
    // dump their wires, input and outputs into the new group
    let wires = null;
    for (let i = this.wireGroups.length - 1; i >= 0; --i) {
        let oldGroup = this.wireGroups[i];
        if (oldGroup.canAddWire(wire)) {
            this.wireGroups.splice(i, 1);

            wires = oldGroup.getWires();
            for (let j = 0; j < wires.length; ++j) {
                let newWire = new Wire(wires[j].start, wires[j].end);
                newWire.selected = wires[j].selected;
                group.addWire(newWire);
            }

            if (oldGroup.input !== null) {
                group.setInput(oldGroup.input.gate, oldGroup.input.socket);
            }

            for (let j = 0; j < oldGroup.outputs.length; ++j) {
                group.addOutput(oldGroup.outputs[j].gate, oldGroup.outputs[j].socket);
            }
        }
    }

    // Merge wires that run along eachother
    wires = group.getWires();
    for (let i = wires.length - 1; i >= 0; --i) {
        let w = wires[i];
        for (let j = i - 1; j >= 0; --j) {
            let other = wires[j];

            if (w.runsAlong(other)) {
                w.merge(other);
                wires.splice(j, 1);
                break;
            }
        }
    }

    // Split at intersections
    for (let i = 0; i < wires.length; ++i) {
        let w = wires[i];
        for (let j = i + 1; j < wires.length; ++j) {
            let other = wires[j];

            if (w.isHorizontal() === other.isHorizontal()) continue;

            if (w.intersects(other)) {
                arrayPushMany(wires, w.split(other));
                arrayPushMany(wires, other.split(w));
            }
        }
    }

    // Connect touching wires
    for (let i = 0; i < wires.length; ++i) {
        let w = wires[i];
        for (let j = i + 1; j < wires.length; ++j) {
            let other = wires[j];

            if (w.intersects(other)) {
                w.connect(other);
                other.connect(w);
            }
        }
    }

    // Add the new group to the environment
    this.wireGroups.push(group);
};

Environment.prototype.removeWire = function (wire) {
    this.removeWires(
        [wire]
    );
};

Environment.prototype.removeWires = function (toRemove) {
    let survivors = [];

    for (let i = 0; i < toRemove.length; ++i) {
        const group = toRemove[i].group;
        if (arrayContains(this.wireGroups, group)) {
            const wires = group.getWires();

            for (let j = 0; j < wires.length; ++j) {
                const w = wires[j];
                if (!arrayContains(toRemove, w)) {
                    survivors.push({start: w.start, end: w.end});
                }
            }

            const gindex = this.wireGroups.indexOf(group);
            this.wireGroups.splice(gindex, 1);
            group.removeAllOutputs();
        }
    }

    for (let i = 0; i < survivors.length; ++i) {
        this.placeWire(survivors[i].start, survivors[i].end);
    }
};

Environment.prototype.step = function () {
    let stateChanged = false;
    for (let i = 0; i < this.gates.length; ++i) {
        this.gates[i].step();
        if (this.myOnStateChanged && !stateChanged)
            stateChanged = this.gates[i].willChange();
    }

    for (let i = 0; i < this.gates.length; ++i) {
        this.gates[i].commit();
    }

    if (stateChanged)
        this.stateChanged();
};

Environment.prototype.render = function (context, offset, selectClr) {
    if (offset == null) {
        offset = new Pos(0, 0);
    }

    for (let i = 0; i < this.wireGroups.length; ++i) {
        this.wireGroups[i].render(context, offset, selectClr);
    }

    for (let i = 0; i < this.gates.length; ++i) {
        this.gates[i].render(context, offset, selectClr);
    }
};
