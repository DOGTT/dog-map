// pages/sub/channel-home/channel-home.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentTab: 'members',
        isEditingIntro: false,
        isJoined: false,
        channelInfo: {
            name: '狗狗乐园',
            status: '',
            intro: '这里适合狗狗放开随便玩，大家可以在这里自由发言，组织线下活动。',
            location: '上海市浦东新区张江高科技园区',
            distance: '2.5'
        },
        members: [{
            id: 1,
            name: '张三',
            avatar: '/static/avatar/user1.png',
            role: '发现者',
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
        essenceList: [{
            id: 1,
            title: '新手养狗必读指南',
            content: '详细介绍了养狗需要注意的各项事项...'
        }],
        mediaList: [{
            id: 1,
            url: '/static/media/photo1.jpg'
        }],
        linksList: [{
            id: 1,
            title: '狗狗健康检查指南',
            url: 'https://example.com/guide'
        }]
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
    getChannelInfo: function (channelId) {
        // TODO: 调用API获取频道信息
    },

    // 切换标签
    switchTab: function (e) {
        const tab = e.currentTarget.dataset.tab;
        this.setData({
            currentTab: tab
        });
    },

    // 返回上一页
    goBack: function () {
        wx.navigateBack();
    },

    // 导航到频道位置
    navigate: function () {
        const {
            latitude,
            longitude
        } = this.data.channelInfo;
        wx.openLocation({
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            name: this.data.channelInfo.name,
            address: this.data.channelInfo.location
        });
    },

    // 编辑频道
    editChannel: function () {
        wx.navigateTo({
            url: '/pages/sub/channel-edit/channel-edit?id=' + this.data.channelInfo.id
        });
    },

    // 处理加入/进入频道的动作
    handleJoinAction: function () {
        if (this.data.isJoined) {
            // 已加入，直接进入频道
            this.enterChannel();
        } else {
            // 未加入，先关注再进入
            this.joinChannel();
        }
    },

    // 加入频道
    joinChannel: function () {
        // TODO: 调用加入频道API
        wx.showLoading({
            title: '加入中...'
        });
        setTimeout(() => {
            wx.hideLoading();
            this.setData({
                isJoined: true
            });
            wx.showToast({
                title: '加入成功',
                icon: 'success'
            });
            // 加入成功后自动进入频道
            this.enterChannel();
        }, 1000);
    },

    // 进入频道
    enterChannel: function () {
        // 获取频道ID
        const channelId = this.data.channelInfo.id;
        // 跳转到频道主页
        wx.navigateTo({
            url: '/pages/sub/channel-main/channel-main?id=' + channelId
        });
    },

    // 打开链接
    openLink: function (e) {
        const url = e.currentTarget.dataset.url;
        wx.navigateTo({
            url: '/pages/web-view/web-view?url=' + encodeURIComponent(url)
        });
    },

    // 开始编辑简介
    startEditIntro: function () {
        this.setData({
            isEditingIntro: true
        });
    },

    // 取消编辑简介
    cancelEditIntro: function () {
        this.setData({
            isEditingIntro: false
        });
    },

    // 保存简介
    saveIntro: function () {
        // TODO: 调用API保存简介
        wx.showToast({
            title: '保存成功',
            icon: 'success'
        });
        this.setData({
            isEditingIntro: false
        });
    },

    // 简介输入处理
    onIntroInput: function (e) {
        const value = e.detail.value;
        this.setData({
            'channelInfo.intro': value
        });
    },
})
