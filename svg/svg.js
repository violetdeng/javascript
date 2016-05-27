(function (global) {
"use strict";

var innerSvg = {},
    c = {},
    y = c.toString;

function type (e) {
    return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? c[y.call(e)] || "object" : typeof e
}

function isFunction (e) {
    return "function" === type(e);
}

function deepExtend (obj) {
    var i, j, e;
    for (i = 1; i < arguments.length; i ++) {
        for (j in arguments[i]) {
            e = arguments[i][j];
            if (arguments[i].hasOwnProperty(j) && e !== undefined) {
                if (Object.prototype.toString.call(e) === "[object Object]") {
                    if (null !== e) {
                        obj[j] = {};
                        deepExtend(obj[j], e);
                    } else {
                        obj[j] = null;
                    }
                } else {
                    obj[j] = e;
                }
            }
        }
    }
    return obj;
}

function BaseClass () {}
BaseClass.prototype._createClass = function (options) {
    this.options = deepExtend({}, this.options, options);
    this._create();
    this._init();
};
BaseClass.prototype._create = function () {};
BaseClass.prototype._init = function () {};

function createClass (name, base, prototype) {
    var constructor, basePrototype;

    constructor = innerSvg[name] = function (options) {
        if (!this || !this._createClass) {
            return new constructor(options);
        }

        this._createClass(options);
    };

    if (!prototype) {
        prototype = base;
        base = BaseClass;
    }

    deepExtend(constructor, {
        _proto: deepExtend({}, prototype)
    });

    basePrototype = new base();
    basePrototype.options = deepExtend({}, basePrototype.options);

    var prop, value;
    for (prop in prototype) {
        if (!prototype.hasOwnProperty(prop)) continue;
        value = prototype[prop];
        if (isFunction(value)) {
            prototype[prop] = (function () {
                var _super = function () {
                    base.prototype[prop].apply(this, arguments);
                };
                return function () {
                    var __super = this._super,
                        returnValue;
                    
                    this._super = _super;
                    
                    returnValue = value.apply(this, arguments);

                    this._super = __super;

                    return returnValue;
                };
            })();
        }
    }

    constructor.prototype = deepExtend(basePrototype, prototype, {
        constructor: constructor
    });
}

function createElement (tagName, attributes) {
    var ele = document.createElementNS("http://www.w3.org/2000/svg", tagName),
        i;
    if (attributes) {
        for (i in attributes) {
            if (attributes.hasOwnProperty(i)) {
                ele.setAttribute(i, attributes[i]);
            }
        }
    }
    return ele;
}

createClass("base", {
    size: function (width, height) {
        if (!height) height = width;
        width = parseInt(width);
        height = parseInt(height);
        this.element.setAttribute("width", width);
        this.element.setAttribute("height", height);
        return this;
    },
    attr: function (attributes) {
        var i;
        if (attributes) {
            for (i in attributes) {
                if (attributes.hasOwnProperty(i)) {
                    this.element.setAttribute(i, attributes[i]);
                }
            }
        }
        return this;
    }
});

function createInner () {
    this.container = this.options.container
    this.element = createElement(this.options.tagName, {
        "width": 0,
        "height": 0
    });
    this.container.appendChild(this.element);
}

createClass("Inner", innerSvg.base, {
    moveTo: function (x, y) {
        if (!y) y = x;
        x = parseInt(x);
        y = parseInt(y);
        this.element.setAttribute("x", x);
        this.element.setAttribute("y", y);
        return this;
    },
    radius: function (x, y) {
        if (!y) y = x;
        x = parseInt(x);
        y = parseInt(y);
        this.element.setAttribute("rx", x);
        this.element.setAttribute("ry", y);
        return this;
    }
});

createClass("Rect", innerSvg.Inner, {
    options: {
        "tagName": "rect"
    },
    _create: createInner
});

createClass("Circle", innerSvg.base, {
    options: {
        "tagName": "circle"
    },
    _create: function () {
        this.container = this.options.container
        this.element = createElement(this.options.tagName, {
            "cx": 0,
            "cy": 0,
            "r": 0
        });
        this.container.appendChild(this.element);
    },
    size: function (r) {
        r = parseInt(r);
        this.element.setAttribute("r", r);
        return this;
    },
    moveTo: function (x, y) {
        if (!y) y = x;
        x = parseInt(x);
        y = parseInt(y);
        this.element.setAttribute("cx", x);
        this.element.setAttribute("cy", y);
        return this;
    }
});

createClass("Ellipse", innerSvg.Circle, {
    options: {
        "tagName": "ellipse"
    },
    _create: function () {
        this.container = this.options.container
        this.element = createElement(this.options.tagName, {
            "cx": 0,
            "cy": 0,
            "ry": 0,
            "rx": 0
        });
        this.container.appendChild(this.element);
    },
    size: function (x, y) {
        if (!y) y = x;
        x = parseInt(x);
        y = parseInt(y);
        this.element.setAttribute("rx", x);
        this.element.setAttribute("ry", y);
        return this;
    }
});

createClass("Svg", innerSvg.base, {
    _create: function () {
        this.container = document.getElementById(this.options.container);
        this.element = createElement("svg", {
            "width": 0,
            "height": 0
        });
        this.container.appendChild(this.element);
    },
    rect: function (width, height) {
        return innerSvg.Rect({
            "container": this.element
        }).size(width, height);
    },
    circle: function (r) {
        return innerSvg.Circle({
            "container": this.element
        }).size(r);
    },
    ellipse: function (rx, ry) {
        return innerSvg.Ellipse({
            "container": this.element
        }).size(rx, ry);
    }
});

global.Svg = innerSvg.Svg;
})(this);
