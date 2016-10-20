(function () {

function isString (str) {
    return "string" === (typeof str).toLowerCase();
}

var defaults = {
        appendTo: "body",
        size: "normal",
        width: 0,
        title: "",
        closeButton: true,
        closeButtonClassName: "glyphicon glyphicon-remove",
        buttons: {},
        buttonClassName: "",
        content: "",
        contentHtml: null,
        closeWithBlank: true,
        zIndex: 1000,
        afterCreate: null,
        beforeClose: null,
        afterClose: null
    },
    SIZES = {
        normal: {
            width: 500
        }
    },
    MAX_ZINDEX = 0;

function moveToTop (Dialog) {
    var o = Dialog.options;
    if (o.zIndex > MAX_ZINDEX) {
        MAX_ZINDEX = o.zIndex;
    }
    if (Dialog.$mask) {
        MAX_ZINDEX += 1;
        Dialog.$mask.css("zIndex", MAX_ZINDEX);
    }

    MAX_ZINDEX += 1;
    Dialog.$container.css("zIndex", MAX_ZINDEX);
}

function Dialog (options) {
    if (!(this instanceof Dialog)) {
        return new Dialog(options);
    }

    this.options = $.extend({}, defaults, options);
    this.buttons = [];
    this._create();
    this._init();
}

Dialog.prototype = {
    $container: null,
    $header: null,
    $body: null,
    $footer: null,
    $mask: null,
    buttons: null,
    _createContainer: function () {
        var o = this.options,
            width = SIZES.normal.width,
            $container;

        this.$container = $container = $(document.createElement("div"))
            .addClass("dialog").hide();
        o.width && (width = o.width) || o.size && SIZES[o.size] && (width = SIZES[o.size].width);
        $container.css({ width: width });

        return $container;
    },
    _createHeader: function () {
        if (!this.options.title && !this.options.closeButton) return;

        var that = this,
            o = this.options,
            $title = $(document.createElement("h5")),
            $header;
        // 头部
        this.$header = $header = $(document.createElement("div"))
            .addClass("dialog-header");
        $title.addClass("dialog-header-title").text(o.title);
        $header.append($title);
        this.$container.append($header);
        if (o.closeButton) {
            $(document.createElement("span"))
                .addClass("dialog-header-closebtn " + o.closeButtonClassName)
                .on("click", function () {
                    that.close();
                }).appendTo($header);
        }
    },
    _createFooter: function () {
        if ($.isEmptyObject(this.options.buttons)) { return; }

        var that = this,
            o = this.options,
            $footer;
        // 尾部
        this.$footer = $footer = $(document.createElement("div"))
            .addClass("dialog-footer");
        this.$container.append($footer);
        $.each(o.buttons, function (text, options) {
            $footer.append(that._createButton(text, options));
        });
    },
    _createButton: function (text, options) {
        var $button = $(document.createElement("button"))
            .text(text), 
            o = this.options,
            className, callback;
        if ($.isFunction(options)) {
            callback = options;
            className = o.buttonClassName;
        } else {
            callback = options.callback || $.loop;
            className = options.className || o.buttonClassName;
        }
        $button.on("click", callback)
            .addClass(className);
        this.buttons.push($button);
        return $button;
    },
    _createMask: function () {
        var that = this,
            o = this.options,
            $mask;
        this.$mask = $mask = $(document.createElement("div"))
            .addClass("dialog-mask");
        $mask.css({
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            height: "100%"
        }).hide();
        $(o.appendTo).append($mask);
    },
    _create: function () {
        var that = this,
            o = this.options,
            $container, $body;

        $container = this._createContainer();
        this._createMask();
        this._createHeader();

        // 内容区
        this.$body = $body = $(document.createElement("div"))
            .addClass("dialog-body");
        $container.append($body);
        if (o.content) {
            $body.text(o.content);
        } else if (o.contentHtml) {
            $body.html(o.contentHtml);
        }

        this._createFooter();

        $container.appendTo($(o.appendTo));
        this._trigger(o.afterCreate);
    },
    _init: function () {
        var that = this,
            o = this.options;
        if (o.closeWithBlank) {
            this.$mask.on("click", function (ev) {
                that.close();
            });
        }
        // 移动
        this._draggable();
    },
    _draggable: function () {
        var that = this,
            o = this.options,
            movable = false;
        var appendTo = o.appendTo === "body" ? window : o.appendTo,
            offsetTop, offsetLeft;
        var topMin = appendTo === window ? 0 : $(appendTo).offset().top,
            topMax = topMin + $(appendTo).height(),
            leftMin = appendTo === window ? 0 : $(appendTo).offset().left,
            leftMax = leftMin + $(appendTo).width(),
            width = this.$container.width(),
            height = this.$container.height();
        this.$header.on("mousedown", function (ev) {
            var offset = that.$container.offset();
            movable = true;
            offsetTop = ev.clientY - offset.top;
            offsetLeft = ev.clientX - offset.left;
            $("body").addClass("movable");
            ev.preventDefault();
        });
        $(window).on("mouseup", function (ev) {
            movable = false;
            $("body").removeClass("movable");
            ev.preventDefault();
        }).on("mousemove", function (ev) {
            if (!movable) return;
            var x = false, y = false;
            if (topMin <= ev.clientY - offsetTop && topMax >= ev.clientY + height - offsetTop) {
                x = true;
            }
            if (leftMin <= ev.clientX - offsetLeft && leftMax >= ev.clientX + width - offsetLeft) {
                y = true;
            }
            if (x && y) {
                that.$container.css({
                    top: ev.clientY - offsetTop,
                    left: ev.clientX - offsetLeft
                });
            } else if (x) {
                that.$container.css({
                    top: ev.clientY - offsetTop
                });
            } else if (y) {
                that.$container.css({
                    left: ev.clientX - offsetLeft
                });
            }
            ev.preventDefault();
        });
    },
    _trigger: function (clbk) {

        if (!$.isFunction(clbk)) return;

        clbk.call(this);
    },
    open: function () {
        if (!this.$container) return;

        var $wrap = $(this.options.appendTo),
            $container = this.$container;
        var offset = $wrap.offset(),
            width = $wrap.width(),
            height = this.options.appendTo === "body" ? $(window).height() : $wrap.height();
        $container.css({
            left: (width - $container.width()) / 2 + offset.left,
            top: (height - $container.height()) / 2 + offset.top
        });
        moveToTop(this);
        this.$mask.show();
        $container.show();
    },
    close: function () {
        if (!this.$container) return;

        var that = this,
            o = this.options,
            g;
        this._trigger(o.beforeClose);

        this.$container.hide();
        this.$mask.hide();

        g = 0;
        $(".dialog").each(function () {
            if (this !== that.$container[0]) {
                g = Math.max(g, $(this).css("zIndex"));
            }
        });
        MAX_ZINDEX = g;

        this._trigger(o.afterClose);
    },
    destroy: function () {
        if (!this.$container) return;

        this.$container.hide();
        this.$container.remove();
        this.$mask.hide();
        this.$mask.remove();
        this.$header = this.$body = this.$footer = 
            this.$container = this.$mask = null;
    },
    getContent: function () {
        return this.$body;
    },
    setContent: function (content) {
        this.$body.html(content);
    }
};

window.Dialog = Dialog;

})();
