Decoder.prototype = Object.create(DefaultGate.prototype);
Decoder.prototype.constructor = Decoder;

function Decoder()
{
    var inputs = [];
    for (var i = 0; i < 4; ++ i)
        inputs[i] = new SocketInfo(SocketFace.left, 4 + i * 4, "I" + i);

    var outputs = [];
    for (i = 0; i < 9; ++ i)
        outputs[i] = new SocketInfo(SocketFace.right, 2 + i * 2, "O" + i);

    DefaultGate.call(this, "DECODER", images.decoder, false, inputs, outputs);

    this.func = function(gate, inp)
    {
        var val = 0;
        for (i = 0; i < 4; ++ i)
            if (inp[i]) val += 1 << i;

        var out = [];
        for (i = 0; i < 9; ++ i)
            out[i] = val == (i + 1);

        return out;
    };
}