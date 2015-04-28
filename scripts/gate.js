var SocketFace = {};

SocketFace.left 	= "LEFT";
SocketFace.top 		= "TOP";
SocketFace.right 	= "RIGHT";
SocketFace.bottom 	= "BOTTOM";

var LabelDisplay = {none:0, left:1, top:2, right:3, bottom:4};
var LabelStyle	 = {font:'20px Arial',color:'#000'};
var DefaultLabelDisplay = { CLOCK: LabelDisplay.left, IN:LabelDisplay.left, ICINPUT: LabelDisplay.left, OUT: LabelDisplay.right, ICOUTPUT:LabelDisplay.right };

function SocketInfo(face, offset, label)
{
	this.face = face;
	this.offset = offset;
	this.label = label;
	
	this.isLeft 	= this.face == SocketFace.left;
	this.isTop 		= this.face == SocketFace.top;
	this.isRight 	= this.face == SocketFace.right;
	this.isBottom 	= this.face == SocketFace.bottom;
	
	this.getPosition = function(gateType, x, y)
	{
		return new Pos(
			x + 
			((this.face == SocketFace.left) ? 0
			: (this.face == SocketFace.right) ? gateType.width
			: this.offset * 8),
			y +
			((this.face == SocketFace.top) ? 0
			: (this.face == SocketFace.bottom) ? gateType.height
			: this.offset * 8)
		);
	}
}

function GateType(name, width, height, inputs, outputs)
{
	this.isGateType = true;

	this.name = name;

	this.width = width;
	this.height = height;
	
	this.inputs = inputs;
	this.outputs = outputs;
	
}

GateType.prototype.func = function(gate, inputs)
{
		return [false];
};
	
GateType.prototype.initialize = function(gate)
{
};
	
GateType.prototype.click = function(gate)
{
};
	
GateType.prototype.mouseDown = function(gate)
{
};
	
GateType.prototype.mouseUp = function(gate)
{
};

GateType.prototype.saveData = function(gate)
{
		return null;
};

GateType.prototype.loadData = function(gate, data)
{
};
	
GateType.prototype.socketAt = function(x, y, px, py){
		var pos,j;
		for (j = 0; j < this.inputs.length; ++ j) {
            pos = this.inputs[j].getPosition(this, x, y);
			if (pos.x==px && pos.y==py)
				return this.inputs[j];
		}
		
		for (j = 0; j < this.outputs.length; ++ j) {
            pos = this.outputs[j].getPosition(this, x, y);
			if (pos.x==px && pos.y==py)
				return this.outputs[j];
		}
                  
		return null;
};
	
GateType.prototype.setLabel = function(label)
{
	GateType.prototype.type.name = label;
};
	
GateType.prototype.renderLabel = function(context,x,y,label, align)
{
		context.save();
		context.font= LabelStyle.font;
		context.fillStyle = LabelStyle.color;
		
		var spc = context.measureText('.').width;
		switch(align){
			case LabelDisplay.left:
				context.textBaseline = 'middle';
				context.fillText(label, x-context.measureText(label).width-spc, y+this.height/2 );
				break;
			case LabelDisplay.top:
				context.textBaseline = 'bottom';
				context.fillText(label, x+(this.width-context.measureText(label).width)/2, y-spc );
				break;
			case LabelDisplay.right:
				context.textBaseline = 'middle';
				context.fillText(label, x+this.width+spc, y+this.height/2 );
				break;
			case LabelDisplay.bottom:
				context.textBaseline = 'top';
				context.fillText(label, x+(this.width-context.measureText(label).width)/2, y+this.height+spc );
		}
		
		context.restore();
};
	
GateType.prototype.render = function(context, x, y, gate)
{
		context.strokeStyle = "#000000";
		context.lineWidth = 2;
		
		for (var i = 0; i < this.inputs.length + this.outputs.length; ++ i)
		{
			var inp = (i < this.inputs.length ? this.inputs[i] : this.outputs[i - this.inputs.length]);
			var start = inp.getPosition(this, x, y);
			var end = inp.getPosition(this, x, y);
			
			if (inp.face == SocketFace.left || inp.face == SocketFace.right)
				end.x = x + this.width / 2;
			else
				end.y = y + this.height / 2;
				
			context.beginPath();
			context.moveTo(start.x, start.y);
			context.lineTo(end.x, end.y);
			context.stroke();
			context.closePath();
		}
}


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


CustomIC.prototype = Object.create(GateType.prototype);
CustomIC.prototype.constructor = CustomIC
function CustomIC(name, environment)
{
	var envInputs = environment.getInputs();
	var envOutputs = environment.getOutputs();

	var inputs = [];
	var outputs = [];

	this.ctorname = arguments.callee.name;

	this.environment = environment;
	
	for (var i = 0; i < envInputs.length; ++ i) {
		var input = envInputs[i];
		inputs[i] = new SocketInfo(SocketFace.left, 2 + i * 2, "I" + i)
	}

	for (i = 0; i < envOutputs.length; ++ i) {
		input = envOutputs[i];
		outputs[i] = new SocketInfo(SocketFace.right, 2 + i * 2, "O" + i)
	}

	GateType.call(this, name, 64,
		Math.max(32, 16 * (Math.max(envInputs.length, envOutputs.length) + 1)),
		inputs, outputs);

	this.initialize = function(gate)
	{
		gate.environment = this.environment.clone();
	};

	this.func = function(gate, inputs)
	{
		var ins = gate.environment.getInputs();
		for (var i = 0; i < ins.length; ++ i) {
			ins[i].value = inputs[i];
		}

		gate.environment.step();

		var vals = [];
		var outs = gate.environment.getOutputs();
		for (i = 0; i < outs.length; ++ i) {
			vals[i] = outs[i].value;
		}

		return vals;
	};

	this.render = function(context, x, y, gate)
	{
		GateType.prototype.render.call(this, context, x, y, gate);

		context.strokeStyle = "#000000";
		context.fillStyle = "#ffffff";
		context.lineWidth = 3;

		context.beginPath();
		context.rect(x + 9.5, y + 1.5, this.width - 19, this.height - 3);
		context.fill();
		context.stroke();
		context.closePath();

		context.fillStyle = "#000000";
		context.font = "bold 16px sans-serif";
		context.textAlign = "center";
		context.textBaseline = "middle";

		var width = context.measureText(this.name).width;

		if (this.width - 16 > this.height) {
			context.fillText(this.name, x + this.width / 2, y + this.height / 2, this.width - 24);
		} else {
			context.save();
			context.translate(x + this.width / 2, y + this.height / 2);
			context.rotate(Math.PI / 2);
			context.fillText(this.name, 0, 0, this.height - 12);
			context.restore();
		}

		context.textAlign = "left";
		context.textBaseline = "alphabetic";
	}
}

BufferGate.prototype = Object.create(DefaultGate.prototype);
BufferGate.prototype.constructor = BufferGate;

function BufferGate()
{
	DefaultGate.call(this, "BUF", images.buffer, false,
		[
			new SocketInfo(SocketFace.left, 2, "A")
		],
		[
			new SocketInfo(SocketFace.right, 2, "Q")
		]
	);
	
	this.func = function(gate, inputs)
	{
		return [inputs[0]];
	};
}

AndGate.prototype = Object.create(DefaultGate.prototype);
AndGate.prototype.constructor = AndGate;
function AndGate()
{
	DefaultGate.call(this, "AND", images.and, false,
		[
			new SocketInfo(SocketFace.left, 1, "A"),
			new SocketInfo(SocketFace.left, 3, "B")
		],
		[
			new SocketInfo(SocketFace.right, 2, "Q")
		]
	);
	
	this.func = function(gate, inputs)
	{
		return [inputs[0] && inputs[1]];
	};
}

OrGate.prototype = Object.create(DefaultGate.prototype);
OrGate.prototype.constructor = OrGate;
function OrGate()
{
	DefaultGate.call(this, "OR", images.or, false,
		[
			new SocketInfo(SocketFace.left, 1, "A"),
			new SocketInfo(SocketFace.left, 3, "B")
		],
		[
			new SocketInfo(SocketFace.right, 2, "Q")
		]
	);
	
	this.func = function(gate, inputs)
	{
		return [inputs[0] || inputs[1]];
	}
}

XorGate.prototype = Object.create(DefaultGate.prototype);
XorGate.prototype.constructor = XorGate;
function XorGate()
{
	DefaultGate.call(this, "XOR", images.xor, false,
		[
			new SocketInfo(SocketFace.left, 1, "A"),
			new SocketInfo(SocketFace.left, 3, "B")
		],
		[
			new SocketInfo(SocketFace.right, 2, "Q")
		]
	);
	
	this.func = function(gate, inputs)
	{
		return [inputs[0] ^ inputs[1]];
	};
}
 
NotGate.prototype = Object.create(DefaultGate.prototype);
NotGate.prototype.constructor = NotGate;
function NotGate()
{
	DefaultGate.call(this, "NOT", images.not, false,
		[
			new SocketInfo(SocketFace.left, 2, "A")
		],
		[
			new SocketInfo(SocketFace.right, 2, "Q")
		]
	);
	
	this.func = function(gate, inputs)
	{
		return [!inputs[0]];
	};
}

NandGate.prototype = Object.create(DefaultGate.prototype);
NandGate.prototype.constructor = NandGate;
function NandGate()
{
	DefaultGate.call(this, "NAND", images.nand, false,
		[
			new SocketInfo(SocketFace.left, 1, "A"),
			new SocketInfo(SocketFace.left, 3, "B")
		],
		[
			new SocketInfo(SocketFace.right, 2, "Q")
		]
	);
	
	this.func = function(gate, inputs)
	{
		return [!inputs[0] || !inputs[1]];
	};
}

NorGate.prototype = Object.create(DefaultGate.prototype);
NorGate.prototype.constructor = NorGate;
function NorGate()
{
	DefaultGate.call(this, "NOR", images.nor, false,
		[
			new SocketInfo(SocketFace.left, 1, "A"),
			new SocketInfo(SocketFace.left, 3, "B")
		],
		[
			new SocketInfo(SocketFace.right, 2, "Q")
		]
	);
	
	this.func = function(gate, inputs)
	{
		return [!inputs[0] && !inputs[1]];
	};
}

XnorGate.prototype = Object.create(DefaultGate.prototype);
XnorGate.prototype.constructor = XnorGate;
function XnorGate()
{
	DefaultGate.call(this, "XNOR", images.xnor, false,
		[
			new SocketInfo(SocketFace.left, 1, "A"),
			new SocketInfo(SocketFace.left, 3, "B")
		],
		[
			new SocketInfo(SocketFace.right, 2, "Q")
		]
	);
	
	this.func = function(gate, inputs)
	{
		return [inputs[0] == inputs[1]];
	};
}

ConstInput.prototype = Object.create(DefaultGate.prototype);
ConstInput.prototype.constructor = ConstInput;
function ConstInput()
{
	this.onImage = images.conston;
	this.offImage = images.constoff;
	
	DefaultGate.call(this, "IN", this.onImage, true, [],
		[
			new SocketInfo(SocketFace.right, 2, "Q")
		]
	);
	
	this.initialize = function(gate)
	{
		gate.on = true;
	};
	
	this.click = function(gate)
	{
		gate.on = !gate.on;
	};
	
	this.func = function(gate, inputs)
	{
		return [gate.on];
	};

	this.saveData = function(gate)
	{
		return gate.on;
	};

	this.loadData = function(gate, data)
	{
		gate.on = data;
	};

	this.render = function(context, x, y, gate)
	{
		DefaultGate.prototype.render.call(this, context, x, y, gate);
		context.drawImage(gate == null || gate.on ? this.onImage : this.offImage, x, y);
	};
}

ClockInput.prototype = Object.create(DefaultGate.prototype);
ClockInput.prototype.constructor = ClockInput;

function ClockInput()
{
	DefaultGate.call(this, "CLOCK", images.clock, false, [],
		[
			new SocketInfo(SocketFace.right, 2, "Q")
		]
	);

	this.func = function(gate, inputs)
	{
		var period = 1000 / gate.freq;
		return [new Date().getTime() % period >= period / 2];
	};
	
	this.initialize = function(gate)
	{
		gate.freq = 1;
	};

	this.saveData = function(gate)
	{
		return gate.freq;
	};

	this.loadData = function(gate, data)
	{
		gate.freq = data;
	};
	
	this.click = function(gate)
	{
		gate.freq *= 2;
		
		if (gate.freq >= 32)
			gate.freq = 0.125;
	};
}

ToggleSwitch.prototype = Object.create(DefaultGate.prototype);
ToggleSwitch.prototype.constructor = ToggleSwitch;

function ToggleSwitch()
{
	this.openImage = images.switchopen;
	this.closedImage = images.switchclosed;

	DefaultGate.call(this, "TSWITCH", this.openImage, true,
		[
			new SocketInfo(SocketFace.left, 2, "A")
		],
		[
			new SocketInfo(SocketFace.right, 2, "Q")
		]
	);
	
	this.func = function(gate, inputs)
	{
		return [!gate.open && inputs[0]];
	};
	
	this.initialize = function(gate)
	{
		gate.open = true;
	};
	
	this.click = function(gate)
	{
		gate.open = !gate.open;
	};

	this.saveData = function(gate)
	{
		return gate.open;
	};

	this.loadData = function(gate, data)
	{
		gate.open = data;
	};
	
	this.render = function(context, x, y, gate)
	{
		DefaultGate.prototype.render.call(this, context, x, y, gate);
		context.drawImage(gate == null || gate.open ? this.openImage : this.closedImage, x, y);
	};
}

PushSwitchA.prototype = Object.create(DefaultGate.prototype);
PushSwitchA.prototype.constructor = PushSwitchA;

function PushSwitchA()
{
	this.openImage = images.pushswitchaopen;
	this.closedImage = images.pushswitchaclosed;

	DefaultGate.call(this, "PSWITCHA", this.openImage, true,
		[
			new SocketInfo(SocketFace.left, 2, "A")
		],
		[
			new SocketInfo(SocketFace.right, 2, "Q")
		]
	);
	
	this.func = function(gate, inputs)
	{
		return [!gate.open && inputs[0]];
	};
	
	this.initialize = function(gate)
	{
		gate.open = true;
	};
	
	this.mouseDown = function(gate)
	{
		gate.open = false;
	};
	
	this.mouseUp = function(gate)
	{
		gate.open = true;
	};
	
	this.render = function(context, x, y, gate)
	{
		DefaultGate.prototype.render.call(this, context, x, y, gate);
		context.drawImage(gate == null || gate.open ? this.openImage : this.closedImage, x, y);
	};
}

PushSwitchB.prototype = Object.create(DefaultGate.prototype);
PushSwitchB.prototype.constructor = PushSwitchB;

function PushSwitchB()
{
	this.openImage = images.pushswitchbopen;
	this.closedImage = images.pushswitchbclosed;

	DefaultGate.call(this, "PSWITCHB", this.closedImage, true,
		[
			new SocketInfo(SocketFace.left, 2, "A")
		],
		[
			new SocketInfo(SocketFace.right, 2, "Q")
		]
	);
	
	this.func = function(gate, inputs)
	{
		return [!gate.open && inputs[0]];
	};
	
	this.initialize = function(gate)
	{
		gate.open = false;
	};
	
	this.mouseDown = function(gate)
	{
		gate.open = true;
	};
	
	this.mouseUp = function(gate)
	{
		gate.open = false;
	};
	
	this.render = function(context, x, y, gate)
	{
		DefaultGate.prototype.render.call(this, context, x, y, gate);
		context.drawImage(gate != null && gate.open ? this.openImage : this.closedImage, x, y);
	};
}

OutputDisplay.prototype = Object.create(DefaultGate.prototype);
OutputDisplay.prototype.constructor = OutputDisplay;

function OutputDisplay()
{
	this.onImage = images.outon;
	this.offImage = images.outoff;

	DefaultGate.call(this, "OUT", this.onImage, true,
		[
			new SocketInfo(SocketFace.left, 2, "A")
		],
		[]
	);

	
	this.func = function(gate, inputs)
	{
		gate.on = inputs[0];
		return [];
	};
	
	this.initialize = function(gate)
	{
		gate.on = false;
	};
	
	this.render = function(context, x, y, gate)
	{
		DefaultGate.prototype.render.call(this, context, x, y, gate);
		context.drawImage(gate == null || !gate.on ? this.offImage : this.onImage, x, y);
	};
}

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

Encoder.prototype = Object.create(DefaultGate.prototype);
Encoder.prototype.constructor = Encoder;

function Encoder()
{
	var inputs = [];
	for (var i = 0; i < 9; ++ i)
		inputs[i] = new SocketInfo(SocketFace.left, 2 + i * 2, "I" + i);

	var outputs = [];
	for (i = 0; i < 4; ++ i)
		outputs[i] = new SocketInfo(SocketFace.right, 4 + i * 4, "O" + i);

	DefaultGate.call(this, "ENCODER", images.encoder, false, inputs, outputs);
	
	this.func = function(gate, inp)
	{
		var val = 0;
		for (var i = 8; i >= 0; -- i)
		{
			if (inp[i])
			{
				val = i + 1;
				break;
			}
		}

		var out = [];
		for (i = 0; i < 4; ++ i)
			out[i] = (val & (1 << i)) != 0;

		return out;
	};
}

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

function Gate(gateType, x, y, lbl, dply, noInit)
{
	var myOutputs = [];
	var myNextOutputs = [];
	var myInLinks = [];
	
	this.type = gateType;
	this.x = x;
	this.y = y;
	
	this.label = lbl ? lbl : "";
	
	this.displayLabel = dply ? dply : (DefaultLabelDisplay[gateType.name] ? DefaultLabelDisplay[gateType.name]: LabelDisplay.top);
	
	if (noInit == null) noInit = false;
	
	this.isMouseDown = false;
	
	this.width = this.type.width;
	this.height = this.type.height;
	
	this.inputs = this.type.inputs;
	this.outputs = this.type.outputs;
	
	this.selected = false;

	for (var i = 0; i < this.type.inputs.length; ++i)
		myInLinks[i] = null;
	
	for (i = 0; i < this.type.outputs.length; ++i)
		myOutputs[i] = false;

	this.clone = function(shallow)
	{
		if (shallow == null) shallow = false;

		var copy = new Gate(this.type, this.x, this.y, this.label, this.displayLabel, shallow);
		
		if (!shallow) copy.loadData(this.saveData());
		
		return copy;
	};
	
	this.getRect = function(gridSize)
	{
		if (!gridSize)
			gridSize = 1;
	
		var rl = Math.round(this.x);
		var rt = Math.round(this.y);
		var rr = Math.round(this.x + this.width);
		var rb = Math.round(this.y + this.height);
		
		rl = Math.floor(rl / gridSize) * gridSize;
		rt = Math.floor(rt / gridSize) * gridSize;
		rr = Math.ceil(rr / gridSize) * gridSize;
		rb = Math.ceil(rb / gridSize) * gridSize;
		
		return new Rect(rl, rt, rr - rl, rb - rt);
	};
	
	this.linkInput = function(gate, output, input)
	{
		var index = this.inputs.indexOf(input);
		myInLinks[index] = new Link(gate, output);
	};
	
	this.isLinked = function(gate)
	{
		for (var i = 0; i < this.inputs.length; ++ i)
			if (myInLinks[i] != null && myInLinks[i].gate == gate)
				return true;
		
		return false;
	};
	
	// added in order to build expression tree 
	this.getLinkableInputs = function()
	{
		return myInLinks;
	};
	
	this.unlinkAll = function()
	{
		for (var i = 0; i < this.inputs.length; ++ i)
			myInLinks[i] = null;
	};
	
	this.unlinkGate = function(gate)
	{
		for (var i = 0; i < this.inputs.length; ++ i)
			if (myInLinks[i] != null && myInLinks[i].gate == gate)
				myInLinks[i] = null;
	};
	
	this.unlinkInput = function(input)
	{
		var index = this.inputs.indexOf(input);
		myInLinks[index] = null;
	};

	this.getOutputs = function()
	{
		return myOutputs;
	};
	
	this.setOutputs = function(outputs)
	{
		myOutputs = outputs;
	};

	this.getOutput = function(output)
	{
		var index = this.outputs.indexOf(output);
		return myOutputs[index];
	};
	
	this.click = function()
	{
		this.type.click(this);
	};
	
	this.mouseDown = function()
	{
		this.isMouseDown = true;
		this.type.mouseDown(this);
	};
	
	this.mouseUp = function()
	{
		this.isMouseDown = false;
		this.type.mouseUp(this);
	};
	
	this.step = function()
	{
		var inVals = [];
	
		for (var i = 0; i < this.inputs.length; ++ i)
		{
			var link = myInLinks[i];
			inVals[i] = (myInLinks[i] == null)
				? false : link.getValue();
		}
		
		myNextOutputs = this.type.func(this, inVals);
	};
	
	this.willChange = function()
	{
		return !myOutputs.sameValues(myNextOutputs);
	};
	
	this.commit = function()
	{
		myOutputs = myNextOutputs;
	};

	this.saveData = function()
	{
		return this.type.saveData(this);
	};

	this.loadData = function(data)
	{
		this.type.loadData(this, data);
	};
	
	this.render = function(context, offset, selectClr)
	{
		if (this.selected) {
			var rect = this.getRect();

			if (selectClr == null) selectClr = "#6666FF";

			context.globalAlpha = 0.5;
			context.fillStyle = selectClr;
			context.fillRect(rect.left - 4 + offset.x, rect.top - 4 + offset.y,
				rect.width + 8, rect.height + 8);
			context.globalAlpha = 1.0;
		}

		this.type.render(context, this.x + offset.x, this.y + offset.y, this);
		
		context.strokeStyle = "#000000";
		context.lineWidth = 2;
		context.fillStyle = "#9999FF";
		
		for (var i = 0; i < this.inputs.length + this.outputs.length; ++ i) {
			var inp = (i < this.inputs.length ? this.inputs[i]
				: this.outputs[i - this.inputs.length]);
			var pos = inp.getPosition(this.type, this.x, this.y);
				
			if (i < this.inputs.length) {
				if (myInLinks[i] != null) {
					context.fillStyle = myInLinks[i].getValue() ? "#FF9999" : "#9999FF";
				} else {
					context.fillStyle = "#999999";
				}
			} else {
				context.fillStyle = myOutputs[i - this.inputs.length]
					? "#FF9999" : "#9999FF";
			}

			context.beginPath();
			context.arc(pos.x + offset.x, pos.y + offset.y, 4, 0, Math.PI * 2, true);
			context.fill();
			context.stroke();
			context.closePath();
		}
	};
	
	if (!noInit) {
		this.type.initialize(this);
	}
	
	this.shiftBy = function(dx, dy)
	{
		this.x+=dx;
		this.y+=dy;
	};
	
	this.socketAt = function(px, py){
		return this.type.socketAt(this.x, this.y, px, py);
		
	};
}
