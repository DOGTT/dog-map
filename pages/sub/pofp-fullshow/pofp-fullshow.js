Page({

	/**
	 * 组件的初始数据
	 */
	data: {
    images: [
      "/static/test/test-photo.jpg",
      "/static/test/test-photo2.jpg",
      "/static/test/test-photo3.jpg",
      "/static/test/test-photo4.jpg"
    ]
	},

	goBack() {
		wx.navigateBack(); // 返回到上一页
	},
})
