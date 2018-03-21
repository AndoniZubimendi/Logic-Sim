DFlipFlop.prototype = Object.create(DefaultGate.prototype);
DFlipFlop.prototype.constructor = DFlipFlop;

function DFlipFlop()
{
    DefaultGate.call(this, "DFLIPFLOP", images.dflipflop, false,
        [
            new SocketInfo(SocketFace.left,  2, "D"),
            new SocketInfo(SocketFace.left,  6, ">")
        ],
        [
            new SocketInfo(SocketFace.right,  2, "Q"),
            new SocketInfo(SocketFace.right,  6, "NQ")
        ]
    );

    this.func = function(gate, inputs)
    {
        if (!gate.oldClock && inputs[1]) {
            gate.state = inputs[0];
        }

        gate.oldClock = inputs[1];

        return [gate.state, !gate.state];
    };

    this.initialize = function(gate)
    {
        gate.state = false;
        gate.oldClock = false;
    };

    this.saveData = function(gate)
    {
        return [gate.state, gate.oldClock];
    };

    this.loadData = function(gate, data)
    {
        gate.state = data[0];
        gate.oldClock = data[1];
    };
}

