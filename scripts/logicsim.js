var ControlMode = {
	wiring: 0,
	selecting: 1,
	deleting: 2,
	labeling: 3
};

var GridDefaults = {
	size:8,
	type:1,
	bgColor1: '#DDD', // '#EEC',
	bgColor2: '#CCC',
	lnColor1: '#888',
	lnColor2: '#AAA' 
};

var WiringDefaults ={
	minSocketDist: 8
};

LogicSim.prototype = Object.create(Environment.prototype);
LogicSim.prototype.constructor = LogicSim;

function LogicSim()
{
	Environment.call(this);

	var myIsDragging = false;
	var myIsSelecting = false;
	var myCanDrag = false;
	
	var myIsWiring = false;
	var myWireStart = null;
	
	var myGridSize = GridDefaults.size;
	var myGridType = GridDefaults.type;
	var myGridImage = null;
	
	var myDeleteBtn = null;
	var mySelectBtn = null;
	var myMoveBtn = null;
	var myLabelBtn = null;

	var myCtrlDown = false;

	var mySelection = new Environment();
	var myCanPlace = false;
	var myLastDragPos = null;

	var myCustoms = [];

	var myReadOnly = false;
		
	this.canvas = null;
	this.context = null;
	
	this.toolbar = null;
	
	this.popup = null;
	
	this.mouseX = 0;
	this.mouseY = 0;
	
	this.mouseDownPos = null;

	this.mode = ControlMode.wiring;
	
	// custom cursor
	var s = new Sheet();
	s.addRule('.labelingCursor','cursor: url(images/labeling.cur), url(images/labeling.png), default;');
	s.addRule('.deletingCursor','cursor: url(images/deleting.cur), url(images/deleting.png), default;');
	s.addRule('.selectingCursor','cursor: url(images/selecting.cur), url(images/selecting.png), default;');
	
	this.getReadOnly = function(){
		return myReadOnly;
	};
	
	this.setReadOnly = function(readOnly){
		myReadOnly = readOnly;
		if (myReadOnly){
			this.deselectAll();
			myIsDragging = false;
			myIsWiring = false;
			myIsSelecting = false;
		}
	};
	
	this.setToolbar = function(toolbar){
		this.toolbar = toolbar;
	};
	
	this.getToolbarRect = function(){
		if (this.toolbar == null) 
			return new Rect(0,0,0,0);
		return new Rect(0,0, this.toolbar.width, this.toolbar.height);
	};

	this.renderToolbar = function(context){
		if (this.toolbar !=null)
			this.toolbar.render(context);	
	};

	this.hasToolbar = function(){
		return this.toolbar != null;
	};
	
	this.coordInToolbar = function(x,y) {
		if (this.toolbar == null)
			return false;
		return (x < this.toolbar.width);
	};
	
	this.setPopupMenu = function(menu){
		this.popup = menu;
	};

	this.setDeleteBtn = function(button){
		myDeleteBtn = button;
	};
	
	this.setSelectBtn = function(button){
		mySelectBtn = button;
	};
	
	this.setLabelBtn = function(button){
		myLabelBtn = button;
	};
	
	this.setCanvas = function(canvas){
		this.canvas = canvas = $Find(canvas);
		this.context = this.canvas.getContext("2d");
		EventHandler.add(canvas, "mousedown", function (ev) { ev=EventHandler.fixMouse(ev); this.mouseDown(ev.offsetX, ev.offsetY, ev); clearDocumentSelection(); }.bind(this) );
		EventHandler.add(canvas, "mouseup"  , function (ev) { ev=EventHandler.fixMouse(ev); this.mouseUp(  ev.offsetX, ev.offsetY, ev); clearDocumentSelection(); }.bind(this) );
		EventHandler.add(canvas, "mousemove", function (ev) { ev=EventHandler.fixMouse(ev); this.mouseMove(ev.offsetX, ev.offsetY, ev); }.bind(this) );
		EventHandler.add(canvas, "click"    , function (ev) { ev=EventHandler.fixMouse(ev); this.click(    ev.offsetX, ev.offsetY, ev); clearDocumentSelection(); }.bind(this) );
		EventHandler.add(window, "keydown", function (ev) { this.keyDown(ev); }.bind(this) );
		EventHandler.add(window, "keyup"  , function (ev) { this.keyUp(  ev); }.bind(this) );
		EventHandler.add(window, "resize" , function (ev) { this.onResizeCanvas(); }.bind(this) );
		EventHandler.add(canvas, "contextmenu", function (ev) { EventHandler.preventDefault(ev); });		
	};

	this.getCanvas = function(){
		return this.canvas;
	};
	
	this.initialize = function(canvas)
	{
		this.setCanvas(canvas);
		this.updateGridImage();
	};
		
	this.startDragging = function(gateType)
	{
		mySelection.clear();

		if (gateType != null) {
			this.deselectAll();

			var gate = new Gate(gateType, 0, 0);
			gate.selected = true;

			mySelection.placeGate(gate);
		} else {
			var pos = this.mouseDownPos;

			for (var i = this.gates.length - 1; i >= 0; i--) {
				gate = this.gates[i];
				if (!gate.selected) continue;

				if (myCtrlDown) {
					gate.selected = false;
					var data = gate.saveData();
					gate = new Gate(gate.type, gate.x, gate.y, gate.label, gate.displayLabel);
					gate.loadData(data);
					gate.selected = true;
				} else {
					this.removeGate(gate);
				}

				gate.x -= pos.x;
				gate.y -= pos.y;

				mySelection.placeGate(gate);
			}

			var wires = this.getAllWires();
			var toRemove = [];
			for (i = 0; i < wires.length; ++ i) {
				var wire = wires[i];
				if (!wire.selected) continue;

				if (myCtrlDown) {
					wire.selected = false;
				} else {
					toRemove.push(wire);
				}

				mySelection.placeWire(wire.start.sub(pos), wire.end.sub(pos), true);
			}

			if (!myCtrlDown) {
				this.removeWires(toRemove);
			}
		}

		myIsDragging = true;
	};

	this.getDraggedPosition = function()
	{
		// / var snap = myGridSize / 2;
		var snap = WiringDefaults.minSocketDist;

		for (var i = this.gates.length - 1; i >= 0; i--) {
			var gate = this.gates[i];
			if (gate.selected) {
				snap = myGridSize;
				break;
			}
		}

		if (mySelection.gates.length > 0) {
			snap = myGridSize;
		}

		return new Pos(
			Math.round(this.mouseX / snap) * snap,
			Math.round(this.mouseY / snap) * snap
		);
	};

	this.getSelectedRect = function()
	{
		var start =  this.mouseDownPos == null ? new Pos(-1, -1) : new Pos(this.mouseDownPos.x, this.mouseDownPos.y);

		var end = this.getDraggedPosition();

		if (end.x < start.x) {
			var temp = end.x;
			end.x = start.x;
			start.x = temp;
		}

		if (end.y < start.y) {
			temp = end.y;
			end.y = start.y;
			start.y = temp;
		}

		return new Rect(start.x, start.y, end.x - start.x, end.y - start.y);
	};
	
	this.stopDragging = function()
	{
		myIsDragging = false;
		if (myReadOnly) return;
		var dragPos = this.getDraggedPosition();
		
		if (! this.coordInToolbar(dragPos.x, dragPos.y) ) {
			if (myCanPlace) {
				this.tryMerge(mySelection, dragPos, true);
				this.changed();
			} else {
				this.tryMerge(mySelection, this.mouseDownPos, true);
			}
		}
		else {
			this.changed();
		}

		mySelection.clear();
	};

	this.setMode = function(mode)
	{
		if (myReadOnly) return;
		
		// manage labeling cursor
		if (mode != this.mode){
			this.canvas.clearClass();
			switch(mode){
				case ControlMode.selecting: this.canvas.addClass('selectingCursor');
					 break;
				case ControlMode.deleting: this.canvas.addClass('deletingCursor');
					 break;
				case ControlMode.labeling: this.canvas.addClass('labelingCursor');
					 break;
			}	
		}
		
		if (mode == ControlMode.deleting) {
			var deleted = false;
			for (var i = this.gates.length - 1; i >= 0; i--) {
				var gate = this.gates[i];
				if (gate.selected) {
					deleted = true;
					this.removeGate(gate);
				}
			}

			var wires = this.getAllWires();
			var toRemove = [];
			for (i = wires.length - 1; i >= 0; i--) {
				var wire = wires[i];
				if (wire.selected) {
					deleted = true;
					toRemove.push(wire);
				}
			}
			this.removeWires(toRemove);

			if (deleted) {
				mode = ControlMode.wiring;
				this.canvas.clearClass();
				this.changed();
			}
		}

		this.mode = mode;

		if (this.hasToolbar()){
			if (myDeleteBtn)
				myDeleteBtn.selected = mode == ControlMode.deleting;
			if (mySelectBtn)
				mySelectBtn.selected = mode == ControlMode.selecting;
			if (myLabelBtn)
				myLabelBtn.selected  = mode == ControlMode.labeling;
		}
	};

	this.startWiring = function(x, y)
	{
		var snap = WiringDefaults.minSocketDist;
	
		myIsWiring = true;
		myWireStart = new Pos(
			Math.round(x / snap) * snap,
			Math.round(y / snap) * snap
		);
	};
	
	this.stopWiring = function(x, y)
	{
		if (this.canPlaceWire(new Wire(myWireStart, this.getWireEnd()))) {
			this.deselectAll();
			this.placeWire(myWireStart, this.getWireEnd());
			this.changed();
		}

		myIsWiring = false;
	};

	this.cancelWiring = function()
	{
		myIsWiring = false;
	};
	
	this.getWireEnd = function()
	{
		var snap = WiringDefaults.minSocketDist;
		
		var pos = new Pos(
			Math.round(this.mouseX / snap) * snap,
			Math.round(this.mouseY / snap) * snap
		);
		
		var diff = pos.sub(myWireStart);
		
		if (Math.abs(diff.x) >= Math.abs(diff.y)) {
			pos.y = myWireStart.y;
		} else {
			pos.x = myWireStart.x;
		}

		return pos;
	};
	
	this.gateRect = function(gate) {
		var szx = 8, szy = 4;
		return new Rect(gate.x + szx, gate.y + szy, gate.width - 2*szx, gate.height - 2*szy);
	};
	
	this.mouseMove = function(x, y, e)
	{
		this.mouseX = x;
		this.mouseY = y;

		myCtrlDown = e.ctrlKey;

		if (e.shiftKey) this.setMode(ControlMode.selecting);
		else if (this.mode == ControlMode.selecting) this.setMode(ControlMode.wiring);
		
		if (this.toolbar != null)
			this.toolbar.mouseMove(x, y);

			
		var dist = myGridSize;
				
		if (!myIsDragging && !myIsSelecting && myCanDrag && this.mouseDownPos != null) {
			var diff = new Pos(x, y).sub(this.mouseDownPos);
			if (Math.abs(diff.x) >= dist || Math.abs(diff.y) >= dist)
				this.startDragging();
		} else if (myIsDragging) {
			var pos = this.getDraggedPosition();

			if (myLastDragPos == null || !pos.equals(myLastDragPos)) {
				var env = this.clone();
				myCanPlace = !myReadOnly && env.tryMerge(mySelection, pos, false, true);
				myLastDragPos = pos;
			}
		}

	};
	
	this.mouseDown = function(x, y, e)
	{
		var pos;
		
		this.mouseX = x;
		this.mouseY = y;

		myCtrlDown = e.ctrlKey;

		if (e.shiftKey) this.setMode(ControlMode.selecting);
		else if (this.mode == ControlMode.selecting) this.setMode(ControlMode.wiring);
		
		this.mouseDownPos = this.getDraggedPosition();
		
		myCanDrag = false;
		
		if (e.which!=1) return;
		
		if (this.coordInToolbar(x,y)) {
			this.toolbar.mouseDown(x, y);
		} else {
			var canSelect = this.mode == ControlMode.selecting;
			//pos = new Pos(x, y);
			pos = this.mouseDownPos;
			for (var i = 0; i < this.gates.length; ++ i) {
				var gate = this.gates[i];
				var rect = this.gateRect(gate);
				if (rect.contains(pos)) {
					gate.mouseDown();
					if (myReadOnly) return;
					
					switch(this.mode){
						case ControlMode.selecting:
							gate.selected = !gate.selected;
							canSelect = false;
							break;
						case ControlMode.wiring:
							if (! gate.selected) {
								this.deselectAll();
								gate.selected = true;
							}
							myCanDrag = true;
							return;
						case ControlMode.labeling:
							var lbl = prompt("Type a label ", gate.label);
							if (lbl != null) 
								gate.label = lbl;
							return;
						
					}
					
				}
			}
			
			if (myReadOnly) return;
			

			pos = this.mouseDownPos;

			for (i = 0; i < this.wireGroups.length; ++ i) {
				var group = this.wireGroups[i];
				if (group.crossesPos(pos)) {
					var wire = group.getWireAt(pos);

					if (this.mode == ControlMode.selecting) {
						wire.selected = !wire.selected;
						canSelect = false;
					} else if (this.mode == ControlMode.wiring) {
						if (!wire.selected) {
							this.deselectAll();
							wire.selected = true;
						} else {
							myCanDrag = true;
							return;
						}					
					}
					
				}
			}
			
			if (canSelect) {
				myIsSelecting = true;
			} else if (this.mode == ControlMode.wiring && !myIsWiring) {
						this.startWiring(pos.x, pos.y);
			}
		}
	};
	
	this.mouseUp = function(x, y, e)
	{
		this.mouseX = x;
		this.mouseY = y;

		myCtrlDown = e.ctrlKey;

		
		if (e.shiftKey) this.setMode(ControlMode.selecting);
		else if (this.mode == ControlMode.selecting) this.setMode(ControlMode.wiring);
		

		if (myIsDragging) {
			this.stopDragging();
		} else if (myIsWiring) {
			if (e.which==1){
				var endPos = this.getWireEnd();
				var keepWiring = !myWireStart.equals(endPos) && this.canPlaceWire(new Wire(myWireStart, endPos)) && !this.canConnectToSocket(endPos);

				this.stopWiring();
				if (keepWiring)
					this.startWiring(endPos.x, endPos.y);
			} else {
				this.cancelWiring();
			}
			
		} else if (myIsSelecting) {
			myIsSelecting = false;

			var rect = this.getSelectedRect();

			for (var i = 0; i < this.gates.length; ++ i) {
				if (this.gates[i].getRect().intersects(rect)) {
					this.gates[i].selected = true;
				}
			}

			var wires = this.getAllWires();
			for (i = 0; i < wires.length; ++ i) {
				if (rect.intersectsWire(wires[i])) {
					wires[i].selected = true;
				}
			}
		} else if (this.coordInToolbar(x,y)) {
			if (e.which==1)
				this.toolbar.mouseUp(x, y);
		} else {
			var pos = new Pos(x, y);
			
			if (e.which==1){

				var deleted = false;
			
				for (i = 0; i < this.gates.length; ++ i) {
					var gate = this.gates[i];
					
					if (gate.isMouseDown) {
						rect = this.gateRect(gate);
						if (rect.contains(pos)) {
							if (!myReadOnly && this.mode == ControlMode.deleting && !deleted) {
								this.removeGate(gate);
								deleted = true;
							} else {
								gate.click();
							}
						}
						
						gate.mouseUp();
					}
				}
			
				if (!myReadOnly && this.mode == ControlMode.deleting && !deleted) {
					// /var gsize = myGridSize;
					var gsize = WiringDefaults.minSocketDist;
					pos.x = Math.round(pos.x / gsize) * gsize;
					pos.y = Math.round(pos.y / gsize) * gsize;
					
					if (this.mouseDownPos.equals(pos)) {
						for (i = 0; i < this.wireGroups.length; ++ i) {
							var group = this.wireGroups[i];
							if (group.crossesPos(pos)) {
								var wire = group.getWireAt(pos);
								this.removeWire(wire);
								break;
							}
						}
					}
				}
				if (deleted)
					this.changed();
			} else 	{			
				if (e.which==3 && this.popup) {
					for (i = 0; i < this.gates.length; ++ i) {
                        gate = this.gates[i];
						rect = this.gateRect(gate);
						
						if (rect.contains(pos)) {
							this.popup.show(e, gate);
							break;
						}
					}							
				}
			}			
		}

		this.mouseDownPos = null;
	};
	
	this.click = function(x, y, e)
	{
		this.mouseX = x;
		this.mouseY = y;

		myCtrlDown = e.ctrlKey;

		if (e.shiftKey) this.setMode(ControlMode.selecting);
		else if (this.mode == ControlMode.selecting) this.setMode(ControlMode.wiring);
		
		if (this.coordInToolbar(x,y)) {
			this.toolbar.click(x, y);
		}
	};
	
	this.keyDown = function(e)
	{
		if (!myReadOnly){
			if (e.keyCode == 46) this.setMode(ControlMode.deleting);
			if (e.keyCode == 16) this.setMode(ControlMode.selecting);
			if (e.keyCode == 17) myCtrlDown = true;
			if (e.keyCode == 27) myIsWiring = false;
		}

		if (e.keyCode == 83 && e.ctrlKey) {
			Saving.save();
			e.preventDefault();
		}

		if (e.keyCode == 79 && e.ctrlKey) {
			Saving.loadFromPrompt();
			e.preventDefault();
		}
	};
	
	this.keyUp = function(e)
	{
		if ((e.keyCode == 46 && this.mode == ControlMode.deleting)
			|| (e.keyCode == 16 && this.mode == ControlMode.selecting))
			this.setMode(ControlMode.wiring);

		if (e.keyCode == 17) myCtrlDown = false;
	};

	this.getGridSize = function()
	{
		return myGridSize;
	};

	this.setGridType = function (type){
		myGridType = type;
		this.updateGridImage();
	};
	
	this.getGridType = function (){
		return myGridType;
	};
	
	this.updateGridImage = function()
	{
		myGridImage = document.createElement("canvas");
		
		var context = myGridImage.getContext("2d");
		
		switch (myGridType) {
			case 1:
				myGridImage.width = myGridImage.height = myGridSize * 2;
				context.fillStyle = GridDefaults.bgColor2;
				context.fillRect(0, 0, myGridSize * 2, myGridSize * 2);
				context.fillStyle = GridDefaults.bgColor1;
				context.fillRect(0, 0, myGridSize, myGridSize);
				context.fillRect(myGridSize, myGridSize, myGridSize, myGridSize);
				break;
			case 2: 
				myGridImage.width = myGridImage.height = myGridSize;
				context.fillStyle = GridDefaults.bgColor1;
				context.fillRect(0, 0, myGridSize, myGridSize);
				context.fillStyle = GridDefaults.lnColor1;
				context.fillRect(myGridSize-1, myGridSize-1,1,1);
				break;
			case 3: 
				myGridImage.width = myGridImage.height = myGridSize;
				var pos=myGridSize-1;
				var lng=1.5;
				context.fillStyle = GridDefaults.bgColor1;
				context.fillRect(0, 0, myGridSize, myGridSize);
				context.strokeStyle = GridDefaults.lnColor2;
				context.beginPath();
				context.moveTo(pos-lng,pos+0.5);
				context.lineTo(pos+0.5,pos+0.5);
				context.lineTo(pos+0.5,pos-lng);
				context.moveTo(0, pos+0.5);
				context.lineTo(lng, pos+0.5);
				context.moveTo(pos+0.5, 0);
				context.lineTo(pos+0.5, lng);
				context.stroke();
				break;
			case 4: 
				myGridImage.width = myGridImage.height = myGridSize;
				pos=myGridSize-1;
				context.fillStyle = GridDefaults.bgColor1;
				context.fillRect(0, 0, myGridSize, myGridSize);
				context.strokeStyle = GridDefaults.lnColor2;
				context.beginPath();
				context.moveTo(0,pos+0.5);
				context.lineTo(myGridSize,pos+0.5);
				context.moveTo(pos+0.5,0);
				context.lineTo(pos+0.5,myGridSize);
				context.stroke();
				break;
			case 5: 
				myGridImage.width = myGridImage.height = myGridSize;
				pos=myGridSize-1;
				context.fillStyle = GridDefaults.bgColor1;
				context.fillRect(0, 0, myGridSize, myGridSize);
				context.strokeStyle = GridDefaults.lnColor1;
				context.setLineDash([1,1]);
				context.beginPath();
				context.moveTo(0,pos+0.5);
				context.lineTo(myGridSize,pos+0.5);
				context.moveTo(pos+0.5,0);
				context.lineTo(pos+0.5,myGridSize);
				context.stroke();
				break;
			default: // 0 or other => no grid
				myGridImage.width = myGridImage.height = myGridSize;
				context.fillStyle = GridDefaults.bgColor1;
				context.fillRect(0, 0, myGridSize, myGridSize);
		}
	};
	
	this.getArea = function () {
		var area = (this.gates.length > 0) ? new Rect(this.gates[0].x, this.gates[0].y, this.gates[0].width, this.gates[0].height) : new Rect(0,0,0,0);
		for (var i = 1; i < this.gates.length; ++i) {
			area.union(this.gates[i].getRect());
		}
		for (var j=0;j<this.wireGroups.length; j++){
			var wires = this.wireGroups[j].getWires();
			for (i = 0; i < wires.length; i++) {
				area.union(wires[i].start);
				area.union(wires[i].end);
			}
		}

		return area; 
	};
	
	this.shiftBy = function(dx,dy){
		var gs = this.getGridSize();
		dx = Math.floor( dx/gs )*gs;
		dy = Math.floor( dy/gs )*gs;
		
		for (var i = 0; i < this.gates.length; i++) {
			this.gates[i].shiftBy(dx, dy);
		}

		for (var j=0;j<this.wireGroups.length; j++){
			this.wireGroups[j].shiftBy(dx, dy);
		}
	};

	this.moveTo = function(x,y){
		var area = this.getArea();
		this.shiftBy(x-area.x, y-area.y);
	};

	this.centerOnCanvas = function(){
		var area = this.getArea();
		var tbW= this.toolbar ? this.toolbar.width : 0;
		var x = (this.canvas.width - tbW - area.width)/2;
		var y = (this.canvas.height - area.height)/2;
		this.shiftBy(x-area.x+tbW, y-area.y);
	};
	
	this.onResizeCanvas = function(){	
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		if (this.toolbar)
			this.toolbar.height = window.innerHeight;
		this.centerOnCanvas();
	};
	
	this.run = function(simFreq)
	{
		setInterval(this.mainLoop, 1000.0 / ( !simFreq ? 60.0 : simFreq ), this);
	};
	
	this.mainLoop = function(self)
	{
		for (var i = 0; i < 4; ++ i) {
			self.step();
		}

		var rect = self.getToolbarRect();
		self.context.fillStyle = self.context.createPattern(myGridImage, "repeat");
		self.context.fillRect(rect.width, 0, self.canvas.width - rect.width, self.canvas.height);
		
		self.render(self.context);
		
		if (myIsDragging) {
			var pos = self.getDraggedPosition();
			mySelection.render(self.context, pos, myCanPlace ? "#6666ff" : "#ff6666");
		} else if (myIsWiring) {		
			var end = self.getWireEnd();
		
			self.context.strokeStyle = self.canPlaceWire(new Wire(myWireStart, self.getWireEnd()))
				? "#009900" : "#990000";
			self.context.lineWidth = 2;
			self.context.beginPath();
			self.context.moveTo(myWireStart.x, myWireStart.y);
			self.context.lineTo(end.x, end.y);
			self.context.stroke();
			self.context.closePath();
		} else if (myIsSelecting) {
			rect = self.getSelectedRect();

			self.context.beginPath();
			self.context.rect(rect.x - 1, rect.y - 1,
				rect.width + 2, rect.height + 2);
			self.context.globalAlpha = 0.25;
			self.context.fillStyle = "#3333ff";
			self.context.fill();
			self.context.globalAlpha = 0.5;
			self.context.strokeStyle = "#6666ff";
			self.context.stroke();
			self.context.closePath();
			self.context.globalAlpha = 1.0;
		}
		
		self.renderToolbar(self.context);
	};
	
	// create grid pattern
	this.updateGridImage();
}
