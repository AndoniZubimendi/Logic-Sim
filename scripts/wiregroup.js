function WireGroup()
{
    this.myWires = [];
    this.myBounds = null;

    this.input = null;
    this.outputs = [];

    this.isEmpty = false;

}

WireGroup.prototype.getWires = function()
{
    return this.myWires;
};

WireGroup.prototype.canAddWire = function(wire)
{
    if (this.myBounds == null || !this.myBounds.intersectsWire(wire, true)) return false;

    for (var i = 0; i < this.myWires.length; ++i) {
        if (this.myWires[i].canConnect(wire)) {
            return true;
        }
    }

    return false;
};

WireGroup.prototype.crossesPos = function(pos)
{
    if (this.myBounds == null || !this.myBounds.contains(pos)) return false;

    for (var i = 0; i < this.myWires.length; ++i) {
        if (this.myWires[i].crossesPos(pos)) {
            return true;
        }
    }

    return false;
};

WireGroup.prototype.getWireAt = function(pos)
{
   if (this.myBounds == null || !this.myBounds.contains(pos)) return null;

   for (var i = 0; i < this.myWires.length; ++i) {
      if (this.myWires[i].crossesPos(pos)) return this.myWires[i];
   }
   return null;
};

WireGroup.prototype.setInput = function(gate, output)
{
    this.input = new Link(gate, output);

    for (var i = 0; i < this.outputs.length; ++i) {
        var link = this.outputs[i];
        link.gate.linkInput(this.input.gate, this.input.socket, link.socket);
    }
};

WireGroup.prototype.removeInput = function()
{
    this.input = null;

    var wires = this.myWires;
    this.myWires = [];

    for (var i = 0; i < this.outputs.length; ++i) {
        var link = this.outputs[i];
        logicSim.removeGate(link.gate);
        logicSim.placeGate(link.gate);
    }

    this.myWires = wires;
};

WireGroup.prototype.addOutput = function(gate, input)
{
   var link = new Link(gate, input);

   if (this.outputs.containsEqual(link)) return;

   if (this.input != null) {
       gate.linkInput(this.input.gate, this.input.socket, link.socket);
   }

   this.outputs.push(link);
};

WireGroup.prototype.removeOutput = function(link)
{
    logicSim.removeGate(link.gate);
    logicSim.placeGate(link.gate);
};

WireGroup.prototype.removeAllOutputs = function()
{
    var wires = this.myWires;
    this.myWires = [];

    for (var i = this.outputs.length - 1; i >= 0; --i) {
        this.removeOutput(this.outputs[i]);
    }

    this.myWires = wires;
};

WireGroup.prototype.addWire = function(wire)
{
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
};
	
WireGroup.prototype.shiftBy = function(dx,dy)
{
    for (var i = 0; i < this.myWires.length; ++i) {
	this.myWires[i].shiftBy(dx,dy);
    }
    if (this.myBounds){
	this.myBounds.shiftBy(dx, dy);
    }
};

WireGroup.prototype.render = function(context, offset, selectClr)
{
    for (var i = 0; i < this.myWires.length; ++i) {
        this.myWires[i].render(context, offset, selectClr);
    }
};

