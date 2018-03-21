BufferGate.prototype = Object.create(DefaultGate.prototype);
BufferGate.prototype.constructor = BufferGate;

function BufferGate()
{
    DefaultGate.call(this, "BUF", images.buffer, false,
        [
            new SocketInfo(SocketFace.left, 2, "A")
        ],
        [
            new SocketInfo(SocketFace.right, 2, "Q")
        ]
    );

    this.func = function(gate, inputs)
    {
        return [inputs[0]];
    };
}
