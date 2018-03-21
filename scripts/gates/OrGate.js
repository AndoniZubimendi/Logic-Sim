OrGate.prototype = Object.create(DefaultGate.prototype);
OrGate.prototype.constructor = OrGate;
function OrGate()
{
    DefaultGate.call(this, "+", images.or, false,
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
        return [inputs[0] || inputs[1]];
    }
}