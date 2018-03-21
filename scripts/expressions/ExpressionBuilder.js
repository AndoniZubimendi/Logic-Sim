var ExpressionBuilder = {};

ExpressionBuilder.getName = function (gate) {
    if (!gate)
        return '?';
    return gate.label || gate.type.name;
};

ExpressionBuilder.CreateNode = function (gate) {
    return {
        "gate": gate,
        "name": gate.type.name,
        "childs": [],
        "level": 0,
        "apply": null,
        "toString": function () {
            if (this.childs.length === 1) {
                if (this.name === '\\overline') {
                    return this.name + "{" + this.childs[0].toString() + "}";
                }
                return this.name + " " + this.childs[0].toString();
                //return "("+this.name+" " + this.childs[0].toString()+")";
            }

            if (this.name === 'NOR') {
                let data = "\\overline{(" + this.childs[0].toString();
                for (let i = 1; i < this.childs.length; i++)
                    data = data + " + " + this.childs[i].toString();
                return data + ")}";
            }
            if (this.name === 'NAND') {
                let data = "\\overline{(" + this.childs[0].toString();
                for (let i = 1; i < this.childs.length; i++)
                    data = data + " . " + this.childs[i].toString();
                return data + ")}";
            }
            if (this.name === 'XNOR') {
                let data = "\\overline{(" + this.childs[0].toString();
                for (let i = 1; i < this.childs.length; i++)
                    data = data + " \\oplus " + this.childs[i].toString();
                return data + ")}";
            }

            let data = "(" + this.childs[0].toString();
            for (let i = 1; i < this.childs.length; i++)
                data = data + " " + this.name + " " + this.childs[i].toString();

            return data + ")";
        }
    };
};

ExpressionBuilder.CreateLeave = function (input) {
    return {
        "input": input,
        "name": this.getName(input),
        "level": 0,
        "toString": function () {
            return this.name;
        }
    };
};

ExpressionBuilder.CreateTree = function (root, output) {
    let tree = {
        "inputs": [],
        "output": output,
        "root": root,
        "toString": function (addOutput) {
            let expr = this.root.toString();
            if (expr.charAt(0) === '(')
                expr = expr.slice(1, -1);
            if (addOutput)
                return ExpressionBuilder.getName(this.output) + ' = ' + expr;
            return expr;
        }
    };
    return tree;
};

ExpressionBuilder.buildTree = function (output) {
    if (!this.isOutputOnly(output))
        return null;
    this.visited = [];
    return this.CreateTree(this.buildNodeFromLink(output.getLinkableInputs()[0]), output);
};

ExpressionBuilder.buildNodeFromLink = function (link) {

    if (link == null)
        return this.CreateLeave(null);
    if (ExpressionBuilder.isOutputOnly(link.gate))
        return this.CreateLeave(link.gate);
    return this.buildNode(link.gate);
};

ExpressionBuilder.buildNode = function (gate) {
    if (this.isInputOnly(gate))
        return this.CreateLeave(gate);

    if (this.visited.indexOf(gate) >= 0)
        return this.CreateLeave(null);
    // mark to prevent loops
    this.visited.push(gate);

    let node = this.CreateNode(gate);
    let links = gate.getLinkableInputs();

    let level = 0;
    for (let i = 0; i < links.length; i++) {
        let child = this.buildNodeFromLink(links[i]);
        if (child.level > level)
            level = child.level;
        node.childs.push(child);
    }

    // unmark to maintain current branch only. Enough to prevent cycles
    delete(this.visited[this.visited.indexOf(gate)]);

    node.level = level + 1;
    return node;
};


ExpressionBuilder.isInputOnly = function (gate) {
    return gate.inputs.length === 0 && gate.outputs.length > 0;
};

ExpressionBuilder.isOutputOnly = function (gate) {
    return gate.outputs.length === 0 && gate.inputs.length > 0;
};
