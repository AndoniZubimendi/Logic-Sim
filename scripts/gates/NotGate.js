
NotGate.prototype = Object.create(DefaultGate.prototype);
NotGate.prototype.constructor = NotGate;
function NotGate()
{
    DefaultGate.call(this, "\\overline", images.not, false,
        [
            new SocketInfo(SocketFace.left, 2, "A")
        ],
        [
            new SocketInfo(SocketFace.right, 2, "Q")
        ]
    );

    this.func = function(gate, inputs)
    {
        return [!inputs[0]];
    };
}