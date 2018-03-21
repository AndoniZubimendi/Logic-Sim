NandGate.prototype = Object.create(DefaultGate.prototype);
NandGate.prototype.constructor = NandGate;
function NandGate()
{
    DefaultGate.call(this, "NAND", images.nand, false,
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
        return [!inputs[0] || !inputs[1]];
    };
}