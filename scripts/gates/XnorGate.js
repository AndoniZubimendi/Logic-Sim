
XnorGate.prototype = Object.create(DefaultGate.prototype);
XnorGate.prototype.constructor = XnorGate;
function XnorGate()
{
    DefaultGate.call(this, "XNOR", images.xnor, false,
        [
            new SocketInfo(SocketFace.left, 1, "A"),
            new SocketInfo(SocketFace.left, 3, "B")
        ],
        [
            new SocketInfo(SocketFace.right, 2, "Q")
        ]
    );

    this.func = function(gate, inputs)
    {
        return [inputs[0] == inputs[1]];
    };
}