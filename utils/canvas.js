// utils/canvasUtils.js


function darwAndsaveCanvasAsImage({
	canvasId = '#dynamicCanvas', // 画布 ID，默认值为 '#dynamicCanvas'
	shape = "circle", // 绘制形状，默认值为circle,drop
	iconSrc = '', // 图标路径，默认值为空
	width = 200, // 画布宽度，默认值为 200
	height = 200, // 画布高度，默认值为 200
	lineWidth = 10,
	strokeStyle = "#1E90FF",
	fillStyle = "#FF0000",
	gridSize = 0, // 网格线间隔，默认值为 0, 不画
	fileType = 'png', // 图片类型，默认值为 'png'
	quality = 1, // 图片质量，默认值为 1
} = {}) {
	return new Promise((resolve, reject) => {
	//	const task = () => {
			wx.createSelectorQuery()
				.select(canvasId)
				.fields({
					node: true,
					size: true,
				})
				.exec((res) => {
					if (!res || !res[0]) {
						reject(new Error('Canvas not found'));
						return;
					}

					const canvas = res[0].node;
					const ctx = canvas.getContext('2d');

					// 设置 Canvas 尺寸
					canvas.width = width;
					canvas.height = height;

					if (gridSize > 0) {
						// 绘制网格线
						ctx.strokeStyle = '#d3d3d3';
						ctx.lineWidth = 0.5;
						for (let x = 0; x <= width; x += gridSize) {
							ctx.beginPath();
							ctx.moveTo(x, 0);
							ctx.lineTo(x, height);
							ctx.stroke();
						}
						for (let y = 0; y <= height; y += gridSize) {
							ctx.beginPath();
							ctx.moveTo(0, y);
							ctx.lineTo(width, y);
							ctx.stroke();
						}
					}
          var iconSize = width / 3;
					// 绘制圆形或水滴形
					if (shape === "circle") {
						drawCircle(ctx, width, height, lineWidth, strokeStyle, fillStyle);
					}
					if (shape === "drop") {
            drawDropShape(ctx, width, height, lineWidth, strokeStyle, fillStyle);
            iconSize = iconSize*1.3;
					}

					// 绘制图标
					const img = canvas.createImage();
					img.src = iconSrc;
					img.onload = () => {
						ctx.drawImage(
							img,
							(width - iconSize) / 2,
							(height - iconSize) / 2,
							iconSize,
							iconSize
						);
						// 保存为临时图片
						wx.canvasToTempFilePath({
							canvas,
							x: 0,
							y: 0,
							width: canvas.width,
							height: canvas.height,
							destWidth: canvas.width,
							destHeight: canvas.height,
							fileType,
							quality,
							success: (result) => {
                resolve(result.tempFilePath);
							},
							fail: (err) => {
                reject(err);
							},
						});
					};

					img.onerror = () => {
            reject(new Error('Failed to load icon image'));
					};
				});

	});
}

// 绘制圆形
function drawCircle(ctx, width, height, lineWidth, strokeStyle, fillStyle) {
	const radius = width / 3;
	ctx.fillStyle = fillStyle; // 红色背景
	ctx.beginPath();
	console.log(radius, width, height);
	ctx.arc(width / 2, height / 2, radius - lineWidth, 0, Math.PI * 2);
	ctx.fill();
	ctx.lineWidth = lineWidth; // 边框宽度
	ctx.strokeStyle = strokeStyle; // 白色边框
	ctx.stroke();
}
// 绘制倒水滴形
function drawDropShape(ctx, width, height, lineWidth, strokeStyle, fillStyle) {
	const centerX = width / 2; // 水滴中心X坐标
	const centerY = height / 2; // 水滴圆心Y坐标
	const radius = centerX/1.3; // 圆形半径
	const tipY = height-10 ; // 水滴尖端Y坐标
	// 清空画布
	console.log(radius, width, height);
	// ctx.clearRect(0, 0, width, height);
	// 绘制水滴形状
	ctx.fillStyle = fillStyle;
	ctx.beginPath();
	console.log(radius, centerX, centerY);
	// 绘制顶部的半圆部分
	ctx.arc(centerX, centerY, radius - lineWidth, Math.PI, 0);
	// 从右侧圆弧连接到尖端
	ctx.quadraticCurveTo(
		centerX + radius - lineWidth, // 控制点X
		(centerY + tipY) / 2, // 控制点Y (右侧弧线弯曲的高度)
		centerX, // 尖端X
		tipY // 尖端Y
	);
	// 从尖端连接到左侧圆弧
	ctx.quadraticCurveTo(
		centerX - radius + lineWidth, // 控制点X
		(centerY + tipY) / 2, // 控制点Y (左侧弧线弯曲的高度)
		centerX - radius + lineWidth, // 左侧圆弧起点X
		centerY // 左侧圆弧起点Y
	);
	// 闭合路径并填充
	ctx.closePath();
	ctx.fill();
	// 绘制白色边框
	ctx.lineWidth = lineWidth;
	ctx.strokeStyle = strokeStyle;
	ctx.stroke();
}

module.exports = {
	darwAndsaveCanvasAsImage,
};
