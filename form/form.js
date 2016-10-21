(function (global) {
"use strict";

var Form = global.Form || {};

var Event = (function () {
    if (window.event) {
        return {
            addEventListener: function (element, type, callback) {
                element.attachEvent("on" + type, function (e) {
                    e = e || window.event;
                    e.target = e.srcElement;
                    e.preventDefault = function () {
                        e.returnValue = true;
                    };
                    e.stopPropagation = function () {
                        e.cancelBubble = true;
                    };
                    callback(e);
                });
            },
            removeEventListener: function (element, type, callback) {
            },
            dispatchEvent: function (element, type) {
                var event = document.createEventObject();
                event.eventType = type;
                event.eventName = type;
                element.fireEvent("on" + event.eventType, event);
            }
        }; 
    } else {
        return {
            addEventListener: function (element, type, callback) {
                element.addEventListener(type, callback);
            },
            removeEventListener: function (element, type, callback) {
            },
            dispatchEvent: function (element, type) {
                var event = document.createEvent("HTMLEvents");
                event.initEvent(type, true, true);
                event.eventName = type;
                element.dispatchEvent(event);
            }
        };
    }
})();

function trim (str) {
    return str.replace(/^\s+/, "").replace(/\s+$/, "");
}

function inArray (element, array, type) {
    var i;
    type = type || true;
    if (type) {
        for (i = 0; i < array.length; i++) {
            if (element === array[i]) {
                return i;
            }
        }
    } else {
        for (i = 0; i < array.length; i++) {
            if (element == array[i]) {
                return i;
            }
        }
    }
    return false;
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
    this._init();
};
BaseClass.prototype._init = function () {};

function createClass (name, base, prototype) {
    var constructor, basePrototype;

    constructor = Form[name] = function (options) {
        if (!this._createClass) {
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

    $.each(prototype, function (prop, value) {
        if ($.isFunction(value)) {
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
    });

    constructor.prototype = deepExtend(basePrototype, prototype, {
        constructor: constructor
    });
}

createClass("Element", {
    options: {
        nodeName: "div",
        id: null,
        className: null,
        title: null,
        attributes: null,
        text: null,
        on: null
    },
    _init: function () {
        var that = this;
        this.createElement();
        if (this.options.id) this.setAttribute("id", this.options.id);
        if (this.options.title) this.setAttribute("title", this.options.title);
        if (this.options.className) this.setClass(this.options.className);
        if (this.options.text) this.setText(this.options.text);
        if (this.options.attributes) this.setAttributes(this.options.attributes);
        if (this.options.on) {
            $.each(this.options.on, function (eventName, callback) {
                that.bind(eventName, callback);
            });
        }
    },
    element: null,
    getElement: function () {
        if (!this.element) {
            this.createElement();
        }
        return this.element;
    },
    createElement: function () {
        this.element = document.createElement(this.options.nodeName);
        return this;
    },
    setAttribute: function (name, value) {
        this.element.setAttribute(name, value);
        return this;
    },
    getAttribute: function (name) {
        return this.element.getAttribute(name);
    },
    setAttributes: function (attrs) {
        var i;
        for (i in attrs) {
            if (attrs.hasOwnProperty(i)) {
                this.element.setAttribute(i, attrs[i]);
            }
        }
        return this;
    },
    addClass: function (className) {
        var oldClassName = this.element.className;
        var oldClasses = oldClassName.split(" "),
            newClasses = className.split(" "),
            i;
        for (i = 0; i < newClasses.length; i ++) {
            if (false === inArray(newClasses[i], oldClasses)) {
                oldClasses.push(newClasses[i]);
            }
        }
        this.element.className = trim(oldClasses.join(" "));
        return this;
    },
    removeClass: function (className) {
        var oldClassName = this.element.className;
        var oldClasses = oldClassName.split(" "),
            newClasses = className.split(" "),
            i, pos;
        for (i = 0; i < newClasses.length; i ++) {
            if (false !== (pos = inArray(newClasses[i], oldClasses))) {
                oldClasses[pos] = "";
            }
        }
        this.element.className = trim(oldClasses.join(" "));
        return this;
    },
    setClass: function (className) {
        this.element.className = className;
        return this;
    },
    getText: function () {
        return this.element.innerHTML;
    },
    setText: function (text) {
        this.element.innerHTML = text;
        return this;
    },
    appendChild: function (elements) {
        if (elements._createClass) {
            this.element.appendChild(elements.getElement());
        } else {
            this.element.appendChild(elements);
        }
        return this;
    },
    appendTo: function (element) {
        element.appendChild(this.element);
        return this;
    },
    bind: function (type, callback) {
        var that = this;
        if (!$.isFunction(callback)) {
            callback = new Function(callback);
        }
        Event.addEventListener(this.element, type, function () {
            callback.apply(that, arguments);
        });
        return this;
    },
    unbind: function (type, callback) {
        Event.removeEventListener(this.element, type);
        return this;
    },
    trigger: function (type) {
        Event.dispatchEvent(this.element, type);
        return this;
    }
});

createClass("TextNode", {
    options: {
        text: null
    },
    _init: function () {
        this.createElement();
    },
    element: null,
    getElement: function () {
        if (!this.element) {
            this.createElement();
        }
        return this.element;
    },
    createElement: function () {
        this.element = document.createTextNode(this.options.text);
        return this;
    },
    getText: function () {
        return this.element.data;
    },
    setText: function (text) {
        this.element.data = text;
        return this;
    }
});

createClass("FormElement", Form.Element, {
    options: {
        nodeName: "input",
        name: null,
        type: "text",
        value: null
    },
    _init: function () {
        this._super();
        if (this.options.type) {
            this.element.setAttribute("type", this.options.type);
        }
        if (this.options.name) this.setName(this.options.name);
        if (this.options.value) this.setValue(this.options.value);
        this.validate();
    },
    getName: function () {
        return this.element.getAttribute("name");
    },
    setName: function (name) {
        this.element.setAttribute("name", name);
        return this;
    },
    getType: function () {
        return this.element.getAttribute("type");
    },
    getValue: function () {
        return this.element.value;
    },
    setValue: function (value) {
        this.element.value = value;
        return this;
    },
    validate: function () {
        this.bind("focus", function () {
            console.log("focus");
        });
        this.bind("input", function () {
            console.log("input");
        });
        this.bind("change", function () {
            console.log("change");
        });
        this.bind("blur", function () {
            console.log("blur");
        });
    }
});

createClass("File", Form.Element, {
    _init: function () {
        var o = deepExtend({}, this.options),
            that = this,
            name = this.options.name;
        this.options = {
            nodeName: "div",
            className: "form-file-container"
        };
        delete o.name;
        o.nodeName = "input";
        o.type = "text";
        o.attributes = this.options.attributes || {};
        o.attributes.readonly = "readonly";
        this._super();
        this.valueElement = new Form.FormElement(o);
        this.fileElement = new Form.FormElement({
            type: "file",
            name: name,
            className: o.className + " form-file-input"
        });
        this.appendChild(this.valueElement);
        this.appendChild(this.fileElement);
        this.fileElement.bind("change", function () {
            var v = that.fileElement.getValue();
            if (v != that.valueElement.getValue()) {
                that.valueElement.setValue(v);
                that.valueElement.trigger("input");
                that.valueElement.trigger("change");
            }
        });
    }
});

createClass("Label", Form.Element, {
    options: {
        nodeName: "label",
        setfor: null
    },
    _init: function () {
        this._super();
        if (this.options.setfor) this.setFor(this.options.setfor);
    },
    getFor: function () {
        return this.getAttribute("for");
    },
    setFor: function (value) {
        return this.setAttribute("for", value);
    }
});

createClass("Select", Form.FormElement, {
    options: {
        nodeName: "select",
        name: null,
        options: []
    },
    _init: function () {
        this.options.type = null;
        this._super();
        this._initOptions();
    },
    _initOptions: function () {
        var that = this;
        $.each(this.options.options, function () {
            var attributes = {};
            if (this.selected) {
                attributes.selected = "selected";
            }
            that.addOption(this.value, this.title, attributes);
        });
    },
    opts: [],
    addOption: function (value, title, attrs) {
        attrs = attrs || {};
        attrs.value = value;
        var option = Form.Element({
            nodeName: "option",
            text: title,
            attributes: attrs
        });
        this.appendChild(option);
        this.opts.push(option);
        return this;
    }
});

createClass("Checkbox", Form.FormElement, {
    options: {
        nodeName: "input",
        type: "checkbox",
        label: null,
        checked: false,
    },
    _init: function () {
        this._super();
        this._initLabel();
    },
    _element: null,
    label: null,
    text: null,
    _initLabel: function () {
        if (!this.options.label) return;
        this.label = Form.Label();
        this.text = Form.TextNode({
            text: this.options.label
        });
        this._element = this.element;
        this.element = this.label.appendChild(this.element)
            .appendChild(this.text).getElement();
    },
    setLabel: function (text) {
        this.text.setText(text);
    }
});

createClass("Textarea", Form.FormElement, {
    options: {
        nodeName: "textarea"
    },
    _init: function () {
        this.options.type = null;
        this._super();
    }
});

createClass("Button", Form.FormElement, {
    options: {
        nodeName: "button"
    },
    _init: function () {
        this._super();
    }
});

var typeToClass = {
    "select": "Select",
    "checkbox": "Checkbox",
    "radio": "Checkbox",
    "textarea": "Textarea",
    "button": "Button",
    "submit": "Button",
    "file": "File"
};

createClass("BootstrapForm", {
    options: {
        elements: null
    },
    form: null,
    _init: function () {
        var form = Form.Element({ nodeName: "form", className: "form-horizontal" }), 
            line, label, that = this;
        $.each(this.options.elements, function () {
            line = Form.Element({ className: "form-group" });
            if (this.label) {
                label = Form.Label(this.label);
                label.addClass("col-sm-2 control-label");
                line.appendChild(label);
            }
            if (this.elements) {
                line.appendChild(that._createElements(this.elements, !this.label));
            }
            form.appendChild(line);
        });
        this.form = form;
    },
    _createElements: function (elements, offset) {
        var fragment = document.createDocumentFragment(),
            that = this, container;
        offset = offset || false;
        $.each(elements, function () {
            fragment.appendChild(that._createElement(this));
        });
        container = Form.Element({
            className: "col-sm-10"
        });
        if (offset) container.addClass("col-sm-offset-2");
        container.appendChild(fragment);
        return container;
    },
    _createElement: function (options) {
        var className = typeToClass[options.type] || "FormElement",
            container, element;
        // TODO
        if (false === inArray(options.type, ["checkbox", "radio", "button", "submit"])) {
            options.className = options.className ? options.className + " form-control" : "form-control";
        } else if (options.type === "button" || options.type === "submit") {
            options.button && (options.type = options.button);
        } else {
            container = Form.Element({ className: options.type });
        }
        element = Form[className](options);
        container && (element = container.appendChild(element));
        return element.getElement();
    },
    getElement: function () {
        return this.form.getElement();
    }
});

global.Form = Form;

})(this);
