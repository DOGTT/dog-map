Page({

	/**
	 * 组件的初始数据
	 */
	data: {
    inputBottom: '0px',
    images: [
      "/static/test/test-photo.jpg",
      "/static/test/test-photo2.png",
      // "/static/test/test-photo3.jpg",
      // "/static/test/test-photo4.jpg"
    ]
	},

	goBack() {
		wx.navigateBack(); // 返回到上一页
  },
  
 


  sendMessage: function () {
    const newMessage = this.data.inputValue; // 获取输入框的值
    if (newMessage) {
      this.setData({
        messages: [...this.data.messages, newMessage], // 添加新消息
        inputValue: '' // 清空输入框
      });
    }
  }
})
