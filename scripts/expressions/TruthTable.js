// TruthTable extends from Table
TruthTable.prototype = new Table();
TruthTable.prototype.constructor = TruthTable;

function TruthTable(truthValues) {
    this.truthValues = (truthValues) ? truthValues : [0, 1];
    this.inputCount = 0;
}


TruthTable.prototype.setup = function (inputNames, outputNames) {
    this.setDimension(Math.pow(2, inputNames.length), inputNames.length + outputNames.length);
    this.setHeader(inputNames.concat(outputNames));
    this.inputCount = inputNames.length;
};

TruthTable.prototype.setValues = function (inputs, outputs) {
    var row = BitHelper.arrayToBits(inputs);
    for (var i = 0; i < inputs.length; i++)
        this.rows[row][i] = this.truthValues[inputs[i]];
    for (i = 0; i < outputs.length; i++)
        this.rows[row][inputs.length + i] = this.truthValues[outputs[i]];
};

TruthTable.prototype.getValues = function (row) {
    var res = {inputs: [], outputs: []};
    for (var col = 0; col < this.inputCount; col++)
        res.inputs.push(this.rows[row][col]);
    for (col = this.inputCount; col < this.rows[row].length; col++)
        res.outputs.push(this.rows[row][col]);
    return res;
};
