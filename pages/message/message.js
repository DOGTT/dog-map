// pages/message/message.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageList: [],
    platformMessages: [],
    userMessages: [],
    activeTab: 'all', // 'all', 'platform', 'user'
    loading: false,
    hasMore: true,
    page: 1,
    pageSize: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadMessages();
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
    // 每次显示页面时刷新消息列表，但保持当前选中的标签
    this.refreshMessagesWithCurrentTab();
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
    this.refreshMessagesWithCurrentTab();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadMoreMessages();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  /**
   * 返回上一页
   */
  goBack() {
    wx.navigateBack({
      delta: 1
    });
  },

  /**
   * 切换消息类型标签
   */
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    if (tab === this.data.activeTab) return;
    
    this.setData({
      activeTab: tab,
      messageList: tab === 'all' ? [...this.data.platformMessages, ...this.data.userMessages] :
                  tab === 'platform' ? this.data.platformMessages :
                  this.data.userMessages
    });
  },

  /**
   * 从本地存储加载已读消息记录
   */
  loadReadMessagesFromStorage() {
    try {
      const readMessages = wx.getStorageSync('readMessages') || [];
      return readMessages;
    } catch (e) {
      console.error('加载已读消息记录失败', e);
      return [];
    }
  },

  /**
   * 保存已读消息记录到本地存储
   */
  saveReadMessagesToStorage(readMessages) {
    try {
      wx.setStorageSync('readMessages', readMessages);
    } catch (e) {
      console.error('保存已读消息记录失败', e);
    }
  },

  /**
   * 加载消息列表
   */
  loadMessages() {
    this.setData({ loading: true });
    
    // 从本地存储加载已读消息记录
    const readMessages = this.loadReadMessagesFromStorage();
    
    // 模拟加载平台消息
    const platformMessages = [
      {
        id: 'p1',
        type: 'platform',
        title: '系统更新通知',
        content: '亲爱的用户，我们的应用已更新到最新版本，新增了多项功能，欢迎体验！',
        time: '2023-12-25 10:30',
        isRead: readMessages.includes('p1'),
        isExpanded: false
      },
      {
        id: 'p2',
        type: 'platform',
        title: '活动通知',
        content: '参与我们的年终活动，赢取精美礼品！',
        time: '2023-12-20 15:45',
        isRead: readMessages.includes('p2'),
        isExpanded: false
      }
    ];
    
    // 模拟加载用户消息
    const userMessages = [
      {
        id: 'u1',
        type: 'user',
        fromUser: {
          id: 'user1',
          nickname: '小明',
          avatar: '/static/png/default-avatar.png'
        },
        content: '你好，我对你发布的狗狗信息很感兴趣，可以聊聊吗？',
        time: '2023-12-22 09:15',
        isRead: readMessages.includes('u1'),
        isExpanded: false
      },
      {
        id: 'u2',
        type: 'user',
        fromUser: {
          id: 'user2',
          nickname: '小红',
          avatar: '/static/png/default-avatar.png'
        },
        content: '谢谢你的帮助，我的问题已经解决了！',
        time: '2023-12-18 14:30',
        isRead: readMessages.includes('u2'),
        isExpanded: false
      }
    ];
    
    // 在实际应用中，这里应该调用API获取消息
    // wx.request({
    //   url: 'your-api-url/messages',
    //   method: 'GET',
    //   success: (res) => {
    //     // 处理返回的消息数据
    //   }
    // });
    
    setTimeout(() => {
      // 根据当前选中的标签设置消息列表
      const activeTab = this.data.activeTab;
      const messageList = activeTab === 'all' ? [...platformMessages, ...userMessages] :
                         activeTab === 'platform' ? platformMessages :
                         userMessages;
      
      this.setData({
        platformMessages,
        userMessages,
        messageList,
        loading: false
      });
    }, 500);
  },

  /**
   * 刷新消息列表，保持当前选中的标签
   */
  refreshMessagesWithCurrentTab() {
    this.setData({
      page: 1,
      hasMore: true
    });
    this.loadMessages();
    wx.stopPullDownRefresh();
  },

  /**
   * 刷新消息列表（旧方法，保留兼容性）
   */
  refreshMessages() {
    this.refreshMessagesWithCurrentTab();
  },

  /**
   * 加载更多消息
   */
  loadMoreMessages() {
    if (this.data.loading || !this.data.hasMore) return;
    
    this.setData({ loading: true });
    
    // 模拟加载更多消息
    // 在实际应用中，这里应该调用API获取更多消息
    setTimeout(() => {
      // 模拟没有更多数据
      this.setData({
        hasMore: false,
        loading: false
      });
    }, 500);
  },

  /**
   * 标记消息为已读
   */
  markAsRead(e) {
    const messageId = e.currentTarget.dataset.id;
    const messageType = e.currentTarget.dataset.type;
    
    // 更新消息状态
    let updatedList = [...this.data.messageList];
    const messageIndex = updatedList.findIndex(item => item.id === messageId);
    
    if (messageIndex !== -1) {
      updatedList[messageIndex].isRead = true;
      
      // 更新对应类型的消息列表
      if (messageType === 'platform') {
        const platformIndex = this.data.platformMessages.findIndex(item => item.id === messageId);
        if (platformIndex !== -1) {
          const updatedPlatformMessages = [...this.data.platformMessages];
          updatedPlatformMessages[platformIndex].isRead = true;
          this.setData({ platformMessages: updatedPlatformMessages });
        }
      } else if (messageType === 'user') {
        const userIndex = this.data.userMessages.findIndex(item => item.id === messageId);
        if (userIndex !== -1) {
          const updatedUserMessages = [...this.data.userMessages];
          updatedUserMessages[userIndex].isRead = true;
          this.setData({ userMessages: updatedUserMessages });
        }
      }
      
      this.setData({ messageList: updatedList });
      
      // 保存已读状态到本地存储
      this.saveReadStatusToStorage(messageId);
    }
    
    // 在实际应用中，这里应该调用API更新消息状态
    // wx.request({
    //   url: 'your-api-url/messages/read',
    //   method: 'POST',
    //   data: { messageId }
    // });
  },

  /**
   * 保存消息已读状态到本地存储
   */
  saveReadStatusToStorage(messageId) {
    try {
      // 获取当前已读消息列表
      let readMessages = this.loadReadMessagesFromStorage();
      
      // 如果消息ID不在已读列表中，则添加
      if (!readMessages.includes(messageId)) {
        readMessages.push(messageId);
        this.saveReadMessagesToStorage(readMessages);
      }
    } catch (e) {
      console.error('保存消息已读状态失败', e);
    }
  },

  /**
   * 查看消息详情
   */
  viewMessageDetail(e) {
    const messageId = e.currentTarget.dataset.id;
    const messageType = e.currentTarget.dataset.type;
    
    // 标记消息为已读
    this.markAsRead(e);
    
    // 根据消息类型跳转到不同页面
    // if (messageType === 'platform') {
    //   wx.navigateTo({
    //     url: `/pages/message-detail/message-detail?id=${messageId}&type=platform`
    //   });
    // } else if (messageType === 'user') {
    //   wx.navigateTo({
    //     url: `/pages/chat/chat?userId=${messageId}`
    //   });
    // }
  },
  
  /**
   * 展开/收起消息内容
   */
  toggleExpand(e) {
    const messageId = e.currentTarget.dataset.id;
    const messageType = e.currentTarget.dataset.type;
    
    // 更新消息列表
    let updatedList = [...this.data.messageList];
    const messageIndex = updatedList.findIndex(item => item.id === messageId);
    
    if (messageIndex !== -1) {
      // 切换展开状态
      updatedList[messageIndex].isExpanded = !updatedList[messageIndex].isExpanded;
      
      // 更新对应类型的消息列表
      if (messageType === 'platform') {
        const platformIndex = this.data.platformMessages.findIndex(item => item.id === messageId);
        if (platformIndex !== -1) {
          const updatedPlatformMessages = [...this.data.platformMessages];
          updatedPlatformMessages[platformIndex].isExpanded = updatedList[messageIndex].isExpanded;
          this.setData({ platformMessages: updatedPlatformMessages });
        }
      } else if (messageType === 'user') {
        const userIndex = this.data.userMessages.findIndex(item => item.id === messageId);
        if (userIndex !== -1) {
          const updatedUserMessages = [...this.data.userMessages];
          updatedUserMessages[userIndex].isExpanded = updatedList[messageIndex].isExpanded;
          this.setData({ userMessages: updatedUserMessages });
        }
      }
      
      this.setData({ messageList: updatedList });
      
      // 如果展开消息，标记为已读
      if (updatedList[messageIndex].isExpanded && !updatedList[messageIndex].isRead) {
        this.markAsRead({
          currentTarget: {
            dataset: {
              id: messageId,
              type: messageType
            }
          }
        });
      }
    }
  }
})