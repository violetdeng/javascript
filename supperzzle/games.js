var COLORS = ["black", "red", "orange", /*"yellow", */"green", "blue", "purple"];

function Block (options) {
    this.options = $.extend({}, this.options, options);
    this.setPosition(options.x, options.y);
    this._create();
}

Block.prototype = {
    _construct: Block,
    options: { 
        container: null,
        flag: null,
        x: 0,
        y: 0
    },
    _left: null,
    _hasLeft: false,
    hasLeft: function () {
        return this._hasLeft;
    },
    getLeft: function () {
        return this._left;
    },
    setLeft: function (block) {
        this._left = block;
        this._hasLeft = true;
        return this;
    },
    removeLeft: function () {
        this._left = null;
        this._hasLeft = false;
        return this;
    },
    _right: null,
    _hasRight: false,
    hasRight: function () {
        return this._hasRight;
    },
    getRight: function () {
        return this._right;
    },
    setRight: function (block) {
        this._right = block;
        this._hasRight = true;
        return this;
    },
    removeRight: function () {
        this._right = null;
        this._hasRight = false;
        return this;
    },
    _top: null,
    _hasTop: false,
    hasTop: function () {
        return this._hasTop;
    },
    getTop: function () {
        return this._top;
    },
    setTop: function (block) {
        this._top = block;
        this._hasTop = true;
        return this;
    },
    removeTop: function () {
        this._top = null;
        this._hasTop = false;
        return this;
    },
    _bottom: null,
    _hasBottom: false,
    hasBottom: function () {
        return this._hasBottom;
    },
    getBottom: function () {
        return this._bottom;
    },
    setBottom: function (block) {
        this._bottom = block;
        this._hasBottom = true;
        return this;
    },
    removeBottom: function () {
        this._bottom = null;
        this._hasBottom = false;
        return this;
    },
    dismiss: false,
    isDismiss: function () {
        return this.dismiss;
    },
    setDismiss: function () {
        this.dismiss = true;
        this.$element.remove();
        return this;
    },
    removeDismiss: function () {
        this.dismiss = false;
        return this;
    },
    getFlag: function () {
        return this.options.flag;
    },
    $element: null,
    _create: function () {
        var that = this;
        this.$element = $("<li>");
        this.$element.on("click", function () {
            change(that);
        });
    },
    show: function () {
        this.$element.text(this.options.flag);
        $(this.options.container).append(this.$element);
        return this;
    },
    _hint: false,
    setHint: function () {
        this._hint = true;
        this.$element.css("border-color", "red");
        return this;
    },
    isHint: function () {
        return this._hint;
    },
    removeHint: function () {
        this._hint = false;
        this.$element.css("border-color", "white");
        return this;
    },
    _x: 0,
    _y: 0,
    setPosition: function (x, y) {
        this._x = x;
        this._y = y;
        return this;
    },
    getPosition: function () {
        return [this._x, this._y];
    }
};

function Supperzzle () {
}

Supperzzle.prototype = {
    _construct: Supperzzle,
    _init: function () {
    }
};

var container = $(".game-container>ul"),
    last;

var blocks = [],
    size = 6,
    flag;

// fill
for (var i = 0; i <= size; i ++) {
    blocks[i] = [];
    last = null;
    for (var j = 0; j <= size; j ++) {
        flag = getRandom();
        blocks[i][j] = (new Block({ flag: flag, container: container, x: i, y: j}));
        if (last) {
            blocks[i][j].setLeft(last);
            last.setRight(blocks[i][j]);
        }
        if (i != 0) {
            blocks[i-1][j].setBottom(blocks[i][j]);
            blocks[i][j].setTop(blocks[i-1][j]);
        }
        last = blocks[i][j];
        blocks[i][j].show();
        blocks[i][j].$element.css({
            "color": COLORS[flag],
            "top": i * 60,
            "left": j * 60
        });
    }
}
// 横向
function judgeX () {
    var results = [],
        same, block, last;
    for (var i = 0; i <= size; i ++) {
        last = null;
        same = [];
        for (var j = 0; j <= size; j ++) {
            block = blocks[i][j];
            if (null !== last && last != block.getFlag()) {
                if (same.length >= 3) {
                    results.push(same);
                }
                same = [];
            }
            same.push(block);
            last = blocks[i][j].getFlag();
        }
        if (same.length >= 3) {
            results.push(same);
        }
    }
    return results;
}

// 纵向
function judgeY () {
    var results = [],
        block, same, last;
    for (var i = 0; i <= size; i ++) {
        last = null;
        same = [];
        for (var j = 0; j <= size; j ++) {
            block = blocks[j][i];
            if (null !== last && last != block.getFlag()) {
                if (same.length >= 3) {
                    results.push(same);
                }
                same = [];
            }
            same.push(block);
            last = block.getFlag();
        }
        if (same.length >= 3) {
            results.push(same);
        }
    }
    return results;
}

function getRandom () {
    return Math.abs(Math.floor(Math.random() * 10 - 1));
}

function judge () {
    var dismissX = judgeX();
    for (var i = 0; i < dismissX.length; i ++) {
        for (var j = 0; j < dismissX[i].length; j ++) {
            dismissX[i][j].setDismiss();
        }
    }

    var dismissY = judgeY();
    for (i = 0; i < dismissY.length; i ++) {
        for (j = 0; j < dismissY[i].length; j ++) {
            dismissY[i][j].setDismiss();
        }
    }

    function getToper (i, j) {
        while (i >= 0 && blocks[i][j]) {
            if (!blocks[i][j].isDismiss()) {
                return i;
            }
            i --;
        }
        return null;
    }

    function fillY (i, j) {
        var k, block, l;
        if (i >= 0 && blocks[i][j]) {
            if (blocks[i][j].isDismiss()) {
                k = getToper(i, j);
                l = i;
                if (k !== null) {
                    block = blocks[i][j];
                    if (block.hasBottom()) {
                        block.getBottom().setTop(blocks[k][j]);
                        blocks[k][j].setBottom(block.getBottom());
                    } else {
                        blocks[k][j].removeBottom();
                    }
                    l = i;
                    while (k >= 0 && blocks[k][j]) {
                        blocks[l][j] = blocks[k][j];
                        blocks[l][j].setPosition(l, j);
                        k --; l --; 
                    }
                } 
                while (l >= 0) {
                    blocks[l][j] = null;
                    l --; 
                }
            }
            fillY(i - 1, j);
        }
    }

    var flag;
    for (i = 0; i <= size; i ++) {
        fillY(size, i);
        for (j = 0; j <= size; j ++) {
            if (null === blocks[j][i]) {
                flag = getRandom();
                blocks[j][i] = (new Block({ flag: flag, container: container, x: j, y: i})).show();
                blocks[j][i].$element.css({
                    "color": COLORS[flag],
                    "top": 0,
                    "left": i * 60
                });
            }
            if (j > 0) {
                blocks[j][i].setTop(blocks[j-1][i]);
                blocks[j-1][i].setBottom(blocks[j][i]);
            }
        }
        blocks[0][i].removeTop();
    }

    for (i = size; i >= 0; i --) {
        for (j = size; j >= 0; j --) {
            if (j == size) {
                blocks[i][j].removeRight();
            } else {
                blocks[i][j].setRight(blocks[i][j+1]);
            }
            if (j == 0) {
                blocks[i][j].removeLeft();
            } else {
                blocks[i][j].setLeft(blocks[i][j-1]);
            }
            blocks[i][j].$element.animate({"top": i * 60}, 50);
        }
    }

    return [dismissX, dismissY];
}

var CHANGE = [];
function change (block) {
    function ex (block) {
        var tmp;
        if (block.hasTop()) {
            tmp = block.getTop();
        } else {
            CHANGE[0].removeTop();
        }
        if (CHANGE[0].hasTop()) {
            block.setTop(CHANGE[0].getTop());
            CHANGE[0].getTop().setBottom(block);
        } else {
            block.removeTop();
        }
        if (tmp) {
            CHANGE[0].setTop(tmp);
            tmp.setBottom(CHANGE[0]);
            tmp = null;
        }

        if (block.hasBottom()) {
            tmp = block.getBottom();
        } else {
            CHANGE[0].removeBottom();
        }
        if (CHANGE[0].hasBottom()) {
            block.setBottom(CHANGE[0].getBottom());
            CHANGE[0].getBottom().setTop(block);
        } else {
            block.removeBottom();
        }
        if (tmp) {
            CHANGE[0].setBottom(tmp);
            tmp.setTop(CHANGE[0]);
            tmp = null;
        }

        if (block.hasLeft()) {
            tmp = block.getLeft();
        } else {
            CHANGE[0].removeLeft();
        }
        if (CHANGE[0].hasLeft()) {
            block.setLeft(CHANGE[0].getLeft());
            CHANGE[0].getLeft().setRight(block);
        } else {
            block.removeLeft();
        }
        if (tmp) {
            CHANGE[0].setLeft(tmp);
            tmp.setRight(CHANGE[0]);
            tmp = null;
        }

        if (block.hasRight()) {
            tmp = block.getRight();
        } else {
            CHANGE[0].removeRight();
        }
        if (CHANGE[0].hasRight()) {
            block.setRight(CHANGE[0].getRight());
            CHANGE[0].getRight().setLeft(block);
        } else {
            block.removeRight();
        }
        if (tmp) {
            CHANGE[0].setRight(tmp);
            tmp.setLeft(CHANGE[0]);
            tmp = null;
        }
    }
    function ey (block) {
        var tmp, tmp2;
        tmp = CHANGE[0].getPosition();
        tmp2 = block.getPosition();
        CHANGE[0].setPosition(tmp2[0], tmp2[1]);
        block.setPosition(tmp[0], tmp[1]);
        blocks[tmp[0]][tmp[1]] = block;
        blocks[tmp2[0]][tmp2[1]] = CHANGE[0];
        CHANGE[0].$element.animate({
            "top": tmp2[0] * 60,
            "left": tmp2[1] * 60
        }, 30);
        block.$element.animate({
            "top": tmp[0] * 60,
            "left": tmp[1] * 60
        }, 30);
    }
    if (block.isHint()) {
        CHANGE = [];
        block.removeHint();
        return;
    }
    block.setHint();
    if (CHANGE.length) {
        var tmp;
        if ((block.hasTop() && block.getTop().isHint()) ||
            (block.hasBottom() && block.getBottom().isHint()) ||
            (block.hasLeft() && block.getLeft().isHint()) ||
            (block.hasRight() && block.getRight().isHint())) {
            // 交换位置
            ex(block);
            ey(block);
            if (dismiss() <= 0) {
                tmp = CHANGE[0];
                CHANGE = [];
                CHANGE.push(block);
                ex(tmp);
                ey(tmp);
                tmp.removeHint();
            } else {
                CHANGE[0].removeHint();
                dismiss();
            }
            block.removeHint();
            
        } else {
            CHANGE[0].removeHint();
            block.removeHint();
        } 
        CHANGE = [];
    } else {
        CHANGE.push(block);
    }
}

var score = 0;
function dismiss (once) {
    var tmp;
    function cal (x, y) {
        var score = 0, tmp;
        for (var i = 0; i < x.length; i ++) {
            tmp = x[i];
            switch (tmp.length) {
                case 3:
                    score += 3;
                    break;
                case 4:
                    score += 4 * 1.5;
                    break;
                default:
                    score += 5 * 2.5;
            }
        }
        for (var i = 0; i < y.length; i ++) {
            tmp = y[i];
            switch (tmp.length) {
                case 3:
                    score += 3;
                    break;
                case 4:
                    score += 4 * 1.5;
                    break;
                default:
                    score += 5 * 2.5;
            }
        }
        return score;
    }
    if (once) {
        tmp = judge();
        if (tmp[0].length + tmp[1].length > 0) {
            score += cal(tmp[0], tmp[1]);
        }
        return tmp[0].length + tmp[1].length;
    }

    while (true) {
        tmp = judge();
        if ((tmp = cal(tmp[0], tmp[1])) <= 0) {
            break;
        }
        score += tmp;
    }
    $(".game-score b").text(score);
}

dismiss();
