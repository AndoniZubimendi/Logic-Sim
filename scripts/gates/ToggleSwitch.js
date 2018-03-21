ToggleSwitch.prototype = Object.create(DefaultGate.prototype);
ToggleSwitch.prototype.constructor = ToggleSwitch;

function ToggleSwitch()
{
    this.openImage = images.switchopen;
    this.closedImage = images.switchclosed;

    DefaultGate.call(this, "TSWITCH", this.openImage, true,
        [
            new SocketInfo(SocketFace.left, 2, "A")
        ],
        [
            new SocketInfo(SocketFace.right, 2, "Q")
        ]
    );

    this.func = function(gate, inputs)
    {
        return [!gate.open && inputs[0]];
    };

    this.initialize = function(gate)
    {
        gate.open = true;
    };

    this.click = function(gate)
    {
        gate.open = !gate.open;
    };

    this.saveData = function(gate)
    {
        return gate.open;
    };

    this.loadData = function(gate, data)
    {
        gate.open = data;
    };

    this.render = function(context, x, y, gate)
    {
        DefaultGate.prototype.render.call(this, context, x, y, gate);
        context.drawImage(gate == null || gate.open ? this.openImage : this.closedImage, x, y);
    };
}