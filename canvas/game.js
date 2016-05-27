(function () {

var canvas = document.getElementById("game");

if (canvas.getContext) {
    var ctx = canvas.getContext("2d");

    roundedRect(ctx,12,12,250,250,15);
    roundedRect(ctx,19,19,250,250,9);
    roundedRect(ctx,53,53,49,33,10);
    roundedRect(ctx,53,119,49,16,6);
    roundedRect(ctx,135,53,49,33,10);
    roundedRect(ctx,135,119,25,49,10);

    ctx.beginPath();
    ctx.arc(37,37,13,Math.PI/7,-Math.PI/7,false);
    ctx.lineTo(31,37);
    ctx.fill();

    for(var i=0;i<8;i++){
        ctx.fillRect(51+i*16,35,4,4);
    }

    for(i=0;i<6;i++){
        ctx.fillRect(115,51+i*16,4,4);
    }

    for(i=0;i<8;i++){
        ctx.fillRect(51+i*16,99,4,4);
    }

    drawMonster(ctx, 80, 88, "blue");
    drawMonster(ctx, 130, 88, "green");
}

// 封装的一个用于绘制圆角矩形的函数.
function roundedRect(ctx,x,y,width,height,radius) {
    ctx.beginPath();
    ctx.moveTo(x,y+radius);
    ctx.lineTo(x,y+height-radius);
    ctx.quadraticCurveTo(x,y+height,x+radius,y+height);
    ctx.lineTo(x+width-radius,y+height);
    ctx.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);
    ctx.lineTo(x+width,y+radius);
    ctx.quadraticCurveTo(x+width,y,x+width-radius,y);
    ctx.lineTo(x+radius,y);
    ctx.quadraticCurveTo(x,y,x,y+radius);
    ctx.stroke();
}

// x : x平移
// y : y平移
function drawMonster(ctx, x, y, fillColor) {
    function handleX (value) {
        return x + value;
    }
    function handleY (value) {
        return y + value;
    }
    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.moveTo(handleX(0), handleY(28));
    ctx.lineTo(handleX(0), handleY(14));
    ctx.bezierCurveTo(handleX(0),  handleY(6), handleX(6),  handleY(0), handleX(14), handleY(0));
    ctx.bezierCurveTo(handleX(22), handleY(0), handleX(28), handleY(6), handleX(28), handleY(12));
    ctx.lineTo(handleX(28),     handleY(28));
    ctx.lineTo(handleX(23.277), handleY(23.277));
    ctx.lineTo(handleX(18.444), handleY(28));
    ctx.lineTo(handleX(13.711), handleY(23.277));
    ctx.lineTo(handleX(8.978),  handleY(28));
    ctx.lineTo(handleX(4.733),  handleY(23.277));
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.moveTo(handleX(8), handleY(8));
    ctx.bezierCurveTo(handleX(5),  handleY(8),  handleX(4),  handleY(11), handleX(4),  handleY(13));
    ctx.bezierCurveTo(handleX(4),  handleY(15), handleX(5),  handleY(18), handleX(8),  handleY(18));
    ctx.bezierCurveTo(handleX(11), handleY(18), handleX(12), handleY(15), handleX(12), handleY(13));
    ctx.bezierCurveTo(handleX(12), handleY(11), handleX(11), handleY(8),  handleX(9),  handleY(8));
    ctx.moveTo(handleX(20), handleY(8));
    ctx.bezierCurveTo(handleX(17), handleY(8),  handleX(16), handleY(11), handleX(16), handleY(13));
    ctx.bezierCurveTo(handleX(16), handleY(15), handleX(17), handleY(18), handleX(20), handleY(18));
    ctx.bezierCurveTo(handleX(23), handleY(18), handleX(24), handleY(15), handleX(24), handleY(13));
    ctx.bezierCurveTo(handleX(24), handleY(11), handleX(23), handleY(8),  handleX(21), handleY(8));
    ctx.fill();

    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.arc(handleX(18), handleY(14), 2, 0, Math.PI*2, true);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(handleX(6), handleY(14), 2, 0, Math.PI*2, true);
    ctx.fill();
}

})();
