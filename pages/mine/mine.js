// pages/mine.js
const app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
    loginPopupShow: false,
		tabs: ["标签1", "标签2", "标签3"], // 标签内容
		activeTab: 0 // 当前激活的标签索引
	},
	// 切换标签
	switchTab(e) {
		const index = e.currentTarget.dataset.index;
		this.setData({
			activeTab: index
		});
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
 
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {
    const token = wx.getStorageSync('token');
    if (token) {
      // token 存在
      console.log('Token exists:', token);
    
    } else {
      // token 不存在
      console.log('Token does not exist');
      this.setData(
        {
          loginPopupShow:true,
        }
      );
    }
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
