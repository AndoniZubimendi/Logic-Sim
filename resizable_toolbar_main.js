function LogicSimApp()
{
	this.__proto__ = new LogicSim();

	
	this.initialize = function(canvas)
	{
		this.setCanvas(canvas);
		
		toolbar = new Toolbar(200);
		var grp = toolbar.addGroup("Tools");
		grp.addItem(new Button.Tool(images.newfile, function() {
			if (confirm("Are you sure you want to delete all existing gates, "
				+ "wires and custom circuits?")) {
				logicSim.clear();
			}
		}));
		grp.addItem(new Button.Tool(images.save, function() {
			Saving.save();
		}));
		grp.addItem(new Button.Tool(images.open, function() {
			Saving.loadFromPrompt();
		}));
		this.setDeleteBtn(
			grp.addItem(new Button.Tool(images.delete, function() {
				if (logicSim.mode == ControlMode.deleting)
					logicSim.setMode(ControlMode.wiring);
				else
					logicSim.setMode(ControlMode.deleting);
		})));
		this.setSelectBtn(
			grp.addItem(new Button.Tool(images.select, function() {
				if (logicSim.mode == ControlMode.wiring)
					logicSim.setMode(ControlMode.wiring);
				else
					logicSim.setMode(ControlMode.selecting);
			})));
		grp.addItem(new Button.Tool(images.newic, function() {
			if (logicSim.getOutputs().length == 0) {
				alert("At least one output required to create an integrated circuit.");
				return;
			}

			var name = prompt("Please enter a name for the new integrated circuit.", "");
			if (name == null) return;

			logicSim.customGroup.addItem(new CustomIC(name, logicSim.clone()));
		}));

		grp.addItem(new Button.Tool(images.grid, function() {
			logicSim.setGridType( (logicSim.getGridType()+1)%6 );
		}));

		grp.addItem(new Button.Tool(images.shrink, function() {
			if (logicSim.toolbar.width > 160) {
				logicSim.toolbar.width-=80;
				return;
			}
		}));
		grp.addItem(new Button.Tool(images.grow, function() {
			if (logicSim.toolbar.width < 400) {
				logicSim.toolbar.width+=80;
				return;
			}
		}));
		
		grp = toolbar.addGroup("Logic Gates");
		grp.addItem(new BufferGate());
		grp.addItem(new AndGate());
		grp.addItem(new OrGate());
		grp.addItem(new XorGate());
		grp.addItem(new NotGate());
		grp.addItem(new NandGate());
		grp.addItem(new NorGate());
		grp.addItem(new XnorGate());

		grp = toolbar.addGroup("Input");
		grp.addItem(new ConstInput());
		grp.addItem(new ClockInput());
		grp.addItem(new ToggleSwitch());
		grp.addItem(new PushSwitchA());
		grp.addItem(new PushSwitchB());
		grp.addItem(new ICInput());

		grp = toolbar.addGroup("Output");
		grp.addItem(new OutputDisplay());
		grp.addItem(new SevenSegDisplay());
		grp.addItem(new ICOutput());

		grp = toolbar.addGroup("Flip Flops", true);
		grp.addItem(new DFlipFlop());

		grp = toolbar.addGroup("Integrated Circuits", true);
		grp.addItem(new Encoder());
		grp.addItem(new Decoder());
		grp.addItem(new SevenSegDecoder());

		this.customGroup = toolbar.addGroup("Custom Circuits");
		
		this.setToolbar(toolbar);
		
		this.setGridSize(16);
		this.onResizeCanvas();

		Saving.loadFromHash();
	}
}

logicSim = new LogicSimApp();

window.onload = function(e)
{
	var canvas = document.getElementById("canvas");
	if (!images.allImagesLoaded()) {
		images.onAllLoaded = function()
		{
			logicSim.initialize(canvas);
			logicSim.run();
		}
	} else {
		logicSim.initialize(canvas);
		logicSim.run();
	}
}