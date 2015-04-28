var ExpressionBuilder = {};

ExpressionBuilder.getName = function(gate){
	if (!gate)
		return '?';
	return gate.label || gate.type.name;
};

ExpressionBuilder.CreateNode = function (gate){
	return {"gate"  :gate, 
			"name"  :gate.type.name, 
			"childs": [], 
			"level"	: 0,
			"apply" : null,
			"toString": function (){
					if (this.childs.length==1)
						return this.name+" " + this.childs[0].toString();
						//return "("+this.name+" " + this.childs[0].toString()+")";

					var data ="("+this.childs[0].toString();
					for(var i=1; i<this.childs.length; i++) 
						data = data +" "+ this.name +" "+ this.childs[i].toString();

					return data +")";						
				}
			};
};

ExpressionBuilder.CreateLeave = function (input){
	return {"input": input, 
			"name" : this.getName(input),
			"level": 0,
			"toString": function (){ return this.name; }
		};
};

ExpressionBuilder.CreateTree = function (root, output){
	var tree = {
		"inputs": [], 
		"output": output,
		"root"  : root, 
		"toString": function (addOutput) { 
						var expr = this.root.toString();
						if (expr.charAt(0)=='(')
							expr = expr.slice(1,-1);
						if (addOutput)
							return ExpressionBuilder.getName(this.output)+' = '+expr;
						return expr; 
					}
	};
	return tree;
};

ExpressionBuilder.buildTree = function (output){
	if (!this.isOutputOnly(output))
		return null;
	this.visited = [];
	return this.CreateTree( this.buildNodeFromLink(output.getLinkableInputs()[0]), output );	
};

ExpressionBuilder.buildNodeFromLink = function (link){
	
	if (link==null) 
		return this.CreateLeave(null); 
	if (ExpressionBuilder.isOutputOnly(link.gate))
		return this.CreateLeave(link.gate); 
	return this.buildNode(link.gate);
};

ExpressionBuilder.buildNode = function (gate){
	if (this.isInputOnly(gate))
		return this.CreateLeave(gate);

	if (this.visited.indexOf(gate)>=0)
		return this.CreateLeave(null);
	// mark to prevent loops
	this.visited.push(gate);	
	
	var node = this.CreateNode(gate);
	var links = gate.getLinkableInputs();
	
	var level=0;
	for(var i=0; i<links.length; i++) {
		var child = this.buildNodeFromLink(links[i]);
		if (child.level > level)
			level = child.level;
		node.childs.push(child);
	}
	
	// unmark to maintain current branch only. Enough to prevent cycles
	delete(this.visited[this.visited.indexOf(gate)]);	
	
	node.level = level+1;
	return node;
};


ExpressionBuilder.isInputOnly = function (gate){
	return gate.inputs.length == 0 && gate.outputs.length > 0;
};
ExpressionBuilder.isOutputOnly = function (gate){
	return gate.outputs.length == 0 && gate.inputs.length > 0;
};




// TruthTable extends from Table
TruthTable.prototype = new Table();
TruthTable.prototype.constructor=TruthTable;

function TruthTable(truthValues){
	this.truthValues = (truthValues) ? truthValues : [0,1];
	this.inputCount  = 0;
}

	
TruthTable.prototype.setup = function(inputNames, outputNames ){
	this.setDimension(Math.pow(2,inputNames.length), inputNames.length+outputNames.length);
	this.setHeader(inputNames.concat(outputNames));
	this.inputCount = inputNames.length;
};

TruthTable.prototype.setValues = function(inputs, outputs){
	var row = BitHelper.arrayToBits(inputs);
	for(var i=0; i< inputs.length; i++)
		this.rows[row][i] = this.truthValues[inputs[i]];
	for(i=0; i< outputs.length; i++)
		this.rows[row][inputs.length+i] = this.truthValues[outputs[i]];
};

TruthTable.prototype.getValues = function(row){
	var res ={inputs:[], outputs:[]};
	for (var col=0; col< this.inputCount; col++)
		res.inputs.push(this.rows[row][col]);
	for (col=this.inputCount; col< this.rows[row].length; col++)
		res.outputs.push(this.rows[row][col]);
	return res;
};



// TruthTableBuilder
var TruthTableBuilder = {};

TruthTableBuilder.calcSimSteps = function(outputs){
	var steps=0;
	for(var i=0; i<outputs.length; i++){
		var tree = ExpressionBuilder.buildTree(outputs[i]);
		if (tree.root.level > steps)
			steps = tree.root.level;
		//console.log(tree.toString(true));
	}
	// output not counted, level index starts at 0 and simulation can begins by an output => +3
	return steps +3; 
};

TruthTableBuilder.buildTable = function(enviroment){
	var getName = function (gate) {return gate.label || gate.type.name; };
	var env = enviroment.clone();
	var inputs = env.find('ConstInput');
	var outputs= env.find('OutputDisplay');
	var simSteps = TruthTableBuilder.calcSimSteps(outputs);
	var table = new TruthTable();
	table.setup(inputs.map(getName), outputs.map(getName));
	// simulate circuit with each combination of inputs, then add inputs and outputs
	for(var i=0; i<Math.pow(2,inputs.length); i++){
		var inValues = BitHelper.bitsToArray(i, inputs.length);
		for(var j=0; j<inputs.length; j++){
			inputs[j].on = inValues[j]==1;
		}
		for(var k=0; k<simSteps; k++)
			env.step();
		var outValues = outputs.map(function(gate){return gate.on ? 1 : 0;} );
		table.setValues(inValues, outValues);
	}
	
	return table;
};

