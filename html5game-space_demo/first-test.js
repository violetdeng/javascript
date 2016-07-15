var CANVAS_WIDTH = 480;
var CANVAS_HEIGHT = 320;

var canvasElement = $("<canvas width='" + CANVAS_WIDTH +
        "' height='" + CANVAS_HEIGHT + "'></canvas>");
var canvas = canvasElement.get(0).getContext("2d");
canvasElement.appendTo("body");

var FPS = 30;
var textX = 50;
var textY = 50;
// Pro Tip: Be sure to run your app after making changes. 
// If something breaks it's a lot easier to track down 
// when there's only a few lines of changes to look at.
setInterval(function () {
    update();
    draw();
}, 1000/FPS);

function update() {
    textX += 1;
    textY += 1;
}
function draw() {
    canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    canvas.fillStyle = "#000";
    canvas.fillText("Violet", textX, textY);
}
