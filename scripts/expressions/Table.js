
// Table
class Table {
    constructor(rows, cols) {
        if (rows && cols){
            this.setDimension(rows,cols);
        }else{
            this.header = [];
            this.rows = [];
        }
        return this;
    }

    setDimension(rows, cols) {
        if (!cols)
            cols=0;
        this.header	= [];
        this.rows 	= [];
        for (var i=0; i<rows; i++)
            this.rows[i] = new Array(cols);
        for (i=0; i<cols; i++)
            this.header[i] 	= '';
    }

    setRow(rowId, cols) {
        this.rows[rowId] = cols;
    }

    setHeader(cols) {
        this.header = cols;
    }

    create(container, id, className, cellClick, headerClick) {
        const table = this.appendElement('TABLE', container, className, id);

        const thead = this.appendElement('THEAD', table);
        let tr = this.appendElement('TR', thead);
        const inCount = Math.log2(this.rows.length);
        for (var j=0; j<this.header.length; j++){
            var cnt = this.header[j] ? this.header[j] : '';
            const th = this.appendElement('TH', tr);
            if (headerClick)
                EventHandler.add(th,'click', headerClick);
            th.addClass( j<inCount ? 'In' : 'Out' );
            th.appendChild(document.createTextNode(cnt));
        }

        const tableBody = this.appendElement('TBODY', table);
        for (let i=0; i<this.rows.length; i++){
            tr = this.appendElement('TR', tableBody);
            if (i & 1)
                tr.addClass('Alt');
            for (j=0; j<this.rows[i].length; j++){
                cnt = this.rows[i][j] !== undefined ? this.rows[i][j] : '';
                const td = this.appendElement('TD', tr);
                if (cellClick)
                    EventHandler.add(td,'click', cellClick);
                td.addClass( j<inCount ? 'In' : 'Out' );
                td.appendChild(document.createTextNode(cnt));
            }
        }
        return table;
    }

    appendElement(element, container, className, id) {
        element = document.createElement(element);
        if (id)
            element.setAttribute('id', id);
        if (className)
            element.addClass(className);
        if (container)
            container.appendChild(element);
        return element;
    }
}