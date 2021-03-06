LogicSimApp.prototype = Object.create(LogicSim.prototype);
LogicSimApp.prototype.constuctor = LogicSimApp;

function LogicSimApp() {
    LogicSim.call(this);


    this.initialize = function (canvas) {
        this.setCanvas(canvas);

        this.onResizeCanvas();

        Saving.load(this, "N4IglgxgziBcDaBdANCATgewwFzqA5gIbYCmMCousIAwhgHZTYCS9ADgK66oAecArAE4ATKgCecYQBYADKgA2cEAEFAAQQhUAE0WwAjKgxx42NBxIoQmuCbMBfZJSUB5Lp2wARMFDbzCE3nCCAOwAbOJwuqEKzoCBBBqWOgDMBkYWVrD0HPLy9o7ULthunt6+/iB8sMFhIBJ6wgAc0fnqWkkpCGlwmdm5IFS0DEysbvEVQqI1cImJ1Toqca0R7cam5lrWq739dIws7FyjAiLhsFKJE3PKgEEE8dpLIIYINmuWG3YOfc6uXMU+foeVKKTWDCaRNEBOG6LWDJB6pdYZLI5D79ZT0TQAcWIJABgl0E1qoKkywAZoR5FAXulusi8ip0VjSLj8SdItVHvAyRSqV0kVslGjMdjmQSIg1SeTKZ1ET0UV9Cj8vH8yhUqidhEELs5AMEEtzacI6CJp/OogsZOIClRZwI1Ew5XKlRr5cvy3w8StKuKBtXOchAcycgBCCPVTZbS40uiFu36ey1q4EzRr+5yAUIIQzCw07ZXSzcLLfVzqzrfbJTyZbTPqaGXnynAC6KYTJiQbOaXw866QUih7/nHvXApLpZs5AGEE6dhHPb2cr9KFTPzhYT/DtRgdZYjOer89rsHrrJCfpL3KnFf6ADkcOaASF+NVCbIJces6eBVuLTu9zbb8tnieTbOrwXBtZEPVc22ff8L2wQCdxvO8phmR9HVect/1zbcKk/QkZCTI9kOpDsZ3Q99MMXWopCkXCjF/CDI2IkUTkHdkwKfFCNxnKCYIqEJNUYxc8PXQjUTfBiExCKiEDXP86JEuNrR9YRQMk8C2KE185xIwJ5IHEJmw5GjVOnfou0VEpex3eNyN08EnEAcIJx0zQycgsAB3MA0DIIxQCgTDBGqKBajZVASF86oSEC+opF6Hy6z81AAoiSLgtVa1wsSqKPhi3c4pABK6iTELYrCwKZmi0L4pKsKUomNK9FKzLytywlF0Kq0aua4QyqKirJDBEBWvqHLauEc4utgIJEKayQhswodgsJPyxom/yFqquBlvmgdKLG+o5qmkFKOSrT2skbaGrrPa8sUv1WrxE6QRkGQdsuwLlyOtrNr0ZdnpWiI3v62biskR6fp6kEZuOz7hEW87dxe06CsBqGYe8pH9uu97dqBg76h2nKrt4gHuv6wl6ie2HBt+kEyfeu6obJvGqd9TGhoU3GKfxtnadStmdsesHEiBAaWp9UI+b9PLdCSondxF9LxbB3RJuF+6lZCJbFIF8UZc1G6fW+2Hda1xG635kmpgaBX9rVzGzdqqWMtR02JYi5sBrt3mKbNvLzhN2X7t9q2fe1929amMWOaZ8SWexwX1cjgWheqz646W6P9tkP3P1qzO06TK69pVqGhzzxXNZl7PAsUjWXckb8dfT4bb1L/bElS0iA/xFvJfL1rQgKwkS8N9OC7W8bG8JZvh/zyex/7lOu+ngX2/WieBxwxmwaYmPPqkaRN4zvrbp5gd98N/68qkeui/N04p6d8aL59A9MblmEDzGuDFcb7jr9npan6SGshXN+whdKf3rpLH+61/r23EgAiYUC/ZBFgYScB59EHPxuhUFB90r7xwfrgsGYC3Y4NQVMD+GDv5ZzfkOdmhDpaX0JjfHOmoIFUwaNguAX9b6JANgw5sV0WodyhqNQ2jDyJHxEbfPejtcq/w4TTHW0thoM3EYIjq70ggqNJuTARW8pHrR0QONh6jiFKJYbopaEjJAWJwcY04Z8H48UwQOeoWdC7kXcewreh0ZYuN3mdZxhNL5+NagEmR3iKbw1OA+GWdMZGyFBq3Y48ST4whEMkn2FFuYBwolkn0OSK6eKmJk6JVNKJ+wSTnKJD8sa+K4XDbGlSCmlJqmjHOSSE4Z2AQNVmJjOrdKYe0yGMi2GIFsLYIAA=");
        this.centerOnCanvas();

        this.setReadOnly(true);
    }

}

var logicSim = new LogicSimApp();

function runApp() {
    logicSim.initialize('canvas');
    // run simulation at 20 steps/second
    logicSim.run(20);
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
