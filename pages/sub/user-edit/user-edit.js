// pages/sub/user-edit/user-edit.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      datePickerShow: false,
      genderBoxShow: false,
      genderText: [
        '未知','弟弟','妹妹'
      ],
      gender: 0,
      weightSizeBoxShow: false,
      weightSizeSimpleText:[
        '未知','XS','S','M','L','XL'
      ],
      weightSizeText:[
        '未知','XS-超小  [0-4kg]','S-小  [4-10kg]','M-中  [10-30kg]','L-大  [30-50kg]','XL-超大  [50-∞kg]'
      ],
      weightSize: 3,
      currentDate: new Date().getTime(),
      minDate: new Date().getTime(),
      formatter(type, value) {
        if (type === 'year') {
          return `${value}年`;
        }
        if (type === 'month') {
          return `${value}月`;
        }
        return `${value}日`;
      },

      name: "香香",
      intro: "香了个香",
      birthday: "2023-02-10",
      breed: "未知"
    },
    goBack() {
        wx.navigateBack(); // 返回到上一页
    },

    onWeightSizeSelected(e) {
      console.log("onWeightSizeSelected",e);
      this.setData({
        weightSize: e.currentTarget.dataset.id,
        weightSizeBoxShow:false
      });
    },
    onWeightSizeTap() {
      this.setData({
        weightSizeBoxShow:!this.data.weightSizeBoxShow
      })
    },
    onGenderSelected(e) {
      console.log("onGenderSelected",e);
      this.setData({
        gender: e.currentTarget.dataset.id,
        genderBoxShow:false
      });
    },
    onGenderTap() {
      this.setData({
        genderBoxShow:!this.data.genderBoxShow
      })
    },
    onBirthDayTap(){
      this.setData({
        datePickerShow:true
      })
    },

    ondatePickerClose(){
      this.setData({
        datePickerShow:false
      })
    },

    onDrag(event) {
        this.setData({
            currentValue: event.detail.value,
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