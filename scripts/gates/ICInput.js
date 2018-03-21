ICInput.prototype = Object.create(DefaultGate.prototype);
ICInput.prototype.constuctor = ICInput;

function ICInput()
{
    DefaultGate.call(this, "ICINPUT", images.input, false,
        [],
        [
            new SocketInfo(SocketFace.right, 2, "A")
        ]
    );

    this.initialize = function(gate)
    {
        gate.value = false;
    };

    this.func = function(gate, inputs)
    {
        return [gate.value];
    };
}
