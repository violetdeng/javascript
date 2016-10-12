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
        buttons: {},
        content: "",
        contentHtml: null,
        closeWithBlank: true,
        afterCreate: null,
        beforeClose: null,
        afterClose: null
    },
    SIZES = {
        normal: {
            width: 500
        }
    };
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
                .addClass("dialog-header-closebtn")
                .text("X").on("click", function () {
                    that.close();
                }).appendTo($header);
        }
    },
    _createFooter: function () {
        if ($.isEmptyObject(this.options.buttons)) { return; }

        var that = this,
            o = this.options,
            $footer, $button;
        // 尾部
        this.$footer = $footer = $(document.createElement("div"))
            .addClass("dialog-footer");
        this.$container.append($footer);
        $.each(o.buttons, function (text, clbk) {
            $button = $(document.createElement("button"))
                .text(text);
            if ($.isFunction(clbk)) {
                $button.on("click", clbk);
            }
            that.buttons.push($button);
            $footer.append($button);
        });
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
        });
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
    },
    _trigger: function (clbk) {

        if (!$.isFunction(clbk)) return;

        clbk.call(this);
    },
    open: function () {
        var $wrap = $(this.options.appendTo),
            $container = this.$container;
        var offset = $wrap.offset(),
            width = $wrap.width(),
            height = this.options.appendTo === "body" ? $(window).height() : $wrap.height();
        $container.css({
            left: (width - $container.width()) / 2 + offset.left,
            top: (height - $container.height()) / 2 + offset.top
        });
        //moveToTop($container);
        $container.show();
    },
    close: function () {
        var o = this.options;
        this._trigger(o.beforeClose);
        this.$container.hide();
        this.$mask.hide();
        this._trigger(o.afterClose);
    },
    destroy: function () {
        this.$container.hide();
        this.$container.remove();
        this.$mask.hide();
        this.$mask.remove();
        this.$header = this.$body = this.$footer = 
            this.$container = this.$mask = null;
    }
};

window.Dialog = Dialog;

})();
