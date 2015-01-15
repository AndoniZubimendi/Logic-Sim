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
				this.clear();
			}
		}.bind(this) ));
		grp.addItem(new Button.Tool(images.save, function() {
			Saving.save(this);
		}.bind(this) ));
		grp.addItem(new Button.Tool(images.open, function() {
			Saving.loadFromPrompt(this);
			this.centerOnCanvas();
		}.bind(this) ));

		grp.addItem(new Button.Tool(images.newic, function() {
			if (this.getOutputs().length == 0) {
				alert("At least one output required to create an integrated circuit.");
				return;
			}

			var name = prompt("Please enter a name for the new integrated circuit.", "");
			if (name == null) return;

			this.customGroup.addItem(new CustomIC(name, logicSim.clone()));
		}.bind(this) ));

		this.setDeleteBtn(
			grp.addItem(new Button.Tool(images.delete, function() {
				if (this.mode == ControlMode.deleting)
					this.setMode(ControlMode.wiring);
				else
					this.setMode(ControlMode.deleting);
		}.bind(this) )));
		
		this.setSelectBtn(
			grp.addItem(new Button.Tool(images.select, function() {
				if (this.mode == ControlMode.wiring)
					this.setMode(ControlMode.wiring);
				else
					this.setMode(ControlMode.selecting);
			}.bind(this) )));

		this.setLabelBtn(
			grp.addItem(new Button.Tool(images.label, function() {
				if (this.mode == ControlMode.labeling)
					this.setMode(ControlMode.wiring);
				else
					this.setMode(ControlMode.labeling);
		}.bind(this) )));
	
		grp.addItem(new Button.Tool(images.grid, function() {
			this.setGridType( (this.getGridType()+1)%6 );
		}.bind(this) ));

		grp.addItem(new Button.Tool(images.center, function() {
			this.centerOnCanvas();
		}.bind(this) ));

		grp.addItem(new Button.Tool(images.shrink, function() {
			if (this.toolbar.width > 160) {
				this.toolbar.width-=80;
				return;
			}
		}.bind(this) ));
		grp.addItem(new Button.Tool(images.grow, function() {
			if (this.toolbar.width < 400) {
				this.toolbar.width+=80;
				return;
			}
		}.bind(this) ));
		
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

		Saving.loadFromHash(this);
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
