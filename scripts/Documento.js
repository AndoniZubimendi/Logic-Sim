/**
 * Created by andoni on 01/04/16.
 */
Document.prototype.generateId = function (prefix) {
    if (!prefix)
        prefix = 'automaticId';
    if (!window.generatedId)
        window.generatedId = [];
    if (!window.generatedId[prefix])
        window.generatedId[prefix] = 0;
    return prefix + '_' + window.generatedId[prefix]++;
};

