(function (global) {
var format = "%H:%i:%s";

function str_pad (str, length, pad, direction) {
    str = "" + str;
    pad = pad || "0";
    direction = direction || "left";
    if (length <= str.length) {
        return str;
    }
    while (str.length < length) {
        if (direction == "left") {
            str = pad + str;
        } else {
            str = str + pad;
        }
    }
    return str;
}

function TurningCounting (element, options) {
    this.$element = $(element);
    this.$rotateTop = this.$element.find(".rotate-top");
    this.$rotateBottom = this.$element.find(".rotate-bottom");
    this.$fixedTop = this.$element.find(".fixed-top");
    this.$fixedBottom = this.$element.find(".fixed-bottom");

    if (options) {
        this.number = options.number || 0;
        this.maxNumber = options.maxNumber || this.maxNumber;
        this.loop = options.loop !== undefined ? options.loop : this.loop;
        this.trigger = options.trigger !== undefined ? options.trigger : this.trigger;
    }

    this.$rotateTop.text(this.number);
    this.$rotateBottom.text(this.number + 1);
    this.$fixedTop.text(this.number + 1);
    this.$fixedBottom.text(this.number);
}

TurningCounting.prototype = {
    constructor: TurningCounting,
    number: null,
    maxNumber: 10,
    loop: true,
    running: false,
    $rotateTop: null,
    _rotateTopLength: 0,
    _rotateTop: function () {
        this._rotateTopLength += 18;
        this.$rotateTop.css("transform", "rotateX(" + this._rotateTopLength + "deg)");
    },
    _topInterval: null,
    _initRotateTop: function () {
        var that = this;
        this._topInterval = window.setInterval(function () {
            that._rotateTop();
            if (that._rotateTopLength == 90) {
                window.clearInterval(that._topInterval);
                that._topInterval = null;
                that._rotateTopLength = 0;
                that.$rotateTop.text(that.number).css("transform", "rotateX(0deg)");

                that._initRotateBottom();
            }
        }, 100);
    },
    $rotateBottom: null,
    _rotateBottomLength: 270,
    _bottomInterval: null,
    _rotateBottom: function () {
        this._rotateBottomLength += 18;
        this.$rotateBottom.css("transform", "rotateX(" + this._rotateBottomLength + "deg)");
    },
    _initRotateBottom: function () {
        var that = this;
        this.$rotateBottom.text(that.number);
        this._bottomInterval = window.setInterval(function () {
            that._rotateBottom();
            if (that._rotateBottomLength == 360) {
                window.clearInterval(that._bottomInterval);
                that._bottomInterval = null;
                that._rotateBottomLength = 270;
                that.$fixedBottom.text(that.number);
                that.$rotateBottom.css("transform", "rotateX(270deg)");

                that.running = false;
                if (that.loop) that._init();
            }
        }, 100);
    },
    trigger: function () {},
    _trigger: function () {
        this.trigger.call(this);
    },
    $fixedTop: null,
    $fixedBottom: null,
    _init: function () {
        this.running = true;
        this.number ++;
        if (this.number == this.maxNumber) {
            this._trigger();
            this.number = 0;
        }
        this.$fixedTop.text(this.number);
        this._initRotateTop();
    },
    start: function () {
        if (!this.running) {
            this._init();
        }
    },
    startLoop: function () {
        this.loop = true;
        if (!this.running) {
            this._init();
        }
    },
    stop: function () {
        this.loop = false;
    }
};

global.TurningCounting = TurningCounting;
})(this);
