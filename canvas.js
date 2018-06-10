var canvas = document.createElement('canvas')
var ctx = canvas.getContext("2d");
canvas.width = 500
document.querySelector('body').append(canvas)

//返回context的canvas元素
console.log(ctx.canvas)

//文字录入
ctx.font = "48px serif";
ctx.strokeText("Hello world", 50, 100);

//填充样式
// ctx.fillStyle = gradient;//CanvasGradient对象 （线性或放射性渐变）
// ctx.fillStyle = pattern;//CanvasPattern 对象 （可重复图像）
ctx.fillStyle = "blue";
//
ctx.globalCompositeOperation = "xor";
//填充矩形
ctx.fillRect(0, 0, 100, 100);
ctx.fillStyle = "red";
ctx.fillRect(50, 50, 100, 100);


//不透明度
ctx.globalAlpha = 0.2;
ctx.fillStyle = '#FFF';
for (i=0;i<8;i++) {
	//开始路径
	ctx.beginPath();
	//画圆
  ctx.arc(75,75,10+10*i,//圆心 半径
    0,//圆弧的起始点， x轴方向开始计算，单位以弧度表示。
    Math.PI*2,//圆弧的终点
    true//true，逆时针绘制圆弧
	);
	//填充
	ctx.fill();
	//线条
  ctx.stroke();
}


ctx.lineCap = "butt";//线段末端以方形结束
ctx.lineCap = "round";//线段末端以圆形结束
ctx.lineCap = "square";//线段末端以方形结束，但是增加了一个宽度和线段相同，高度是线段厚度一半的矩形区域。