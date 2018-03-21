SevenSegDisplay.prototype = Object.create(DefaultGate.prototype);
SevenSegDisplay.prototype.constructor = SevenSegDisplay;

function SevenSegDisplay()
{
    this.baseImage = images.sevsegbase;
    this.segImages =
        [
            images.sevsega, images.sevsegb, images.sevsegc, images.sevsegdp,
            images.sevsegd, images.sevsege, images.sevsegf, images.sevsegg
        ];

    DefaultGate.call(this, "SEVSEG", this.baseImage, true,
        [
            new SocketInfo(SocketFace.right, 2, "A"),
            new SocketInfo(SocketFace.right, 4, "B"),
            new SocketInfo(SocketFace.right, 6, "C"),
            new SocketInfo(SocketFace.right, 8, "DP"),
            new SocketInfo(SocketFace.left,  8, "D"),
            new SocketInfo(SocketFace.left,  6, "E"),
            new SocketInfo(SocketFace.left,  4, "F"),
            new SocketInfo(SocketFace.left,  2, "G")
        ],
        []
    );

    this.func = function(gate, inputs)
    {
        gate.active = inputs;
        return [];
    };

    this.initialize = function(gate)
    {
        gate.active = [false, false, false, false, false, false, false, false];
    };

    this.render = function(context, x, y, gate)
    {
        DefaultGate.prototype.render.call(this, context, x, y, gate);
        context.drawImage(this.baseImage, x, y);

        if (gate != null)
            for (var i = 0; i < 8; ++ i)
                if (gate.active[i])
                    context.drawImage(this.segImages[i], x, y);
    };
}

