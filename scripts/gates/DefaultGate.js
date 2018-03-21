DefaultGate.prototype = Object.create(GateType.prototype);
DefaultGate.prototype.constructor = DefaultGate;

function DefaultGate(name, image, renderOverride, inputs, outputs)
{
    GateType.call(this, name, image.width, image.height, inputs, outputs);

    this.ctorname = arguments.callee.caller.getName();

    this.image = image;
    this.renderOverride = renderOverride;

}

DefaultGate.prototype.render = function(context, x, y, gate)
{
    GateType.prototype.render.call(this, context, x, y, gate);
    if (gate && gate.label && gate.displayLabel)
        this.renderLabel(context, x, y, gate.label, gate.displayLabel);
    if (!this.renderOverride) {
        context.drawImage(this.image, x, y);
    }
};
