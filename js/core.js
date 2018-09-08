(function() {
    function ELEM(params) {
        this.el = params.el || null;
    };

    ELEM.prototype.addEvent = function(type, fn) {
        this.el.addEventListener(type, fn, false);
        return this;
    };

    ELEM.prototype.removeEvent = function(type, fn) {
        this.el.removeEventListener(type, fn, false);
        return this;
    };

    ELEM.prototype.addClass = function(className) {
        this.el.classList.add(className);
        return this;
    };

    ELEM.prototype.removeClass = function(className) {
        this.el.classList.remove(className);
        return this;
    };

    ELEM.prototype.toggleClass = function(className) {
        if (this.el.classList.contains(className)) {
            this.el.classList.remove(className);
        } else {
            this.el.classList.add(className);
        }
        return this;
    };


    ELEM.prototype.find = function(selector) {
        var el = this.el.querySelector(selector);
        return el ? new ELEM({ el: el }) : null;
    };

    ELEM.prototype.findAll = function(selector) {
        var self = this;
        var els = this.el.querySelectorAll(selector);
        els = Array.prototype.slice.call(els);
        return els.map(function(el) {
            return new ELEM({ el: el });
        });
    };
    ELEM.prototype.getAttr = function(name) {
        return this.el.getAttribute(name);
    };
    ELEM.prototype.hide = function(name) {
        return this.el.style.display = 'none';
    };

    ELEM.prototype.show = function(name) {
        return this.el.style.display = 'block';
    };

    ELEM.prototype.style = function(name, val) {
        this.el.style[name] = val;
    };

    function SELECTOR() {

    };

    SELECTOR.prototype.initElem = function(el) {
        return new ELEM({ el: el });
    };

    SELECTOR.prototype.find = function(selector, context) {
        var el;
        if (selector instanceof HTMLElement) {
            el = selector;
        } else {
            el = context ? context.querySelector(selector) : document.querySelector(selector);
        }

        return this.initElem(el);
    };

    SELECTOR.prototype.findAll = function(selector, context) {
        var self = this;
        var els = context ? context.querySelectorAll(selector) : document.querySelectorAll(selector);
        els = Array.prototype.slice.call(els);
        return els.map(function(o) {
            return self.initElem(o)
        });
    };


    window.NES_API = new API_CONSTRUCTOR();

    function API_CONSTRUCTOR() {
        this.promises = {};
        this.collection = [];
        this.SELECTOR = new SELECTOR();
    };

    API_CONSTRUCTOR.prototype.add = function(name, params) {
        if (!name || typeof name !== 'string') {
            throw new Error('API ERROR');
        }

        for (var method in params) {
            if (method !== 'constructor') {
                params.constructor.prototype[method] = params[method];
            }
        }

        this.collection.push({ name: name, params: params });
        this.promises[name] = new Promise(function(resolve, reject) {
            resolve();
        });
    };

    API_CONSTRUCTOR.prototype.on = function(name) {
        return this.promises[name];
    };

    API_CONSTRUCTOR.prototype.init = function(name) {
        var self = this;
        this.collection.forEach(function(o) {
            self[o.name] = new o.params.constructor();
        });
    };
}());
