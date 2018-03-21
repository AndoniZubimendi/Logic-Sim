function Link(gate, socket)
{
    this.gate = gate;
    this.socket = socket;

    this.getValue = function()
    {
        return this.gate.getOutput(this.socket);
    };

    this.equals = function(obj)
    {
        return this.gate == obj.gate && this.socket == obj.socket;
    };
}