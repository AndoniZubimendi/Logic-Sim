const SocketFace = {
    left: "LEFT",
    top: "TOP",
    right: "RIGHT",
    bottom: "BOTTOM"
};


const LabelDisplay = {
    none: 0,
    left: 1,
    top: 2,
    right: 3,
    bottom: 4
};

const LabelStyle = {
    font: '20px Arial',
    color: '#000'
};

const DefaultLabelDisplay = {
    CLOCK: LabelDisplay.left,
    IN: LabelDisplay.left,
    ICINPUT: LabelDisplay.left,
    OUT: LabelDisplay.right,
    ICOUTPUT: LabelDisplay.right
};

class SocketInfo {
    constructor(face, offset, label) {
        this.face = face;
        this.offset = offset;
        this.label = label;

        this.isLeft = this.face === SocketFace.left;
        this.isTop = this.face === SocketFace.top;
        this.isRight = this.face === SocketFace.right;
        this.isBottom = this.face === SocketFace.bottom;

    }

    getPosition(gateType, x, y) {
        return new Pos(
            x +
            ((this.face === SocketFace.left) ? 0
                : (this.face === SocketFace.right) ? gateType.width
                    : this.offset * 8),
            y +
            ((this.face === SocketFace.top) ? 0
                : (this.face === SocketFace.bottom) ? gateType.height
                    : this.offset * 8)
        );
    }
}