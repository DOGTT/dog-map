// pages/sub/channel-home/channel-home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 'members',
    channelInfo: {
      name: '狗狗乐园',
      status: '大型犬聚集',
      description: '这是一个专门为大型犬主人设立的交流社区，大家可以在这里分享养狗经验，组织线下活动。',
      location: '上海市浦东新区张江高科技园区',
      distance: '2.5'
    },
    members: [
      {
        id: 1,
        name: '张三',
        avatar: '/static/avatar/user1.png',
        role: '管理员',
        activity: 98
      },
      {
        id: 2,
        name: '李四',
        avatar: '/static/avatar/user2.png',
        role: '成员',
        activity: 85
      }
    ],
    essenceList: [
      {
        id: 1,
        title: '新手养狗必读指南',
        content: '详细介绍了养狗需要注意的各项事项...'
      }
    ],
    mediaList: [
      {
        id: 1,
        url: '/static/media/photo1.jpg'
      }
    ],
    linksList: [
      {
        id: 1,
        title: '狗狗健康检查指南',
        url: 'https://example.com/guide'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取频道ID
    const channelId = options.id;
    // TODO: 根据channelId获取频道详细信息
    this.getChannelInfo(channelId);
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

  // 获取频道信息
  getChannelInfo: function(channelId) {
    // TODO: 调用API获取频道信息
  },

  // 切换标签
  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      currentTab: tab
    });
  },

  // 返回上一页
  goBack: function() {
    wx.navigateBack();
  },

  // 导航到频道位置
  navigate: function() {
    const { latitude, longitude } = this.data.channelInfo;
    wx.openLocation({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      name: this.data.channelInfo.name,
      address: this.data.channelInfo.location
    });
  },

  // 编辑频道
  editChannel: function() {
    wx.navigateTo({
      url: '/pages/sub/channel-edit/channel-edit?id=' + this.data.channelInfo.id
    });
  },

  // 加入频道
  joinChannel: function() {
    // TODO: 调用加入频道API
    wx.showToast({
      title: '加入成功',
      icon: 'success'
    });
  },

  // 打开链接
  openLink: function(e) {
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: '/pages/web-view/web-view?url=' + encodeURIComponent(url)
    });
  }
})