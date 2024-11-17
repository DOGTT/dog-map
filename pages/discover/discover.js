// pages/discover/discover.js
const { darwAndsaveCanvasAsImage } = require('../../utils/canvas');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
    tempFilePathA:"",
    tempFilePathB:""
	},

	// 点击事件切换形状
	onCanvasClick() {
	
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
    darwAndsaveCanvasAsImage({
      shape: 'drop',
      gridSize: 20,
      iconSrc: '/static/png/grass.png',
    }).then((tempFilePath) => {
        console.log('图片生成成功A:', tempFilePath);
        this.setData({
          tempFilePathA:tempFilePath, // 保存路径到页面数据
        });
       
      })
      .catch((err) => {
        console.error('图片生成失败:', err);
      });

      darwAndsaveCanvasAsImage({
        shape: 'circle',
        gridSize: 20,
        iconSrc: '/static/png/grass.png',
      }).then((tempFilePath) => {
          console.log('图片生成成功B:', tempFilePath);
          this.setData({
            tempFilePathB:tempFilePath, // 保存路径到页面数据
          });
        })
        .catch((err) => {
          console.error('图片生成失败:', err);
        });
     
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {
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
