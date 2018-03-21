OutputDisplay.prototype = Object.create(DefaultGate.prototype);
OutputDisplay.prototype.constructor = OutputDisplay;

function OutputDisplay()
{
    this.onImage = images.outon;
    this.offImage = images.outoff;

    DefaultGate.call(this, "OUT", this.onImage, true,
        [
            new SocketInfo(SocketFace.left, 2, "A")
        ],
        []
    );


    this.func = function(gate, inputs)
    {
        gate.on = inputs[0];
        return [];
    };

    this.initialize = function(gate)
    {
        gate.on = false;
    };

    this.render = function(context, x, y, gate)
    {
        DefaultGate.prototype.render.call(this, context, x, y, gate);
        context.drawImage(gate == null || !gate.on ? this.offImage : this.onImage, x, y);
    };
}

