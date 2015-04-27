var Saving = {};
Saving.save = function(logicSim)
{
    var obj = { ics: [], root: logicSim.save() };

	if (logicSim.customGroup) {
		for (var i = 0; i < logicSim.customGroup.items.length; ++i) {
			var ic = logicSim.customGroup.items[i];
			obj.ics.push({ name: ic.name, env: ic.environment.save() });
		}
	}

    var str = LZString.compressToBase64(JSON.stringify(obj));

    window.open("data:text/plain;charset=UTF-8," + str, "_blank");
};

Saving.loadFromHash = function(logicSim)
{
    if (window.location.hash === null || window.location.hash.length <= 1) return;
    Saving.load(logicSim, window.location.hash.substring(1));
};

Saving.loadFromPrompt = function(logicSim)
{
    var str = prompt("Paste a previously copied save code with Ctrl+V.", "");
    if (str != null && str.length > 0) Saving.load(logicSim,str);
};

Saving.load = function(logicSim,str)
{
    var obj = JSON.parse(LZString.decompressFromBase64(str));

    var ics = [];
    for (var i = 0; i < obj.ics.length; ++ i) {
        var ic = obj.ics[i];
        var env = new Environment();
        env.load(ic.env, ics);
        ics[i] = new CustomIC(ic.name, env);
        logicSim.customGroup.addItem(ics[i]);
    }

    logicSim.load(obj.root, ics);
};
