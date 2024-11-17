// pages/discover/discover.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isCircle: true, // 初始状态为圆形
	},
	onLoad() {

	},
	// 点击事件切换形状
	onCanvasClick() {
		this.setData({
			isCircle: !this.data.isCircle
		}, () => {
			this.drawShape(); // 根据状态重新绘制
		});
	},
	drawShape() {
		const query = this.createSelectorQuery();
		query.select('#myCanvas')
			.fields({
				node: true,
				size: true
			}).exec((res) => {
				const canvas = res[0].node; // 获取 Canvas 节点
				const ctx = canvas.getContext('2d'); // 获取 2D 上下文
				const canvasWidth = 200;
        const canvasHeight = 200;
        canvas.width = canvasWidth;
				canvas.height = canvasHeight;
				const gridSize = 10;
				// 清空画布
				ctx.clearRect(0, 0, canvasWidth, canvasHeight);
				// 设置网格线的样式
				ctx.strokeStyle = '#d3d3d3'; // 网格线颜色
				ctx.lineWidth = 0.5; // 网格线宽度
				// 绘制网格线
				for (let x = 0; x <= canvasWidth; x += gridSize) {
					// 绘制垂直线
					ctx.beginPath();
					ctx.moveTo(x, 0);
					ctx.lineTo(x, canvasHeight);
					ctx.stroke();
				}
				for (let y = 0; y <= canvasHeight; y += gridSize) {
					// 绘制水平线
					ctx.beginPath();
					ctx.moveTo(0, y);
					ctx.lineTo(canvasWidth, y);
					ctx.stroke();
				}

				var heightTo = 1;
				// 绘制形状
				if (this.data.isCircle) {
					// 设置 Canvas 尺寸
					// canvas.width = canvasWidth;
					// canvas.height = canvasHeight;
					this.drawCircle(ctx, canvasWidth, canvasHeight);
				} else {
					// heightTo = 1.5;
					// canvas.width = canvasWidth;
					// canvas.height = canvasHeight * heightTo;
					this.drawDropShape(ctx, canvas.width, canvas.height);
				}
				// 绘制图标
				const img = canvas.createImage();
				img.src = '/static/png/foot.png'; // 替换为图片路径
				img.onload = () => {
					const iconSize = 50; // 图标大小
					ctx.drawImage(
						img,
						(canvasWidth - iconSize) / 2,
						(canvasHeight - iconSize) / 2,
						iconSize,
						iconSize * heightTo
					);
				};
			});
	},
	// 绘制圆形
	drawCircle(ctx, width, height) {
		const radius = width / 4;
    const lineWidth = 10;
		ctx.fillStyle = '#ff0000'; // 红色背景
		ctx.beginPath();
		console.log(radius, width, height);
		ctx.arc(width / 2, height / 2, radius - lineWidth, 0, Math.PI * 2);
		ctx.fill();
		ctx.lineWidth = lineWidth; // 边框宽度
		ctx.strokeStyle = '#00ffff'; // 白色边框
		ctx.stroke();
	},
	// 绘制倒水滴形
	drawDropShape(ctx, width, height) {

		const centerX = width / 2; // 水滴中心X坐标
		const centerY = height/2; // 水滴圆心Y坐标
		const radius = 50; // 圆形半径
    const tipY = height - 30; // 水滴尖端Y坐标
    const lineWidth = 10;
		// 清空画布
		console.log(radius, width, height);
		// ctx.clearRect(0, 0, width, height);
		// 绘制水滴形状
		ctx.fillStyle = '#ff0000'; // 红色背景
		ctx.beginPath();
		console.log(radius, centerX, centerY);
		// 绘制顶部的半圆部分
		ctx.arc(centerX, centerY, radius-lineWidth, Math.PI, 0);
		// 从右侧圆弧连接到尖端
		ctx.quadraticCurveTo(
			centerX + radius-lineWidth, // 控制点X
			(centerY + tipY) / 2, // 控制点Y (右侧弧线弯曲的高度)
			centerX, // 尖端X
			tipY // 尖端Y
		);
		// 从尖端连接到左侧圆弧
		ctx.quadraticCurveTo(
			centerX - radius+lineWidth, // 控制点X
			(centerY + tipY) / 2, // 控制点Y (左侧弧线弯曲的高度)
			centerX - radius+lineWidth, // 左侧圆弧起点X
			centerY // 左侧圆弧起点Y
		);
		// 闭合路径并填充
		ctx.closePath();
		ctx.fill();

		// 绘制白色边框
		ctx.lineWidth = 10;
		ctx.strokeStyle = '#00ffff';
		ctx.stroke();
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {
		this.drawShape();
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh() {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage() {

	}
})
