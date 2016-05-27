(function () {

var canvas = document.getElementById("tutorial");
// 检查支持性
if (canvas.getContext) {
    var ctx = canvas.getContext("2d");

    // 矩形
    // fillRect(x, y, width, height)
    // 绘制一个填充的矩形
    // strokeRect(x, y, width, height) 如何指定线条颜色
    // 绘制一个矩形的边框
    // clearRect(x, y, width, height)
    // 清除指定矩形区域，让清除部分完全透明。
    //ctx.fillStyle = "rgb(200,0,0)";
    //ctx.fillRect(10, 10, 55, 50);

    //ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
    //ctx.fillRect(30, 30, 55, 50);

    ctx.fillRect(25,25,100,100);
    ctx.clearRect(45,45,60,60);
    ctx.strokeRect(50,50,50,50);


    // 路径
    // beginPath()
    // 新建一条路径，生成之后，图形绘制命令被指向到路径上生成路径。
    // closePath()
    // 闭合路径之后图形绘制命令又重新指向到上下文中。
    // stroke()
    // 通过线条来绘制图形轮廓。
    // fill()
    // 通过填充路径的内容区域生成实心的图形。

    // moveTo(x, y)
    // 将笔触移动到指定的坐标x以及y上
    // lineTo(x, y)
    // 绘制一条从当前位置到指定x以及y位置的直线
    // arc(x, y, radius, startAngle, endAngle, anticlockwise)
    // 画一个以（x,y）为圆心的以radius为半径的圆弧（圆），从startAngle开始到endAngle结束，按照anticlockwise给定的方向（默认为顺时针）来生成
    // arcTo(x1, y1, x2, y2, radius)
    // 根据给定的控制点和半径画一段圆弧，再以直线连接两个控制点
    // quadraticCurveTo(cp1x, cp1y, x, y)
    // 绘制二次贝塞尔曲线，x,y为结束点，cp1x,cp1y为控制点。
    // bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
    // 绘制三次贝塞尔曲线，x,y为结束点，cp1x,cp1y为控制点一，cp2x,cp2y为控制点二
    // rect(x, y, width, height)
    // 绘制一个左上角坐标为（x,y），宽高为width以及height的矩形
    ctx.beginPath();
    ctx.moveTo(175,150);
    ctx.lineTo(200,175);
    ctx.lineTo(200,125);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(75,75,50,0,Math.PI*2,true); // 绘制
    ctx.moveTo(110,75);
    ctx.arc(75,75,35,0,Math.PI,false);   // 口(顺时针)
    ctx.moveTo(65,65);
    ctx.arc(60,65,5,0,Math.PI*2,true);  // 左眼
    ctx.moveTo(95,65);
    ctx.arc(90,65,5,0,Math.PI*2,true);  // 右眼
    ctx.stroke();
} else {
    // not supported
}

})();
