function Environment()
{
	// event notification: because of drag and drop implementation
	// some event call were moved to logicsim.js. Much refactoring
	// is needed in order to support better event notification
        this.myOnStateChanged = null;
        this.myOnChanged = null;

        this.gates = [];
        this.wireGroups = [];

}

Environment.prototype.setOnStateChanged = function (callback)
{
    this.myOnStateChanged = callback;
};

Environment.prototype.stateChanged = function ()
{
	if (this.myOnStateChanged)
		this.myOnStateChanged(this);
};

Environment.prototype.setOnChanged = function (callback)
{
	this.myOnChanged = callback;
};

Environment.prototype.changed = function ()
{
	if (this.myOnChanged)
		this.myOnChanged(this);
};

Environment.prototype.getSortFunction = function() {
	return function (a,b) {
		a = a.label || a.type.name;
		b = b.label || b.type.name;
		if(a < b) return -1;
		if(a > b) return 1;
		return 0;
	};
};

Environment.prototype.find = function(gateType, sort){
	var result = [];
	for (var i=0; i<this.gates.length; i++){
		if (this.gates[i].type.ctorname == gateType)
			result.push(this.gates[i]);
	}
	if (sort==undefined || sort)
		result.sort(this.getSortFunction());
	return result;
};

Environment.prototype.findNot = function(gateType, sort){
	var result = [];
	for (var i=0; i<this.gates.length; i++){
		if (this.gates[i].type.ctorname != gateType)
			result.push(this.gates[i]);
	}
	if (sort==undefined || sort)
		result.sort(this.getSortFunction());
	return result;
};

Environment.prototype.getGridSize = function()
{
	return 1;
};

Environment.prototype.clear = function()
{
    this.gates = [];
    this.wireGroups = [];
    this.changed();
};

Environment.prototype.save = function()
{
     var obj = { gates: [], wires: [] };

     for (var i = 0; i < this.gates.length; ++i)
     {
         var gate = this.gates[i];
         var gobj = {
             t: gate.type.ctorname,
             x: gate.x,
             y: gate.y,
             l: gate.label,
             dl:gate.displayLabel,
             o: gate.getOutputs(),
             d: gate.saveData()
         };

         if (gobj.t == "CustomIC") {
             gobj.i = logicSim.customGroup.items.indexOf(gate.type);
             gobj.e = gate.environment.save();
         }

         obj.gates.push(gobj);
     }

     for (i = 0; i < this.wireGroups.length; ++i)
     {
         var wires = this.wireGroups[i].getWires();
         for (var j = 0; j < wires.length; ++j)
         {
             var wire = wires[j];
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

Environment.prototype.load = function(obj, ics)
{
    for (var i = 0; i < obj.gates.length; ++i)
    {
        var info = obj.gates[i];
        var gate = null;

        if (info.t == "CustomIC") {
            gate = new Gate(ics[info.i], info.x, info.y);
            var env = new Environment();
            env.load(info.e, ics);
            gate.environment = env;
        } else {
            var ctor = window[info.t];
            gate = new Gate(new ctor(), info.x, info.y, info.l, info.dl);
        }

        this.placeGate(gate);
        gate.setOutputs(info.o);
        gate.loadData(info.d);
    }

    for (i = 0; i < obj.wires.length; ++i)
    {
        info = obj.wires[i];
        this.placeWire(new Pos(info.sx, info.sy), new Pos(info.ex, info.ey));
    }
    this.changed();
};

Environment.prototype.clone = function()
{
    var env = new Environment();

    for (var i = 0; i < this.gates.length; ++i) {
        env.placeGate(this.gates[i].clone());
    }

    var wires = this.getAllWires();
    for (i = 0; i < wires.length; ++i) {
        env.placeWire(wires[i].start, wires[i].end);
    }

    return env;
};

    var myIOSort = function (a, b) {
        if (a.y < b.y) return -1;
        if (a.y == b.y) return a.x < b.x ? -1 : a.x == b.x ? 0 : 1;
        return 1;
    };

Environment.prototype.getInputs = function()
{
    var inputs = [];
    for (var i = 0; i < this.gates.length; ++i) {
        var gate = this.gates[i];
        if (gate.type.ctorname == "ICInput") {
            inputs.push(gate);
        }
    }
    return inputs.sort(myIOSort);
};

Environment.prototype.getOutputs = function()
{
    var outputs = [];
    for (var i = 0; i < this.gates.length; ++i) {
        var gate = this.gates[i];
        if (gate.type.ctorname == "ICOutput") {
            outputs.push(gate);
        }
    }

    return outputs.sort(myIOSort);
};

Environment.prototype.tryMerge = function(env, offset, selected, shallow)
{
    if (offset == null) offset = new Pos(0, 0);
    if (selected == null) selected = false;
    if (shallow == null) shallow = false;

    for (var i = 0; i < env.gates.length; ++i) {
        var gate = env.gates[i].clone(shallow);
        gate.x += offset.x;
        gate.y += offset.y;
        gate.selected = selected;
        if (!this.canPlaceGate(gate)) return false;
        this.placeGate(gate);
    }

    var wires = env.getAllWires();
    for (i = 0; i < wires.length; ++i) {
        var wire = wires[i];
        wire = new Wire(wire.start.add(offset), wire.end.add(offset));
        if (!this.canPlaceWire(wire)) return false;
        this.placeWire(wire.start, wire.end, selected);
    }

    return true;
};

Environment.prototype.getAllWires = function()
{
    var wires = [];
    for (var i = this.wireGroups.length - 1; i >= 0; i--) {
        wires.pushMany(this.wireGroups[i].getWires());
    }

    return wires;
};

Environment.prototype.deselectAll = function()
{
    for (var i = this.gates.length - 1; i >= 0; --i) {
        this.gates[i].selected = false;
    }

    var wires = this.getAllWires();
    for (i = wires.length - 1; i >= 0; --i) {
        wires[i].selected = false;
    }
};

Environment.prototype.canPlaceGate = function(gate)
{
    var rect = gate.getRect();

    for (var i = 0; i < this.gates.length; ++i) {
        var other = this.gates[i].getRect();

        if (rect.intersects(other)) return false;
    }

    var crossed = false;
    for (i = 0; i < this.wireGroups.length; ++ i) {
        var group = this.wireGroups[i];
        var wires = group.getWires();

        for (var j = 0; j < wires.length; ++ j) {
            var wire = wires[j];
            if (wire.start.x < rect.right && wire.end.x > rect.left
                && wire.start.y <= rect.bottom && wire.end.y >= rect.top)
                return false;
        }

        for (j = 0; j < gate.outputs.length; ++ j) {
            var out = gate.outputs[j];
            if (group.crossesPos(out.getPosition(gate.type, gate.x, gate.y))) {
                if (crossed || group.input != null) return false;

                crossed = true;
            }
        }
    }
    return true;
};

Environment.prototype.placeGate = function(gate)
{
   gate.unlinkAll();

   var r0 = gate.getRect(this.getGridSize());

   for (var i = 0; i < this.gates.length; ++ i) {
       var other = this.gates[i];
       var r1 = other.getRect(this.getGridSize());

       if (r0.left == r1.right || r1.left == r0.right
           || r0.top == r1.bottom || r1.top == r0.bottom) {
           for (var j = 0; j < gate.inputs.length; ++ j) {
               var inp = gate.inputs[j];
               for (var k = 0; k < other.outputs.length; ++ k) {
                   var out = other.outputs[k];

                    if (inp.getPosition(gate.type, gate.x, gate.y).equals(
                        out.getPosition(other.type, other.x, other.y))) {
                        gate.linkInput(other, out, inp);
                    }
               }
           }

           for (j = 0; j < gate.outputs.length; ++ j) {
               out = gate.outputs[j];
               for (k = 0; k < other.inputs.length; ++ k) {
                   inp = other.inputs[k];

                   if (out.getPosition(gate.type, gate.x, gate.y).equals(
                        inp.getPosition(other.type, other.x, other.y))) {
                        other.linkInput(gate, out, inp);
                   }
               }
           }
       }
   }

   for (i = 0; i < this.wireGroups.length; ++ i) {
       var group = this.wireGroups[i];

       for (j = 0; j < gate.inputs.length; ++ j) {
          var pos = gate.inputs[j].getPosition(gate.type, gate.x, gate.y);

          if (group.crossesPos(pos)) group.addOutput(gate, gate.inputs[j]);
       }

       for (j = 0; j < gate.outputs.length; ++ j) {
           pos = gate.outputs[j].getPosition(gate.type, gate.x, gate.y);

           if (group.crossesPos(pos)) group.setInput(gate, gate.outputs[j]);
       }
   }

   this.gates.push(gate);

};

Environment.prototype.removeGate = function(gate)
{
    var index = this.gates.indexOf(gate);
    this.gates.splice(index, 1);

    for (var i = 0; i < this.gates.length; ++ i) {
        if (this.gates[i].isLinked(gate)) {
            this.gates[i].unlinkGate(gate);
        }

        if (gate.isLinked(this.gates[i])) {
            gate.unlinkGate(this.gates[i]);
        }
    }

    for (i = 0; i < this.wireGroups.length; ++ i) {
        var group = this.wireGroups[i];

        if (group.input != null && group.input.gate == gate) {
            group.input = null;
        }

        for (var j = group.outputs.length - 1; j >= 0; -- j) {
            if (group.outputs[j].gate == gate) {
                group.outputs.splice(j, 1);
            }
        }
    }
};

Environment.prototype.canPlaceWire = function(wire)
{
    var input = null;

    //if (!this.canPlaceRect(wire.start)) return false;

    for (var i = 0; i < this.wireGroups.length; ++ i) {
        var group = this.wireGroups[i];

        if (group.canAddWire(wire)) {
            if (wire.start.equals(wire.end)) return false;

            if (group.input != null) {
                if (input != null && !group.input.equals(input)) {
                    return false;
                }

                input = group.input;
            }
        }
    }

    for (i = 0; i < this.gates.length; ++ i) {
        var gate = this.gates[i];
        var rect = gate.getRect(this.getGridSize());

        if (wire.start.x < rect.right && wire.end.x > rect.left
            && wire.start.y <= rect.bottom && wire.end.y >= rect.top) {
            return false;
        }

        if (wire.start.x == rect.right || rect.left == wire.end.x
            || wire.start.y == rect.bottom || rect.top == wire.end.y) {
            for (var j = 0; j < gate.outputs.length; ++ j) {
                var inp = new Link(gate, gate.outputs[j]);
                var pos = gate.outputs[j].getPosition(gate.type, gate.x, gate.y);

                if (wire.crossesPos(pos)) {
                    if (input != null && !inp.equals(input)) return false;

                    input = inp;
                }
            }
        }
    }

    return true;
};

Environment.prototype.canConnectToSocket = function(end)
{

    var wire = new Wire(end, end);

    // Check for gate input / output intersections
    for (var i = 0; i < this.gates.length; ++ i) {
        var gate = this.gates[i];
        var rect = gate.getRect(logicSim.getGridSize());

        if (wire.start.x == rect.right || rect.left == wire.end.x
            || wire.start.y == rect.bottom || rect.top == wire.end.y) {
            for (var j = 0; j < gate.inputs.length; ++ j) {
               var pos = gate.inputs[j].getPosition(gate.type, gate.x, gate.y);

               if (wire.crossesPos(pos))
	  	  return true;
            }

            for (j = 0; j < gate.outputs.length; ++ j) {
                pos = gate.outputs[j].getPosition(gate.type, gate.x, gate.y);

                if (wire.crossesPos(pos))
		    return true;
            }
        }
    }

    var wires = null;
    for (i = this.wireGroups.length - 1; i >= 0; -- i) {
        var oldGroup = this.wireGroups[i];
        if (oldGroup.canAddWire(wire))
            return true;
        }

    return false;
};

Environment.prototype.placeWire = function(start, end, selected)
{
    if (start.equals(end)) {
        return;
    }

    // Here we go...

    selected = selected != null;
    var wire = new Wire(start, end);
    wire.selected = selected;

    var group = new WireGroup();
    group.addWire(wire);

    // Check for gate input / output intersections
    for (var i = 0; i < this.gates.length; ++ i) {
        var gate = this.gates[i];
        var rect = gate.getRect(this.getGridSize());

        if (wire.start.x == rect.right || rect.left == wire.end.x
            || wire.start.y == rect.bottom || rect.top == wire.end.y) {
            for (var j = 0; j < gate.inputs.length; ++ j) {
                var pos = gate.inputs[j].getPosition(gate.type, gate.x, gate.y);

                if (wire.crossesPos(pos)) {
                    wire.group.addOutput(gate, gate.inputs[j]);
                }
            }

            for (j = 0; j < gate.outputs.length; ++ j) {
                pos = gate.outputs[j].getPosition(gate.type, gate.x, gate.y);

                if (wire.crossesPos(pos)) {
                    wire.group.setInput(gate, gate.outputs[j]);
                }
            }
        }
    }

    // Find all wire groups that are connected to the new wire, and
    // dump their wires, input and outputs into the new group
    var wires = null;
    for (i = this.wireGroups.length - 1; i >= 0; -- i) {
        var oldGroup = this.wireGroups[i];
        if (oldGroup.canAddWire(wire)) {
            this.wireGroups.splice(i, 1);

            wires = oldGroup.getWires();
            for (j = 0; j < wires.length; ++ j) {
                var newWire = new Wire(wires[j].start, wires[j].end);
                newWire.selected = wires[j].selected;
                group.addWire(newWire);
            }

            if (oldGroup.input != null) {
                group.setInput(oldGroup.input.gate, oldGroup.input.socket);
            }

            for (j = 0; j < oldGroup.outputs.length; ++ j) {
                group.addOutput(oldGroup.outputs[j].gate, oldGroup.outputs[j].socket);
            }
        }
    }

    // Merge wires that run along eachother
    wires = group.getWires();
    for (i = wires.length - 1; i >= 0; -- i) {
        var w = wires[i];
        for (j = i - 1; j >= 0; -- j) {
            other = wires[j];

            if (w.runsAlong(other)) {
                w.merge(other);
                wires.splice(j, 1);
                break;
            }
        }
    }

    // Split at intersections
    for (i = 0; i < wires.length; ++ i) {
        w = wires[i];
        for (j = i + 1; j < wires.length; ++ j) {
            var other = wires[j];

            if (w.isHorizontal() == other.isHorizontal()) continue;

            if (w.intersects(other)) {
                wires.pushMany(w.split(other));
                wires.pushMany(other.split(w));
            }
        }
    }

    // Connect touching wires
    for (i = 0; i < wires.length; ++ i) {
        w = wires[i];
        for (j = i + 1; j < wires.length; ++ j) {
            other = wires[j];

            if (w.intersects(other)) {
                w.connect(other);
                other.connect(w);
            }
        }
    }

    // Add the new group to the environment
    this.wireGroups.push(group);
};

Environment.prototype.removeWire = function(wire)
{
    this.removeWires([wire]);
};

Environment.prototype.removeWires = function(toRemove)
{
    var survivors = [];

    for (var i = 0; i < toRemove.length; ++ i) {
        var group = toRemove[i].group;
        if (this.wireGroups.contains(group)) {
            var wires = group.getWires();

            for (var j = 0; j < wires.length; ++ j) {
                var w = wires[j];
                if (!toRemove.containsEqual(w)) {
                    survivors.push({start: w.start, end: w.end});
                }
            }

            var gindex = this.wireGroups.indexOf(group);
            this.wireGroups.splice(gindex, 1);
            group.removeAllOutputs();
        }
    }

    for (i = 0; i < survivors.length; ++ i) {
        this.placeWire(survivors[i].start, survivors[i].end);
    }
};

Environment.prototype.step = function()
{
     var stateChanged = false;
     for (var i = 0; i < this.gates.length; ++ i) {
        this.gates[i].step();
        if (this.myOnStateChanged && !stateChanged)
            stateChanged = this.gates[i].willChange();
     }

     for (i = 0; i < this.gates.length; ++ i) {
        this.gates[i].commit();
     }
     if (stateChanged)
        this.stateChanged();
};

Environment.prototype.render = function(context, offset, selectClr)
{
    if (offset == null) {
       offset = new Pos(0, 0);
    }

    for (var i = 0; i < this.wireGroups.length; ++ i) {
       this.wireGroups[i].render(context, offset, selectClr);
    }

    for (i = 0; i < this.gates.length; ++ i) {
        this.gates[i].render(context, offset, selectClr);
    }
};

