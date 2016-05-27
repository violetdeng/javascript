(function () {
var draw = Svg({
    "container": "J_drawWrap"
}).size(300, 300);
var rect1 = draw.rect(200, 200).attr({ fill: '#006' });
var rect2 = draw.rect(100, 100).attr({ fill: '#f06' });

rect1.moveTo(10, 10).radius(20);

var circle = draw.circle(100).moveTo(105, 105).attr({ fill: "#060" });
})();
