var images = {};
images.myToLoadCount = 0;
images.onAllLoaded = function () {
};

images.onImageLoad = function () {
    --images.myToLoadCount;

    if (images.myToLoadCount == 0)
        images.onAllLoaded();
};

images.load = function (path) {
    ++images.myToLoadCount;
    var img = new Image();
    img.src = "images/" + path;

    img.onload = images.onImageLoad;

    images[path.substring(0, path.length - 4)] = img;
    return img;
};


images.allImagesLoaded = function () {
    return (images.myToLoadCount == 0);
};

images.load("and.png");
images.load("arrdown.png");
images.load("arrup.png");
images.load("btnsmallleft.png");
images.load("btnsmallleftover.png");
images.load("btnsmallmid.png");
images.load("btnsmallmidover.png");
images.load("btnsmallright.png");
images.load("btnsmallrightover.png");
images.load("buffer.png");
images.load("center.png");
images.load("clock.png");
images.load("constoff.png");
images.load("conston.png");
images.load("decoder.png");
images.load("delete.png");
images.load("delic.png");
images.load("dflipflop.png");
images.load("encoder.png");
images.load("grid.png");
images.load("grip.png");
images.load("input.png");
images.load("label.png");
images.load("move.png");
images.load("menuarrow.png");
images.load("nand.png");
images.load("newfile.png");
images.load("newic.png");
images.load("nor.png");
images.load("not.png");
images.load("open.png");
images.load("or.png");
images.load("outoff.png");
images.load("outon.png");
images.load("output.png");
images.load("pushswitchaclosed.png");
images.load("pushswitchaopen.png");
images.load("pushswitchbclosed.png");
images.load("pushswitchbopen.png");
images.load("save.png");
images.load("select.png");
images.load("sepend.png");
images.load("sepmid.png");
images.load("sevsega.png");
images.load("sevsegb.png");
images.load("sevsegbase.png");
images.load("sevsegc.png");
images.load("sevsegd.png");
images.load("sevsegdecoder.png");
images.load("sevsegdp.png");
images.load("sevsege.png");
images.load("sevsegf.png");
images.load("sevsegg.png");
images.load("switchclosed.png");
images.load("switchopen.png");
images.load("xnor.png");
images.load("xor.png");