ToolbarDefault = {
	width:256,
	opened: true	
};

ToolbarGroupDefault = {
	padding : 16,
	minItemWidth: 80
};

function Toolbar(width, opened)
{
	var myIsDragging = false;
	var myDragPos = null;
	var myGripSize = 11;
	var myAllowResize = true;
	var myMinWidth = width || ToolbarDefault.width;
	
	this.sepimage = {};
	this.sepimage.end = images.sepend;
	this.sepimage.mid = images.sepmid;
	
	this.arrimage = {};
	this.arrimage.down = images.arrdown;
	this.arrimage.up = images.arrup;

	this.width = width || ToolbarDefault.width;
	this.isOpen = (typeof opened !== 'undefined') ? opened : ToolbarDefault.opened;
	
	this.groups = [];
	
	EventHandler.add(document, 'mouseup', function (){this.mouseUp(0,0);}.bind(this) );
	
	this.setWidth = function(width){
		if (width > myMinWidth)
			this.width = width
		else
			this.width = myMinWidth;
	};

	this.getClientWidth = function(){
		return this.width - (myAllowResize ? myGripSize : 0);
	};
	
	this.setAllowResize = function(allow){
		myAllowResize = allow;
	};
	
	this.calcMinWidth = function (){
		var max = 0;
		for (var i=0; i<this.groups.length; i++){
			if (this.groups[i].minItemWidth > max)
				max = this.groups[i].minItemWidth;
		}
		myMinWidth = max;
	};
	
	this.addGroup = function(name, hide)
	{
		var group = new ToolbarGroup(this, name);
		this.groups.push(group);

		if (hide || !this.isOpen) group.isOpen = false;

		return group;
	};
	
	this.render = function(context)
	{		
		context.fillStyle = "#FFFFFF";
		context.fillRect(0, 0, this.width, window.innerHeight);
		
		var yPos = 0;
		for (var i = 0; i < this.groups.length; ++ i)
		{
			this.groups[i].y = yPos;
			yPos += this.groups[i].render(context);
		}
		
		context.fillStyle = "#000000";
		context.fillRect(this.width-1, 0, 1, window.innerHeight);
		
		if (myAllowResize)
			this.renderGrip(context);
	};
	
	this.renderGrip = function(context){
		
		var gx = this.width-myGripSize;
		context.strokeStyle = '#000';
		context.strokeRect(gx, 0, myGripSize-1, window.innerHeight-1);
		context.fillStyle = '#444';
		context.fillRect(gx, 1, myGripSize-1, window.innerHeight-1);
		
		context.drawImage(images.grip, (gx+this.width-images.grip.width)/2-0.0, window.innerHeight/2-1 )
		/*context.beginPath();
		context.strokeStyle = '#FFF';
		context.moveTo((gx+this.width)/2, 1);
		context.lineTo((gx+this.width)/2, window.innerHeight-2);
		context.stroke();*/
		
	};
	
	
	this.startDragging = function(x,y){
		myDragPos = new Pos(x,y);
		myIsDragging = true;
	};
	
	this.stopDragging = function(){
		myDragPos = null;
		myIsDragging = false;
	};
	
	this.coordInGrip = function(x,y){
		if (!myAllowResize)
			return false;
		return this.getClientWidth() < x;
	};
	
	this.mouseMove = function(x, y)
	{
		if (myIsDragging){
			this.setWidth(this.width+x-myDragPos.x);
			myDragPos = new Pos(x,y);
		}
		else {
			if (this.coordInGrip(x,y)) {
				for (var i = 0; i < this.groups.length; ++ i)
					this.groups[i].mouseMove(x, y);	
			}
		}
	};
	
	this.mouseDown = function(x, y)
	{
		if (this.coordInGrip(x,y)){
			this.startDragging(x,y);
		} else {
			var yPos = 0;
			for (var i = 0; i < this.groups.length; ++ i)
			{
				var height = this.groups[i].getInnerHeight() + 24;
				
				if (y < yPos + height)
				{
					this.groups[i].mouseDown(x, y);
					break;
				}
				
				yPos += height;
			}
		}
	};
	
	this.mouseUp = function(x, y)
	{
		if (myIsDragging){
			this.stopDragging();
			return;
		}
		var yPos = 0;
		for (var i = 0; i < this.groups.length; ++ i)
		{
			var height = this.groups[i].getInnerHeight() + 24;
			
			if (y < yPos + height)
			{
				this.groups[i].mouseUp(x, y);
				break;
			}
			
			yPos += height;
		}
	};
	
	this.click = function(x, y)
	{
		var yPos = 0;
		for (var i = 0; i < this.groups.length; ++ i)
		{
			var height = this.groups[i].getInnerHeight() + 24;
			
			if (y < yPos + height)
			{
				this.groups[i].click(x, y);
				break;
			}
			
			yPos += height;
		}
	};
}

function ToolbarGroup(toolbar, name)
{
	this.toolbar = toolbar;

	this.name = name;
	this.items = [];
	this.buttons = [];
	
	this.padding = ToolbarGroupDefault.padding;
	this.minItemWidth = ToolbarGroupDefault.minItemWidth;
	
	this.y = 0;
	
	this.isOpen = true;
	this.curDelta = 1.0;
	
	var self = this;

	this.openButton = new Button.Small(0, 0, 24);

	this.openButton.mouseDown = function(mouseX, mouseY)
	{
		if (self.items.length != 0)
		{
			if (self.isOpen)
				self.close();
			else
				self.open();
		}
	};

	this.buttons.push(this.openButton);

	this.getItemsPerRow = function()
	{		
		return Math.max(Math.floor(this.toolbar.getClientWidth() / this.minItemWidth), 1);
	};

	this.getItemWidth = function()
	{
		return this.toolbar.getClientWidth() / this.getItemsPerRow();
	};

	this.getRowCount = function()
	{
		return Math.ceil(this.items.length / this.getItemsPerRow());
	};

	this.getRowHeight = function(row)
	{
		var start = this.getItemsPerRow() * row;
		var end = start + this.getItemsPerRow();

		var height = 0;

		for (var i = start; i < Math.min(end, this.items.length); ++i)
			height = Math.max(height, this.items[i].height);

		return height + this.padding;
	};

	this.getRowOffset = function(row)
	{
		row = Math.min(row, this.getRowCount());
		
		var height = 0;
		for (var i = 0; i < row; ++ i)
			height += this.getRowHeight(i);

		return height;
	};
	
	this.getInnerHeight = function()
	{
		var openSize = this.getRowOffset(this.getRowCount());
		
		this.curDelta += Math.max((1.0 - this.curDelta) / 4.0, 1.0 / openSize);
		
		if (this.curDelta > 1.0)
			this.curDelta = 1.0;
		
		var delta = this.curDelta;
		
		if (!this.isOpen)
			delta = 1.0 - delta;
			
		return Math.round(openSize * delta);
	};
	
	this.addItem = function(item)
	{
		this.items.push(item);
		this.toolbar.calcMinWidth();
		return item;
	};
	
	this.addButton = function(width, contents, mouseDown)
	{
		var btn = new Button.Small(0, 0, width, contents);
		btn.mouseDown = mouseDown;
		this.buttons.push(btn);
		this.toolbar.calcMinWidth();
	};

	this.open = function()
	{
		if (!this.isOpen)
		{
			this.curDelta = 0.0;
			this.isOpen = true;
		}
	};
	
	this.close = function()
	{
		if (this.isOpen)
		{
			this.curDelta = 0.0;
			this.isOpen = false;
		}
	};
	
	this.mouseMove = function(x, y)
	{
		for (var i = this.buttons.length - 1; i >= 0; i--)
			this.buttons[i].mouseMove(x, y);
	};
	
	this.mouseDown = function(x, y)
	{
		if (y <= this.y + 24) {
			for (var i = this.buttons.length - 1; i >= 0; i--)
			{
				var btn = this.buttons[i];
				if (btn == this.openButton && this.items.length == 0) continue;
				if (btn.isPositionOver(x, y))
				{
					btn.mouseDown(x, y);
					break;
				}
			}
		} else {
			var ipr = this.getItemsPerRow();
			var wid = this.getItemWidth();
			for (i = 0; i < this.items.length; ++i)
			{
				var item = this.items[i];
				var row = Math.floor(i / ipr);
				var imgX = (i % ipr) * wid + (wid - item.width) / 2;
				var imgY = this.getRowOffset(row) + this.y + 24
					+ (this.getRowHeight(row) - item.height) / 2;
					
				if (x >= imgX && y >= imgY && x < imgX + item.width && y < imgY + item.height)
				{
					if (item.isGateType)
						logicSim.startDragging(item);
					else
						item.mouseDown(x, y);

					break;
				}
			}
		}
	};
	
	this.mouseUp = function(x, y)
	{
		
	};
	
	this.click = function(x, y)
	{
	
	};
	
	this.render = function(context)
	{
		context.translate(0, this.y);
		
		context.fillStyle = context.createPattern(this.toolbar.sepimage.mid, "repeat-x");
		context.fillRect(1, 0, this.toolbar.getClientWidth() - 2, 24);
		
		context.drawImage(this.toolbar.sepimage.end, 0, 0);
		context.drawImage(this.toolbar.sepimage.end, this.toolbar.getClientWidth() - 2, 0);
		
		context.translate(0, -this.y);

		this.openButton.image = this.isOpen ? this.toolbar.arrimage.up : this.toolbar.arrimage.down;
		
		var btnx = this.toolbar.getClientWidth();
		for (var i = 0; i < this.buttons.length; ++i)
		{
			var btn = this.buttons[i];
			if (btn == this.openButton && this.items.length == 0) continue;
			btn.y = this.y + 4;
			btnx -= btn.width + 4;
			btn.x = btnx;
			btn.render(context);
		}
		
		
		context.translate(0, this.y);
		
		context.save();
		context.rect(2,1,this.toolbar.getClientWidth() - 4 - 28, 22);
		context.clip();

		context.fillStyle = "#FFFFFF";
		context.font = "bold 12px sans-serif";
		context.shadowOffsetX = 0;
		context.shadowOffsetY = -1;
		context.shadowColor = "#000000";
		context.fillText(this.name, 4, 16);
		
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		
		context.restore();
		
		context.translate(0, -this.y);
		
		if (this.isOpen && this.curDelta > 0.9)
		{
			var ipr = this.getItemsPerRow();
			var wid = this.getItemWidth();			
			for (i = 0; i < this.items.length; ++i)
			{
				var item = this.items[i];
				var row = Math.floor(i / ipr);
				var imgX = (i % ipr) * wid + (wid - item.width) / 2;
				var imgY = this.getRowOffset(row) + this.y + 24
					+ (this.getRowHeight(row) - item.height) / 2;
				
				if (item.isGateType)
					item.render(context, Math.round(imgX), imgY);
				else
				{
					item.x = Math.round(imgX);
					item.y = imgY;
					item.render(context);
				}
			}
		}
		
		return 24 + this.getInnerHeight();
	};
}