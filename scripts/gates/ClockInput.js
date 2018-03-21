ClockInput.prototype = Object.create(DefaultGate.prototype);
ClockInput.prototype.constructor = ClockInput;

function ClockInput() {
    DefaultGate.call(this, "CLOCK", images.clock, false, [],
        [
            new SocketInfo(SocketFace.right, 2, "Q")
        ]
    );

    this.func = function (gate, inputs) {
        var period = 1000 / gate.freq;
        return [new Date().getTime() % period >= period / 2];
    };

    this.initialize = function (gate) {
        gate.freq = 1;
    };

    this.saveData = function (gate) {
        return gate.freq;
    };

    this.loadData = function (gate, data) {
        gate.freq = data;
    };

    this.click = function (gate) {
        gate.freq *= 2;

        if (gate.freq >= 32)
            gate.freq = 0.125;
    };
}
