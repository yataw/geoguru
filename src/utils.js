const utils = {};

utils.scroll = {
    addToAll() {
        Array.prototype.forEach.call(document.querySelectorAll('.scrollable'),
            el => this.add(el)
        );
    },
    add(el) {
        return new window.SimpleBar(el, this.defConfig);
    },
};

utils.scroll.defConfig = {
    classNames: {
        'scrollbar': 'scrollable-class'
    }
};

export default utils;