var Button = {};
Button.images = {};
Button.images.small = {};
Button.images.small.up = {};
Button.images.small.up.left = images.btnsmallleft;
Button.images.small.up.mid = images.btnsmallmid;
Button.images.small.up.right = images.btnsmallright;
Button.images.small.over = {};
Button.images.small.over.left = images.btnsmallleftover;
Button.images.small.over.mid = images.btnsmallmidover;
Button.images.small.over.right = images.btnsmallrightover;

Button.Base = function(x, y, width, height, contents)
{
	this.isButton = true;

	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	
	this.text  = (typeof(contents) == "string" ? contents : "");
	this.image = (typeof(contents) == "string" ? null : contents);
	
	this.mouseOver = false;
	this.selected = false;

};

Button.Base.prototype.isPositionOver = function(posX, posY)
{
    return posX >= this.x && posY >= this.y
        && posX < this.x + this.width && posY < this.y + this.height;
};

Button.Base.prototype.mouseMove = function(mouseX, mouseY)
{
    this.mouseOver = this.isPositionOver(mouseX, mouseY);
};

Button.Base.prototype.mouseDown = function(mouseX, mouseY)
{

};

Button.Base.prototype.renderBack = function(context)
{
    if (this.selected)
    {
        context.fillStyle = "#A0D1EF";
        context.fillRect(-4, -4, this.width + 8, this.height + 8);
    }
};


Button.Base.prototype.render = function(context)
{
    context.translate(this.x, this.y);

    this.renderBack(context);

    if (this.image)
    {
        context.drawImage(this.image, (this.width - this.image.width) / 2,
            (this.height - this.image.height) / 2);
    }
    else if (this.text)
    {
        context.fillStyle = "#FFFFFF";
        context.font = "11px sans-serif";
        context.textAlign = "center";
        context.fillText(this.text, this.width / 2, 12);
        context.textAlign = "left";
    }

    context.translate(-this.x, -this.y);
};

Button.Tool = function(image, mouseDown)
{
    Button.Base.call(this, 0, 0, image.width, image.height, image);
	this.mouseDown = mouseDown;
};

Button.Tool.prototype = Object.create(Button.Base.prototype);
Button.Tool.prototype.constructor = Button.Tool;

Button.Small = function(x, y, width, contents)
{
	this.upImages = [Button.images.small.up.left, Button.images.small.up.mid, Button.images.small.up.right];
	this.overImages = [Button.images.small.over.left, Button.images.small.over.mid, Button.images.small.over.right];

    Button.Base.call(this, x, y, width, 16,
        [Button.images.small.up.left, Button.images.small.up.mid, Button.images.small.up.right],
        [Button.images.small.over.left, Button.images.small.over.mid, Button.images.small.over.right],
        contents);
};

Button.Small.prototype = Object.create(Button.Base.prototype);
Button.Small.prototype.constructor = Button.Small;

Button.Small.prototype.renderBack = function(context)
{
    var imgs = this.mouseOver ? this.overImages : this.upImages;

    context.drawImage(imgs[0], 0, 0);
    context.fillStyle = context.createPattern(imgs[1], "repeat-x");
    context.fillRect(1, 0, this.width - 2, this.height);
    context.drawImage(imgs[2], this.width - 1, 0);
};
