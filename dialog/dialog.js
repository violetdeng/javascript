(function () {

function isString (str) {
    return "string" === (typeof str).toLowerCase();
}

var defaults = {
        appendTo: "body",
        withMask: true,
        size: "normal",
        width: 0,
        title: "",
        closeButton: true,
        buttons: {},
        content: "",
        contentHtml: null,
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
}

Dialog.prototype = {
    $container: null,
    $header: null,
    $body: null,
    $footer: null,
    $mask: null,
    width: null,
    buttons: null,
    _create: function () {
        var that = this,
            options = this.options,
            $title = $(document.createElement("h5")),
            width,
            $container, $header, $body, $footer,
            $closeButton, $button;

        this.$container = $container = $(document.createElement("div"))
            .addClass("dialog").hide();
        if (options.width) {
            width = options.width;
        } else if (options.size && SIZES[options.size]) {
            width = SIZES[options.size].width;
        } else {
            width = SIZES.normal.width;
        }
        this.width = width;
        $container.css({ width: width });
        this.$mask = $(document.createElement("div"));

        // 头部
        this.$header = $header = $(document.createElement("div"))
            .addClass("dialog-header");
        $title.addClass("dialog-header-title").text(options.title);
        $header.append($title);
        $container.append($header);
        if (options.closeButton) {
            $closeButton = $(document.createElement("span"))
                .addClass("dialog-header-closebtn")
                .text("X").on("click", function () {
                    that.close();
                });
            $header.append($closeButton);
        }

        // 内容区
        this.$body = $body = $(document.createElement("div"))
            .addClass("dialog-body");
        $container.append($body);
        if (options.content) {
            $body.text(options.content);
        } else if (options.contentHtml) {
            $body.html(options.contentHtml);
        }

        // 尾部
        this.$footer = $footer = $(document.createElement("div"))
            .addClass("dialog-footer");
        $container.append($footer);
        $.each(options.buttons, function (text, clbk) {
            $button = $(document.createElement("button"))
                .text(text);
            if (isString(clbk)) {
                switch (clbk) {
                    case "close":
                        $button.on("click", function () {
                            that.close();
                        });
                        break;
                }
            } else if ($.isFunction(clbk)) {
                $button.on("click", clbk);
            }
            that.buttons.push($button);
            $footer.append($button);
        });

        $container.appendTo($(options.appendTo));
        this._trigger(options.afterCreate);
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
            left: (width - this.width) / 2 + offset.left,
            top: (height - this.$container.height()) / 2 + offset.top
        }).show();
    },
    close: function () {
        var o = this.options;
        this._trigger(o.beforeClose);
        this.$container.hide();
        this._trigger(o.afterClose);
    },
    destroy: function () {
        this.$header = null;
        this.$body = null;
        this.$footer = null;
        this.$container.remove();
        this.$container = null;
    }
};

window.Dialog = Dialog;

})();
