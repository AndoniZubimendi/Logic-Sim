PushSwitchA.prototype = Object.create(DefaultGate.prototype);
PushSwitchA.prototype.constructor = PushSwitchA;

function PushSwitchA()
{
    this.openImage = images.pushswitchaopen;
    this.closedImage = images.pushswitchaclosed;

    DefaultGate.call(this, "PSWITCHA", this.openImage, true,
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

    this.mouseDown = function(gate)
    {
        gate.open = false;
    };

    this.mouseUp = function(gate)
    {
        gate.open = true;
    };

    this.render = function(context, x, y, gate)
    {
        DefaultGate.prototype.render.call(this, context, x, y, gate);
        context.drawImage(gate == null || gate.open ? this.openImage : this.closedImage, x, y);
    };
}