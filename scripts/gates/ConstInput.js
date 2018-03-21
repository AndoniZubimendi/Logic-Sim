ConstInput.prototype = Object.create(DefaultGate.prototype);
ConstInput.prototype.constructor = ConstInput;
function ConstInput()
{
    this.onImage = images.conston;
    this.offImage = images.constoff;

    DefaultGate.call(this, "IN", this.onImage, true, [],
        [
            new SocketInfo(SocketFace.right, 2, "Q")
        ]
    );

    this.initialize = function(gate)
    {
        gate.on = true;
    };

    this.click = function(gate)
    {
        gate.on = !gate.on;
    };

    this.func = function(gate, inputs)
    {
        return [gate.on];
    };

    this.saveData = function(gate)
    {
        return gate.on;
    };

    this.loadData = function(gate, data)
    {
        gate.on = data;
    };

    this.render = function(context, x, y, gate)
    {
        DefaultGate.prototype.render.call(this, context, x, y, gate);
        context.drawImage(gate == null || gate.on ? this.onImage : this.offImage, x, y);
    };
}
