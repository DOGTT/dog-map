Page({

	/**
	 * 组件的初始数据
	 */
	data: {
		channelInfo: {
			title: "默认标题"
		},

		inputBottom: '0px',
		images: [
			"/static/test/test-photo.jpg",
			"/static/test/test-photo2.png",
			// "/static/test/test-photo3.jpg",
			// "/static/test/test-photo4.jpg"
		],
		imageForUpload: []
	},

	goBack() {
		wx.navigateBack(); // 返回到上一页
	},


	goBack() {
		wx.navigateBack() // 返回到上一页
	},

	sendMessage: function () {
		const newMessage = this.data.inputValue; // 获取输入框的值
		if (newMessage) {
			this.setData({
				messages: [...this.data.messages, newMessage], // 添加新消息
				inputValue: '' // 清空输入框
			});
		}
	},
	onAfterRead(e) {
		const {
			file
		} = e.detail;
		this.setData({
			imageForUpload: this.data.imageForUpload.concat(file)
		});
	},
	onDeleteImage(e) {
		const {
			index
		} = e.detail;
		const imageForUpload = this.data.imageForUpload.filter((_, i) => i !== index);
		this.setData({
			imageForUpload
		});
	},

	onLoad: function (options) {
		console.log("onLoad", options)
		wx.showToast({
			title: '加载中'
		})
		let channelInfo = this.data.channelInfo
		if (options.title) {
			channelInfo.title = options.title
		}
		this.setData({
			channelInfo
		})
	},
})
