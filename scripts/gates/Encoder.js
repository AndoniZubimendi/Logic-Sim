
Encoder.prototype = Object.create(DefaultGate.prototype);
Encoder.prototype.constructor = Encoder;

function Encoder()
{
    var inputs = [];
    for (var i = 0; i < 9; ++ i)
        inputs[i] = new SocketInfo(SocketFace.left, 2 + i * 2, "I" + i);

    var outputs = [];
    for (i = 0; i < 4; ++ i)
        outputs[i] = new SocketInfo(SocketFace.right, 4 + i * 4, "O" + i);

    DefaultGate.call(this, "ENCODER", images.encoder, false, inputs, outputs);

    this.func = function(gate, inp)
    {
        var val = 0;
        for (var i = 8; i >= 0; -- i)
        {
            if (inp[i])
            {
                val = i + 1;
                break;
            }
        }

        var out = [];
        for (i = 0; i < 4; ++ i)
            out[i] = (val & (1 << i)) != 0;

        return out;
    };
}
