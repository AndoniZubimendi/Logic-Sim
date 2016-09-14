var circuits = [
    // AND example
    "N4IglgxgziBcDaBdANCATgewwFzqA5gIbYCmMCousIA8gK7YAODAImFIwDaECeIqADzgAOAGwAWVH1gBmAIwAmVJzggAivxAATFbNQY4SVFrgA7Op04BfZJVUBhDKajYAkqea5BcAOwAGSRBpBWFhZVUAQU0dODl9Q2w0OhIUbThE5Js7akdnNw8GTSFYf0DpGRlRcOoAIWjdOJADBAAzQk4oFOM4No6SLJAqEAjTLQBxYhIi32EyuHklEF0QerhF5vheztSTWHNLK1SAdzA0MkNQKGLZsJAocpDUEmuJJ4fhAauZwPv5gKfij5Zm95go/J9AaJbr9ZP8QM9viDYeIIYi7uVKgC0SRygBWBSokpQ1AwmT4rElYHwvEExBWKxAAA=",


    // Half Adder
    'N4IglgxgziBcDaBdANCATgewwFzqA5gIbYCmMCousIA8gK7YAODAImFIwDaECeIqADzgBOAIwAmVH1gBmACxzUnOCADChNGj6oAJstmoMcJLrgA7Op04BfZJRX0mrdl178QQ2GMkhp4gBwADEoqAMp0ALbuenAyhsYoIDrmljZ2IFRqGGZQ2ACSZsy4gnAAbACspVJw4gDsPvogAILR+qLxCNhodCSJybBdPbb21KrZuQVF7p4VVb6x5Q0qAEKtcO0gRggAZoScUL2msLv7JMMZKk1mOgDixCTTcEHB87IKIdRNAHIsa7CKm2MJwOfRSVnOmQAGhg0HdSI9YM9qrAAi9GpCaAAlP4+LbwUSg2AWcGJADuYDQZGMoCgnn8pQBUD8wjmJE83lQJGZpXOtKeDNQTNipRebJEEk50hkIt5nlq/kZfn8/k5coVkoW4llcHqLyFKOVqp16pAXJqyu1sHlis1RsRgVFUsWlutgqVKtNdIdGoN/hdpQ9+pkgQBYvtjtiIf9galIbttQDPulfvSfKt4j1UsTnp12bNsgD0bdwo9YaRpqzfsQ1msQAAA==',


    // Full Adder
    'N4IglgxgziBcDaBdANCATgewwFzqA5gIbYCmMCousIA8gK7YAODAImFIwDaECeIqADzgBOAMwA2VH1gAmAKySQnOCADKdALb8QAE2WxRqDHCSodcAHZ1OnAL7JKK+k1bsuvbUNhjF00QBZ/VH0QAGEMBm09OEMQYwQUXUtrOwcQKjCMCyhsAEkLZlxBOHEARl8Y0plglQBBKP1SoxMAM0JOKBJE81g2jpJ7R2pw7LyCyOLYMorZBRrhsAsGuCa41vbO7rg+zsH0uosdAHFiEk84AA4ABgupGKugpTqAORZl2Ef4+Cut2CsbPYZAAaGDQJ1I51g11uIGk8kUIXe1TWCB+ZmSALSGRGOXyhUh0zuBjkyJCACF3qsvjsuujehsBliDsdTpCAOxVImiEnzEDvT7rfq/f6pIYgEFg1mTDnIuHXXlAmgAJX5zVRwpSgKckohkwubNlMUCvOVSLV8BpGoBiQA7mA0GQTKAoF42WzFFA4cJFCQvNDUCQveI9i7LjdUJ64DJ5SBfWGYYGo96Q37wyBI7JvQHUwm/FUU5cDRG4UXY14fAGSzIC1DSxnRDIrtnC8jE8Tq2lQ1MY/Xo83YDLKzFozXB+m/A9+2O2w2LqPOePhwnXQuZ+IrjXxD2q1PhK2q6O98Wo+JHnGoWm2zJT4fkb3l/GhwYR53XUfF7JT7v91GDbfj7Ipbnmy74zi+zpeFuTYfhID5TFmsZ+Fum4IfW7pTqufjuihHpynB054ThAHRnB4gIWuc6viUqFIaR5FYcGVEDuhMFbv2+o/gYyGILYthAA'

];

// overwrite default values for grid
GridDefaults.type = 5;
GridDefaults.bgColor1 = 'beige';

var logicSim = [];
for (var i = 0; i < circuits.length; i++) {
    logicSim.push(new LogicSimExpr());
}

function runApp() {

    for (var i = 0; i < logicSim.length; i++) {
        // load circuit on canvas
        logicSim[i].initialize("canvas" + i, circuits[i], 'tableContainer' + i, null);
        // run simulation at 20 steps/second
        logicSim[i].run(20);
    }

}

window.onload = function (e) {
    if (!images.allImagesLoaded()) {
        images.onAllLoaded = function () {
            runApp();
        }
    } else {
        runApp();
    }
};

