
PushSwitchB.prototype = Object.create(DefaultGate.prototype);
PushSwitchB.prototype.constructor = PushSwitchB;

function PushSwitchB()
{
    this.openImage = images.pushswitchbopen;
    this.closedImage = images.pushswitchbclosed;

    DefaultGate.call(this, "PSWITCHB", this.closedImage, true,
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
        gate.open = false;
    };

    this.mouseDown = function(gate)
    {
        gate.open = true;
    };

    this.mouseUp = function(gate)
    {
        gate.open = false;
    };

    this.render = function(context, x, y, gate)
    {
        DefaultGate.prototype.render.call(this, context, x, y, gate);
        context.drawImage(gate != null && gate.open ? this.openImage : this.closedImage, x, y);
    };
}