function LogicSimApp()
{
	this.__proto__ = new LogicSim();


	this.initialize = function(canvas, circuit)
	{
		this.setCanvas(canvas);
		
		Saving.load(this, circuit);
		this.centerOnCanvas();
		
		this.setReadOnly(true);
		
	},
	
	
	this.onResizeCanvas = function(){
		//no resize
	}	
}

// overwrite default values for grid
GridDefaults.type=5;
GridDefaults.bgColor1='beige';

logicSim =[];
circuits = [
	// AND example
	"N4IglgxgziBcDaBdANCATgewwFzqA5gIbYCmMCousIA8gK7YAODAImFIwDaECeIqADzgAOAGwAWVH1gAmYcNSc4IAIr8QAEyWwAzKgxwkqDXAB2dTpwC+ySsoDCGU1GwBJU81yC4AdgAMkiDSOjJ+isoAQupacACM+oYAZoScUCQomnDJqSQ2dtSOzm4eDOpCsP6B0jIArKLh1ACC0drxIAYI2WkZJrBdubYgVCCNphoA4sQkZb7CVXByCu1JKd3GZhbWGQDuYGhkhqBQ5T6iS1DVPjKoJCdzN5cyeSDHs4EXC1c3d4Ek1QCcomerwqZ1QH10OnqIFubwecB0UOBP3BwVi1xhKJhwSRgxBc3OwQC3xEEnhugCVkQVisQAA==",
	
	
	// Half Adder
	'N4IglgxgziBcDaBdANCATgewwFzqA5gIbYCmMCousIA8gK7YAODAImFIwDaECeIqADzgB2AEwAGVH1gSAHKk5wQAYUJo0fVABNFsAMyoMcJNrgA7Op04BfZJSX0mrdl178QQ2GMkhpARgAWAIUlAGU6AFt3HTgDECMEFBAtc0sbOxAqFQwzKGwASTNmXEE4AIA2YN84P1F5EF0QAEFo3T9DY2w0OhIklNguntt7amUcvMLi908KqulRUSrGgCFWmo6EQd7TAe6SYcylJrMtAHFiEmm4cvF6+duQ6iaAORY12CqE+C2+1KsDrIADQwaHOpCusBudxqQUeIEBNAASu9RBt4OJfrALP8kgB3MBoMjGUBQTzlMSoKD+G6oEieby06niA6k64UkBUuALKp0kQSRlcxYszwAVgAnKiOf4RZLeZCHiASNLRMK4OLJZyZH5yrSyQqlVztarYOrKf5YYrRRKBbA/DLjTL6prAjyrbLzQEHdapTUZbq1d6DVryg7hDqfTI9LK9fUg6Io6Hw87yrGYzbtbJE2aain/Sawzb4yqMqyTXVszIAj45SKC4r5lWsxGi3na+G443ENZrEAA=',
	
	
	// Full Adder
	'N4IglgxgziBcDaBdANCATgewwFzqA5gIbYCmMCousIAwhgHZTYCS9ADgK66oAecALAA4ADKgCecAEz9RIADZwQAQRCoAJgtgBGVBjjxsaDiRQg1cQ8YC+ySorqMW7LqpB9YQ2RNgBmAGyCqJq0YPSuGnA6IHoIAGaEclAm6nDxiSQ2dtQOTKyc3G4CIuJwPsL8QYoAQuGaUTEGRslmFk2ZIFQgABoYaADixCSu7gCsAOx+JbCSY5KV1F0A8gBKtVK6+sKm5rD0HHJy7Z1K9GoDpMNwfrNT/oHyimseGwiWzTt7B0eKi/2Dl7AxiM5iBvD5/PMQCsnhVovo3ts4J9DrYOj8uPkACJgKBsOSECS8OCCLSTUGlCEPbIYFzqTQ+F5IFK7fYorJQjFcbG4/GEwqwElk7wzEHBADKHAAtk8GXCEIiWV9UcdTuchkTYNcQWDypClAA5TEwxlbZnI74LXpqgFaqbSWTBJ4ghqmlqKw6mADuYDQZH0oCg7ltICgwr8sJIQZuIBIwsEgnagauMlQoak8dQkau0dj6YTqKTmujaemGZjUZBud8WkkidGE1TwoAnGSs7Bxq2wZJhHW4CN+LCSz5u5n653St3e+2GyGwTO28Gqz4JlOO42J7I22uY3O/Ku/LIS5IRq3RgfM3GewWz4fL6O+/PL6uB+vpif7+3zzupCf97fSk2lYVheAG1tefZfkexTlhBm5goBU5jJSQ4vjBgLAiBvgDohyFdpu7hIeOWH8DhZJDl+bZApWYIHqRr7+PhcCEZhPiCCR4GArheYfoKmGSPGdGzj+p5MZSVb8fmAZBu+Qm+PxH6Ll2kkhtJZHCkICkyUu/FTn4MlHhpaGKVIQjPoOYIYWh/YRmCbFmfRlkLlpFlgVJVz6UpmlET4wJWIgVhWEAA'
	
	];
	

for (var i=0;i<circuits.length;i++){
	logicSim.push(new LogicSimApp());
}

function runApp(){
	

	var getCellClickFnc = function (inputs, truthTable){
		return function (evt) { // cell click
			var td = evt.target || evt.srcElement;			// get clicked td
			var rowIdx = td.parentNode.getParentIndex();	// get row (parent of td) index
			var values = truthTable.getValues(rowIdx);		// get input & outputs values from table
			for (var i=0; i< values.inputs.length; i++)		// set each input gate from table's values
				inputs[i].on = values.inputs[i];
		};
	};
	var getHeaderClickFnc = function (inputs, outputExpression){
		return function (evt) { // header cell click
			var th = evt.target || evt.srcElement;					// get clicked th
			if (th.hasClass('Out')){								// click on output header cell?
				var rowIdx = th.getParentIndex();		// get row (parent of th) index
				var expr = outputExpression[rowIdx-inputs.length];	// get input & outputs values from table
				alert(expr);
			}
		};
	}
	var getStateChangedFnc = function(inputs, truthTable){
			return function (enviroment) {
				var inpValues = inputs.apply(function(gate){ return gate.on;} ); // get state of each input gate
				var inpNumber = BitHelper.arrayToBits(inpValues); 		// convert array of bits in bits of an integer (a number which matchs with the row)
				var row = truthTable.children[1].children[inpNumber]; 	// get row element of table
				Effect.highlight(row, 'yellowgreen');					// highlight effect
			};
	}
	
	for (var i=0;i<logicSim.length;i++){
		// load circuit on canvas
		var canvas = document.getElementById("canvas"+i);
		logicSim[i].initialize(canvas, circuits[i]);
		
		// get inputs & outputs gates from environment for further processing
		var inputs = logicSim[i].find('ConstInput'); 		// find input gates
		var outputs= logicSim[i].find('OutputDisplay'); 	// find output gates

		// get boolean expression for each output of truth table
		var outputExpression = [];
		for(var j=0; j<outputs.length; j++)
			outputExpression[j] = ExpressionBuilder.buildTree(outputs[j]).toString(true);

		// generate truth table from environment
		var container = document.getElementById('tableContainer'+i); // get container for table
		var table = TruthTableBuilder.buildTable(logicSim[i]); 		 // create a truth table from circuit
		
		// create table element from truth table. Add callback to update circuit inputs when cell of table is clicked
		var tableElem = table.create(container, 'TruthTable'+i, 'TruthTable', getCellClickFnc(inputs, table), getHeaderClickFnc(inputs, outputExpression));
		logicSim[i].setOnStateChanged( getStateChangedFnc(inputs, tableElem) );
		
		// run simulation at 20 steps/second
		logicSim[i].run(20);
	}
		
}

window.onload = function(e)
{
	if (!images.allImagesLoaded()) {
		images.onAllLoaded = function()
		{
			runApp();
		}
	} else {
		runApp();
	}
}
