ICOutput.prototype = Object.create(DefaultGate.prototype);
ICOutput.prototype.constructor = ICOutput;

function ICOutput()
{
    DefaultGate.call(this, "ICOUTPUT", images.output, false,
        [
            new SocketInfo(SocketFace.left, 2, "A")
        ],
        []
    );

    this.initialize = function(gate)
    {
        gate.value = false;
    };

    this.func = function(gate, inputs)
    {
        gate.value = inputs[0];
        return [];
    }
}
