LogicSimExpr.prototype = Object.create(LogicSim.prototype);
LogicSimExpr.prototype.constructor = LogicSimExpr;

function LogicSimExpr()
{
	LogicSim.call(this);

	var truthTable   = null;
	var tableElement = null;
	var tableContainer=null;
	var exprElement	 = null;
	var exprContainer= null;
	
	var inputs = null;
	var outputs= null;
	var outputExpressions = null;
	
	this.onResizeCanvas = function(){
		// no resize
	};
	
	this._getCellClick = function (evt) { // cell click
		var td = evt.target || evt.srcElement;			// get clicked td
		var rowIdx = td.parentNode.getParentIndex();	// get row (parent of td) index
		var values = truthTable.getValues(rowIdx);	// get input & outputs values from table
		for (var i=0; i< values.inputs.length; i++){	// set each input gate from table's values
			inputs[i].on = values.inputs[i];
		}
	};
	
	this._getHeaderClick = function (evt) { // header cell click
		var th = evt.target || evt.srcElement;					// get clicked th
		if (th.hasClass('Out')){								// click on output header cell?
			var rowIdx = th.getParentIndex();		// get row (parent of th) index
			var expr = outputExpressions[rowIdx-inputs.length];	// get input & outputs values from table
			alert(expr);
		}
	};
	
	this._getStateChanged = function(enviroment){
		var inpValues = inputs.map(function(gate){ return gate.on;} ); // get state of each input gate
		var inpNumber = BitHelper.arrayToBits(inpValues); 		// convert array of bits in bits of an integer (a number which matchs with the row)
		var row = tableElement.children[1].children[inpNumber]; 	// get row element of table
		Effect.highlight(row, 'yellowgreen');					// highlight effect
	};

	this._getChanged = function(enviroment){
		enviroment.rebuildElements();
	};

	this.rebuildTable = function(){
		
		if (tableContainer){
			truthTable = TruthTableBuilder.buildTable(this); // create a truth table from circuit	
		
			var id = (tableElement == null) ? document.generateId('TruthTable') : tableElement.getAttribute('id');
			// create table element from truth table. Add callback to update circuit inputs when cell of table is clicked
			 var newTableElem = truthTable.create(tableContainer, 
					id,
					'TruthTable', 
					this._getCellClick, 
					this._getHeaderClick
				);
			if (tableElement)
				tableContainer.removeChild(tableElement);
			tableElement = newTableElem;
		}
	};
	
	this.rebuildExpressions = function (){
		// generate boolean expression from environment
		if (exprContainer) {
			var newExpr=document.createElement('ul');
			newExpr.addClass('Expression');
		
			// create a list of boolean expression outputs
			for(var j=0; j<outputs.length; j++) {
				var li = document.createElement('li');
				li.appendChild( document.createTextNode(outputExpressions[j]) );
				newExpr.appendChild(li);
			}

			if (exprElement){
				newExpr.setAttribute('id', exprElement.getAttribute('id'));
				exprContainer.replaceChild(newExpr, exprElement);
			}else{
				newExpr.setAttribute('id', document.generateId('Expression'));
				exprContainer.appendChild(newExpr);
			}
			exprElement = newExpr;
		}
	};
	
	this.rebuildElements = function(){
	
		// get inputs & outputs gates from environment for further processing
		inputs = this.find('ConstInput'); 		// find input gates
		outputs= this.find('OutputDisplay'); 	// find output gates

		// get boolean expression for each output of truth table
		outputExpressions = [];
		for(var j=0; j<outputs.length; j++)
			outputExpressions[j] = ExpressionBuilder.buildTree(outputs[j]).toString(true);

		this.rebuildTable();
		this.rebuildExpressions();
		
		this.setOnStateChanged( this._getStateChanged );
	};
	
	this.setup = function(canvas, circuit, boolTblContainer, boolExprContainer) {

		this.setCanvas($Find(canvas));	
		if (circuit != null) {
			Saving.load(this, circuit);
			this.centerOnCanvas();
		}
		if (boolTblContainer)
			tableContainer = $Find(boolTblContainer);
		if (boolExprContainer)
			exprContainer = $Find(boolExprContainer);
		
		this.setOnChanged( this._getChanged );
	};
	
	this.initialize = function(canvas, circuit, boolTblContainer, boolExprContainer)
	{
		this.setup(canvas, circuit, boolTblContainer, boolExprContainer);
		
		this.setReadOnly(true);

		this.onResizeCanvas();
		
		this.rebuildElements();
	};
	

}
