function Gate(gateType, x, y, lbl, dply, noInit)
{
    var myOutputs = [];
    var myNextOutputs = [];
    var myInLinks = [];

    this.type = gateType;
    this.x = x;
    this.y = y;

    this.label = lbl ? lbl : "";

    this.displayLabel = dply ? dply : (DefaultLabelDisplay[gateType.name] ? DefaultLabelDisplay[gateType.name]: LabelDisplay.top);

    if (noInit == null) noInit = false;

    this.isMouseDown = false;

    this.width = this.type.width;
    this.height = this.type.height;

    this.inputs = this.type.inputs;
    this.outputs = this.type.outputs;

    this.selected = false;

    for (var i = 0; i < this.type.inputs.length; ++i)
        myInLinks[i] = null;

    for (i = 0; i < this.type.outputs.length; ++i)
        myOutputs[i] = false;

    this.clone = function(shallow)
    {
        if (shallow == null) shallow = false;

        var copy = new Gate(this.type, this.x, this.y, this.label, this.displayLabel, shallow);

        if (!shallow) copy.loadData(this.saveData());

        return copy;
    };

    this.getRect = function(gridSize)
    {
        if (!gridSize)
            gridSize = 1;

        var rl = Math.round(this.x);
        var rt = Math.round(this.y);
        var rr = Math.round(this.x + this.width);
        var rb = Math.round(this.y + this.height);

        rl = Math.floor(rl / gridSize) * gridSize;
        rt = Math.floor(rt / gridSize) * gridSize;
        rr = Math.ceil(rr / gridSize) * gridSize;
        rb = Math.ceil(rb / gridSize) * gridSize;

        return new Rect(rl, rt, rr - rl, rb - rt);
    };

    this.linkInput = function(gate, output, input)
    {
        var index = this.inputs.indexOf(input);
        myInLinks[index] = new Link(gate, output);
    };

    this.isLinked = function(gate)
    {
        for (var i = 0; i < this.inputs.length; ++ i)
            if (myInLinks[i] != null && myInLinks[i].gate == gate)
                return true;

        return false;
    };

    // added in order to build expression tree
    this.getLinkableInputs = function()
    {
        return myInLinks;
    };

    this.unlinkAll = function()
    {
        for (var i = 0; i < this.inputs.length; ++ i)
            myInLinks[i] = null;
    };

    this.unlinkGate = function(gate)
    {
        for (var i = 0; i < this.inputs.length; ++ i)
            if (myInLinks[i] != null && myInLinks[i].gate == gate)
                myInLinks[i] = null;
    };

    this.unlinkInput = function(input)
    {
        var index = this.inputs.indexOf(input);
        myInLinks[index] = null;
    };

    this.getOutputs = function()
    {
        return myOutputs;
    };

    this.setOutputs = function(outputs)
    {
        myOutputs = outputs;
    };

    this.getOutput = function(output)
    {
        var index = this.outputs.indexOf(output);
        return myOutputs[index];
    };

    this.click = function()
    {
        this.type.click(this);
    };

    this.mouseDown = function()
    {
        this.isMouseDown = true;
        this.type.mouseDown(this);
    };

    this.mouseUp = function()
    {
        this.isMouseDown = false;
        this.type.mouseUp(this);
    };

    this.step = function()
    {
        var inVals = [];

        for (var i = 0; i < this.inputs.length; ++ i)
        {
            var link = myInLinks[i];
            inVals[i] = (myInLinks[i] == null)
                ? false : link.getValue();
        }

        myNextOutputs = this.type.func(this, inVals);
    };

    this.willChange = function()
    {
        return !arraySameValues(myOutputs,myNextOutputs);
    };

    this.commit = function()
    {
        myOutputs = myNextOutputs;
    };

    this.saveData = function()
    {
        return this.type.saveData(this);
    };

    this.loadData = function(data)
    {
        this.type.loadData(this, data);
    };

    this.render = function(context, offset, selectClr)
    {
        if (this.selected) {
            var rect = this.getRect();

            if (selectClr == null) selectClr = "#6666FF";

            context.globalAlpha = 0.5;
            context.fillStyle = selectClr;
            context.fillRect(rect.left - 4 + offset.x, rect.top - 4 + offset.y,
                rect.width + 8, rect.height + 8);
            context.globalAlpha = 1.0;
        }

        this.type.render(context, this.x + offset.x, this.y + offset.y, this);

        context.strokeStyle = "#000000";
        context.lineWidth = 2;
        context.fillStyle = "#9999FF";

        for (var i = 0; i < this.inputs.length + this.outputs.length; ++ i) {
            var inp = (i < this.inputs.length ? this.inputs[i]
                : this.outputs[i - this.inputs.length]);
            var pos = inp.getPosition(this.type, this.x, this.y);

            if (i < this.inputs.length) {
                if (myInLinks[i] != null) {
                    context.fillStyle = myInLinks[i].getValue() ? "#FF9999" : "#9999FF";
                } else {
                    context.fillStyle = "#999999";
                }
            } else {
                context.fillStyle = myOutputs[i - this.inputs.length]
                    ? "#FF9999" : "#9999FF";
            }

            context.beginPath();
            context.arc(pos.x + offset.x, pos.y + offset.y, 4, 0, Math.PI * 2, true);
            context.fill();
            context.stroke();
            context.closePath();
        }
    };

    if (!noInit) {
        this.type.initialize(this);
    }

    this.shiftBy = function(dx, dy)
    {
        this.x+=dx;
        this.y+=dy;
    };

    this.socketAt = function(px, py){
        return this.type.socketAt(this.x, this.y, px, py);

    };
}
