var CANVAS_WIDTH = 480;
var CANVAS_HEIGHT = 320;

var canvasElement = $("<canvas width='" + CANVAS_WIDTH +
        "' height='" + CANVAS_HEIGHT + "'></canvas>");
var canvas = canvasElement.get(0).getContext("2d");
canvasElement.appendTo("body");

Number.prototype.clamp = Number.prototype.clamp || function (a, b) {
    if (this < a) return a;
    else if (this > b) return b;
    else return this;
};


var playerBullets = [];
var enemies = [];
var bg = Sprite("bg");

var scoreboard = {
    score: 0,
    font: "30px Verdana",
    color: "#FFF",
    x: 20,
    y: 50,
    draw: function () {
        canvas.font = this.font;
        canvas.fillStyle = this.color;
        canvas.fillText("得分：" + this.score, this.x, this.y);
    },
    update: function () {
        this.score ++;
    }
};


function Bullet (I) {
    I.active = true;

    I.xVelocity = 0;
    I.yVelocity = -I.speed;
    I.width = 3;
    I.height = 3;
    I.color = "#0FF";

    I.inBounds = function() {
        return I.x >= 0 && I.x <= CANVAS_WIDTH &&
            I.y >= 0 && I.y <= CANVAS_HEIGHT;
    };

    I.draw = function() {
        canvas.fillStyle = this.color;
        canvas.fillRect(this.x, this.y, this.width, this.height);
    };

    I.update = function() {
        I.x += I.xVelocity;
        I.y += I.yVelocity;

        I.active = I.active && I.inBounds();
    };

    return I;
}

var player = {
    active: true,
    color: "#00A",
    x: 220,
    y: 270,
    blood: 5,
    width: 32,
    height: 32,
    sprite: Sprite("player"),
    draw: function () {
        this.sprite.draw(canvas, this.x, this.y);
        //canvas.fillStyle = this.color;
        //canvas.fillRect(this.x, this.y, this.width, this.height);
    },
    rest: false,
    shoot: function () {
        if (this.rest) return;
        this.rest = true;
        var that = this;
        setTimeout(function () {
            that.rest = false;
        }, 80);
        var bulletPosition = this.midpoint();

        playerBullets.push(Bullet({
            speed: 5,
            x: bulletPosition.x,
            y: bulletPosition.y
        }));

        Sound.play("shoot");
    },
    midpoint: function () {
        return {
            x: this.x + this.width/2,
            y: this.y + this.height/2
        };
    },
    explode: function () {
        this.blood --;
        if (this.blood < 0) {
            this.active = false;
            Sound.play("game_over");
        }
    }
};

var FPS = 30;
var keydown = {};
// Pro Tip: Be sure to run your app after making changes. 
// If something breaks it's a lot easier to track down 
// when there's only a few lines of changes to look at.
var INTERVAL = setInterval(function () {
    update();
    draw();
}, 1000/FPS);

function end() {
    clearInterval(INTERVAL);
    enemies = [];
    draw();
}

function update() {
    if (keydown.space) {
        player.shoot();
    }
    if (keydown.left) {
        player.x -= 5;
    }
    if (keydown.right) {
        player.x += 5;
    }
    if (!player.active) {
        end();
    }
    player.x = player.x.clamp(0, CANVAS_WIDTH - player.width);

    playerBullets.forEach(function (bullet) {
        bullet.update();
    });
    playerBullets = playerBullets.filter(function (bullet) {
        return bullet.active;
    });

    enemies.forEach(function(enemy) {
        enemy.update();
    });
    enemies = enemies.filter(function(enemy) {
        return enemy.active;
    });
    if (Math.random() < 0.05) {
        enemies.push(Enemy());
    }

    handleCollisions();
}
function draw() {
    canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    bg.draw(canvas, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    if (player.active) {
        player.draw();
        scoreboard.draw();
    } else {
        canvas.font = "30px Verdana";
        canvas.fillStyle = "#FFF";
        canvas.fillText("Game Over", (CANVAS_WIDTH - 150) / 2, CANVAS_HEIGHT / 2);
    }

    playerBullets.forEach(function (bullet) {
        bullet.draw();
    });

    enemies.forEach(function (enemy) {
        enemy.draw();
    });
}

// keyboard controls
function keyName(event) {
    return jQuery.hotkeys.specialKeys[event.which] ||
        String.fromCharCode(event.which).toLowerCase();
}
$(document).bind("keydown", function(event) {
    keydown[keyName(event)] = true;
});
$(document).bind("keyup", function(event) {
    keydown[keyName(event)] = false;
});


function Enemy(I) {
    I = I || {};

    I.active = true;
    I.age = Math.floor(Math.random() * 128);

    I.color = "#A2B";

    I.x = CANVAS_WIDTH / 4 + Math.random() * CANVAS_WIDTH / 2;
    I.y = 0;
    I.xVelocity = 0;
    I.yVelocity = 2;
    I.blood = 3;

    I.width = 32;
    I.height = 32;

    I.inBounds = function() {
        return I.x >= 0 && I.x <= CANVAS_WIDTH &&
            I.y >= 0 && I.y <= CANVAS_HEIGHT;
    };

    I.sprite = Sprite("enemy");
    I.draw = function() {
        this.sprite.draw(canvas, this.x, this.y);
        //canvas.fillStyle = this.color;
        //canvas.fillRect(this.x, this.y, this.width, this.height);
    };

    I.update = function() {
        I.x += I.xVelocity;
        I.y += I.yVelocity;

        I.xVelocity = 3 * Math.sin(I.age * Math.PI / 64);

        I.age++;

        I.active = I.active && I.inBounds();
    };

    I.hit = function () {
        this.blood --;
        if (this.blood < 0) {
            this.active = false;
            Sound.play("explosion");
            scoreboard.update();
        }
    };

    I.explode = function () {
        this.active = false;
        Sound.play("explosion");
        scoreboard.update();
    };
    return I;
};

function collides(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}

function handleCollisions(time) {
    playerBullets.forEach(function(bullet) {
        enemies.forEach(function(enemy) {
            if (collides(bullet, enemy)) {
                enemy.hit();
                bullet.active = false;
            }
        });
    });

    enemies.forEach(function(enemy) {
        if (collides(enemy, player) && enemy.active) {
            enemy.explode();
            player.explode();
        }
    });
}

