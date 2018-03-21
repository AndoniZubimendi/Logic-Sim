class PopupMenuCreateStyles {

    constructor() {

        const MenuStyle = {
            menu: 'box-shadow: 1px 1px 6px #000; background-color: #FFF; border:1px solid #CCC; padding:2px; font: 14px Segoe UI,Helvetica,Garuda,Arial,sans-serif;',
            separator: 'border-top: 1px outset #CCC',
            itemNormal: 'padding:0px 20px; color:#000; background-color: #FFF; border:1px solid #FFF',
            itemHighlight: 'padding:0px 20px; background-color: #EEF; border:1px solid #AAD; border-radius:2px'
        };

        let s = new Sheet();
        s.addRule('div.PopupMenu', MenuStyle.menu);
        s.addRule('div.PopupItem', MenuStyle.itemNormal);
        s.addRule('div.PopupItemSeparator', MenuStyle.separator);
        s.addRule('div.PopupItem:hover', MenuStyle.itemHighlight);
        s.addRule('div.PopupItem.Expand', 'background: url(' + images.menuarrow.src + ') no-repeat 100% 50%');
    }
}

new PopupMenuCreateStyles();