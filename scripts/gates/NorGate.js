NorGate.prototype = Object.create(DefaultGate.prototype);
NorGate.prototype.constructor = NorGate;
function NorGate()
{
    DefaultGate.call(this, "NOR", images.nor, false,
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
        return [!inputs[0] && !inputs[1]];
    };
}
