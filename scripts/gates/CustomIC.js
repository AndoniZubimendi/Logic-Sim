CustomIC.prototype = Object.create(GateType.prototype);
CustomIC.prototype.constructor = CustomIC;

function CustomIC(name, environment)
{
    var envInputs = environment.getInputs();
    var envOutputs = environment.getOutputs();

    var inputs = [];
    var outputs = [];

    this.ctorname = arguments.callee.name;

    this.environment = environment;

    for (var i = 0; i < envInputs.length; ++ i) {
        var input = envInputs[i];
        inputs[i] = new SocketInfo(SocketFace.left, 2 + i * 2, "I" + i)
    }

    for (i = 0; i < envOutputs.length; ++ i) {
        input = envOutputs[i];
        outputs[i] = new SocketInfo(SocketFace.right, 2 + i * 2, "O" + i)
    }

    GateType.call(this, name, 64,
        Math.max(32, 16 * (Math.max(envInputs.length, envOutputs.length) + 1)),
        inputs, outputs);

    this.initialize = function(gate)
    {
        gate.environment = this.environment.clone();
    };

    this.func = function(gate, inputs)
    {
        var ins = gate.environment.getInputs();
        for (var i = 0; i < ins.length; ++ i) {
            ins[i].value = inputs[i];
        }

        gate.environment.step();

        var vals = [];
        var outs = gate.environment.getOutputs();
        for (i = 0; i < outs.length; ++ i) {
            vals[i] = outs[i].value;
        }

        return vals;
    };

    this.render = function(context, x, y, gate)
    {
        GateType.prototype.render.call(this, context, x, y, gate);

        context.strokeStyle = "#000000";
        context.fillStyle = "#ffffff";
        context.lineWidth = 3;

        context.beginPath();
        context.rect(x + 9.5, y + 1.5, this.width - 19, this.height - 3);
        context.fill();
        context.stroke();
        context.closePath();

        context.fillStyle = "#000000";
        context.font = "bold 16px sans-serif";
        context.textAlign = "center";
        context.textBaseline = "middle";

        var width = context.measureText(this.name).width;

        if (this.width - 16 > this.height) {
            context.fillText(this.name, x + this.width / 2, y + this.height / 2, this.width - 24);
        } else {
            context.save();
            context.translate(x + this.width / 2, y + this.height / 2);
            context.rotate(Math.PI / 2);
            context.fillText(this.name, 0, 0, this.height - 12);
            context.restore();
        }

        context.textAlign = "left";
        context.textBaseline = "alphabetic";
    }
}