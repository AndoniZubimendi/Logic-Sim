// CSS Sheets
class Sheet {
    constructor() {
        // Create the <style> tag
        this.style = document.createElement("style");

        // Add a media (and/or media query) here if you'd like!
        this.style.setAttribute("media", "screen");
        // style.setAttribute("media", "only screen and (max-width : 1024px)")

        // WebKit hack :(
        this.style.appendChild(document.createTextNode(""));

        // Add the <style> element to the page
        document.head.appendChild(this.style);

        return this;
    }

    addRule(selector, rules, index) {
        const sheet = this.style.sheet;
        if (!index)
            index = 0;
        if("insertRule" in sheet) {
            sheet.insertRule(`${selector}{${rules}}`, index);
        }
        else if("addRule" in sheet) {
            sheet.addRule(selector, rules, index);
        }
    }
}