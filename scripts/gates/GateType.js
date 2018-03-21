function GateType(name, width, height, inputs, outputs)
{
    this.isGateType = true;

    this.name = name;

    this.width = width;
    this.height = height;

    this.inputs = inputs;
    this.outputs = outputs;

}

GateType.prototype.func = function(gate, inputs)
{
    return [false];
};

GateType.prototype.initialize = function(gate)
{
};

GateType.prototype.click = function(gate)
{
};

GateType.prototype.mouseDown = function(gate)
{
};

GateType.prototype.mouseUp = function(gate)
{
};

GateType.prototype.saveData = function(gate)
{
    return null;
};

GateType.prototype.loadData = function(gate, data)
{
};

GateType.prototype.socketAt = function(x, y, px, py){
    var pos,j;
    for (j = 0; j < this.inputs.length; ++ j) {
        pos = this.inputs[j].getPosition(this, x, y);
        if (pos.x==px && pos.y==py)
            return this.inputs[j];
    }

    for (j = 0; j < this.outputs.length; ++ j) {
        pos = this.outputs[j].getPosition(this, x, y);
        if (pos.x==px && pos.y==py)
            return this.outputs[j];
    }

    return null;
};

GateType.prototype.setLabel = function(label)
{
    this.type.name = label;
};

GateType.prototype.renderLabel = function(context,x,y,label, align)
{
    context.save();
    context.font= LabelStyle.font;
    context.fillStyle = LabelStyle.color;

    var spc = context.measureText('.').width;
    switch(align){
        case LabelDisplay.left:
            context.textBaseline = 'middle';
            context.fillText(label, x-context.measureText(label).width-spc, y+this.height/2 );
            break;
        case LabelDisplay.top:
            context.textBaseline = 'bottom';
            context.fillText(label, x+(this.width-context.measureText(label).width)/2, y-spc );
            break;
        case LabelDisplay.right:
            context.textBaseline = 'middle';
            context.fillText(label, x+this.width+spc, y+this.height/2 );
            break;
        case LabelDisplay.bottom:
            context.textBaseline = 'top';
            context.fillText(label, x+(this.width-context.measureText(label).width)/2, y+this.height+spc );
    }

    context.restore();
};

GateType.prototype.render = function(context, x, y, gate)
{
    context.strokeStyle = "#000000";
    context.lineWidth = 2;

    for (var i = 0; i < this.inputs.length + this.outputs.length; ++ i)
    {
        var inp = (i < this.inputs.length ? this.inputs[i] : this.outputs[i - this.inputs.length]);
        var start = inp.getPosition(this, x, y);
        var end = inp.getPosition(this, x, y);

        if (inp.face == SocketFace.left || inp.face == SocketFace.right)
            end.x = x + this.width / 2;
        else
            end.y = y + this.height / 2;

        context.beginPath();
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
        context.stroke();
        context.closePath();
    }
};
