// pages/map/map.js

var i = 1;
Page({
  data: {
    setting: { // 使用setting配置，方便统一还原
      rotate: 0,
      skew: 0,
      enableRotate: true,
    },
    latitude: null,
    longitude: null,
    address: '',
    scale: 14,
    circles: []
  },
  onLoad: function () {
    this.getLocation();
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

  },
  reLocation: function () {
    console.log("reLocation")
    this.getLocation(); // 重新获取位置
    const mapCtx = wx.createMapContext('map', this);
    mapCtx.moveToLocation(this.latitude, this.longitude);
  },
  getLocation: function () {
    // 获取用户的位置信息
    wx.getLocation({
      type: 'wgs84', // 返回可以用于 wx.openLocation 的经纬度
      success: (res) => {
        i++
        const latitude = res.latitude; // 纬度
        const longitude = res.longitude; // 经度
        console.log("reLocation", latitude, longitude)
        this.setData({
          setting: {
            rotate: 0,
            skew: 0,
            enableRotate: true
          },
          latitude: latitude,
          longitude: longitude,
          circles: [
            {
              latitude: latitude,
              longitude: longitude,
              radius: 1000, // 圆圈半径，单位米
              fillColor: '#00FF0033', // 半透明红色
              color: '#E6E6FA', // 圆圈边框颜色
              strokeWidth: 0 // 边框宽度
            }
          ]
        });
        // 可以在这里调用其他API，比如获取地址信息
        this.getAddress(latitude, longitude);
      },
      fail: (err) => {
        console.error('获取位置失败', err);
      }
    });
  },

  getAddress: function (latitude, longitude) {
    // 这里可以调用其他API来获取地址信息，比如腾讯地图API等
    // 示例代码略
  }


})