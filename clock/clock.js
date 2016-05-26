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
        this.nextNumber = this.number;
        this.maxNumber = options.maxNumber || this.maxNumber;
        this.loop = options.loop !== undefined ? options.loop : this.loop;
        this.trigger = options.trigger !== undefined ? options.trigger : this.trigger;
        this.change = options.change !== undefined ? options.change : this.change;
    }

    this.$rotateTop.text(this.number);
    this.$rotateBottom.text(this.number + 1);
    this.$fixedTop.text(this.number + 1);
    this.$fixedBottom.text(this.number);
}

TurningCounting.prototype = {
    constructor: TurningCounting,
    number: 0,
    nextNumber: 0,
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
                that._change();
                if (that.loop) that._init();
            }
        }, 100);
    },
    change: function () {},
    _change: function () {
        this.change.call(this);
    },
    trigger: function () {},
    _trigger: function () {
        this.trigger.call(this);
    },
    $fixedTop: null,
    $fixedBottom: null,
    _init: function () {
        this.running = true;
        this.nextNumber ++;
        this.number = this.nextNumber;
        if (this.number >= this.maxNumber) {
            this._trigger();
            this.nextNumber = this.number = 0;
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
    },
    setNumber: function (number) {
        this.nextNumber = number;
    },
    setMaxNumber: function (number) {
        this.maxNumber = number;
        if (this.number > number) {
            this.number = 0;
        }
    }
};

global.TurningCounting = TurningCounting;

function Clock (element) {
    this.$element = $(element);
    this._init();
}
Clock.prototype = {
    constructor: Clock,
    _init: function () {
        var date = this._getCurrentTime();
        var second = date.second,
            minute = date.minute,
            hour = date.hour;
        var that = this,
            $element = this.$element;
        this.secondBit = new TurningCounting($element.find(".second-bit"), {
            number: second[1] || second[0],
            trigger: function () {
                that.secondTen.start();
            }
        });
        this.secondTen = new TurningCounting($element.find(".second-ten"), {
            number: second[1] ? second[0] : 0,
            maxNumber: 6,
            loop: false,
            change: function () {
                if (this.number == 5) {
                    // 每分钟修正一次时间
                    that._fixed();
                }
            },
            trigger: function () {
                that.minuteBit.start();
            }
        });
        this.minuteBit = new TurningCounting($element.find(".minute-bit"), {
            number: minute[1] || minute[0],
            loop: false,
            trigger: function () {
                that.minuteTen.start();
            }
        });
        this.minuteTen = new TurningCounting($element.find(".minute-ten"), {
            number: minute[1] ? minute[0] : 0,
            maxNumber: 6,
            loop: false,
            trigger: function () {
                that.hourBit.start();
            }
        });
        this.hourBit = new TurningCounting($element.find(".hour-bit"), {
            number: hour[1] || hour[0],
            maxNumber: date.maxFixed ? 4 : 10,
            loop: false,
            trigger: function () {
                that.hourTen.start();
            }
        });
        this.hourTen = new TurningCounting($element.find(".hour-ten"), {
            number: hour[1] ? hour[0] : 0,
            maxNumber: 2,
            loop: false,
            change: function () {
                if (this.number == 2) {
                    that.hourBit.setMaxNumber(4);
                } else {
                    that.hourBit.setMaxNumber(10);
                }
            }
        });
    },
    _getCurrentTime: function () {
        var date = new Date();
        return {
            "second": ("" + date.getSeconds()).split(""),
            "minute": ("" + date.getMinutes()).split(""),
            "hour": ("" + date.getHours()).split(""),
            "maxFixed": date.getHours() > 19 ? true : false
        };
    },
    _fixed: function () {
        var date = this._getCurrentTime();
        var secondBit = date.second[1] || date.second[0],
            secondTen = date.second[1] ? date.second[0] : 0,
            minuteBit = date.minute[1] || date.minute[0],
            minuteTen = date.minute[1] ? date.minute[0] : 0,
            hourBit = date.hour[1] || date.hour[0],
            hourTen = date.hour[1] ? date.hour[0] : 0;
        if (this.hourTen.number != hourTen) this.hourTen.setNumber(hourTen);
        if (this.hourBit.number != hourBit) this.hourBit.setNumber(hourBit);
        if (this.minuteTen.number != minuteTen) this.minuteTen.setNumber(minuteTen);
        if (this.minuteBit.number != minuteBit) this.minuteBit.setNumber(minuteBit);
        if (this.secondTen.nextNumber < secondTen) this.secondTen.setNumber(secondTen);
        if (this.secondBit.nextNumber < secondBit) this.secondBit.setNumber(secondBit);
    },
    getTime: function () {
        return {
            "hour": parseInt("" + this.hourTen.number + this.hourBit.number),
            "minute": parseInt("" + this.minuteTen.number + this.minuteBit.number),
            "second": parseInt("" + this.secondTen.number + this.secondBit.number)
        };
    },
    start: function () {
        this.secondBit.start();
    }
};

global.Clock = Clock;
})(this);
