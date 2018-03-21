SevenSegDecoder.prototype = Object.create(DefaultGate.prototype);
SevenSegDecoder.prototype.constructor = SevenSegDecoder;

function SevenSegDecoder()
{
    var inputs = [];
    for (var i = 0; i < 4; ++ i)
        inputs[i] = new SocketInfo(SocketFace.left, 2 + i * 4, "I" + i);

    var outputs = [];
    for (i = 0; i < 7; ++ i)
        outputs[i] = new SocketInfo(SocketFace.right, 2 + i * 2, "O" + i);

    DefaultGate.call(this, "7447", images.sevsegdecoder, false, inputs, outputs);

    var myOutputs = [
        [ true,  true,  true,  false, true,  true,  true  ],
        [ true,  true,  false, false, false, false, false ],
        [ false, true,  true,  true,  false, true,  true  ],
        [ true,  true,  true,  true,  false, false, true  ],
        [ true,  true,  false, true,  true,  false, false ],
        [ true,  false, true,  true,  true,  false, true  ],
        [ true,  false, true,  true,  true,  true,  true  ],
        [ true,  true,  true,  false, false, false, false ],
        [ true,  true,  true,  true,  true,  true,  true  ],
        [ true,  true,  true,  true,  true,  false, true  ],
        [ false, false, false, false, false, false, false ]
    ];

    this.func = function(gate, inp)
    {
        var val = 0;
        for (var i = 0; i < 4; ++ i)
            if (inp[i]) val += 1 << i;

        return myOutputs[Math.min(val, myOutputs.length - 1)];
    };
}
