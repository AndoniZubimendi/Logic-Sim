// TruthTableBuilder
var TruthTableBuilder = {};

TruthTableBuilder.calcSimSteps = function (outputs) {
    let steps = 0;
    for (let i = 0; i < outputs.length; i++) {
        let tree = ExpressionBuilder.buildTree(outputs[i]);
        if (tree.root.level > steps)
            steps = tree.root.level;
        //console.log(tree.toString(true));
    }
    // output not counted, level index starts at 0 and simulation can begins by an output => +3
    return steps + 3;
};

TruthTableBuilder.buildTable = function (enviroment) {
    var getName = function (gate) {
        return gate.label || gate.type.name;
    };
    const env = enviroment.clone();
    const inputs = env.find('ConstInput');
    const outputs = env.find('OutputDisplay');
    let simSteps = TruthTableBuilder.calcSimSteps(outputs);

    let table = new TruthTable();
    table.setup(inputs.map(getName), outputs.map(getName));

    // simulate circuit with each combination of inputs, then add inputs and outputs

    for (let i = 0; i < Math.pow(2, inputs.length); i++) {
        let inValues = BitHelper.bitsToArray(i, inputs.length);
        for (let j = 0; j < inputs.length; j++) {
            inputs[j].on = inValues[j] === 1;
        }
        for (let k = 0; k < simSteps; k++)
            env.step();
        let outValues = outputs.map(function (gate) {
            return gate.on ? 1 : 0;
        });
        table.setValues(inValues, outValues);
    }

    return table;
};

