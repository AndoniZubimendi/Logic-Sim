AndGate.prototype = Object.create(DefaultGate.prototype);
AndGate.prototype.constructor = AndGate;

function AndGate() {
    DefaultGate.call(this, ".", images.and, false,
        [
            new SocketInfo(SocketFace.left, 1, "A"),
            new SocketInfo(SocketFace.left, 3, "B")
        ],
        [
            new SocketInfo(SocketFace.right, 2, "Q")
        ]
    );

    this.func = function (gate, inputs) {
        return [inputs[0] && inputs[1]];
    };
}