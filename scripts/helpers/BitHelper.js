var BitHelper = {};

BitHelper.arrayToBits = function (boolArray, first, count) {
    first = first | 0;
    count = count | boolArray.length;

    for (var i = first, msk = 1, bits = 0; i < first + count; i++, msk = msk << 1)
        if (boolArray[i])
            bits = bits | msk;
    return bits;
};

BitHelper.bitsToArray = function (bits, count) {
    var boolArray = [];
    for (var i = 0, msk = 1; i < count; i++, msk = msk << 1)
        boolArray[i] = (bits & msk) ? 1 : 0;
    return boolArray;
};