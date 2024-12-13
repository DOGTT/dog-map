// pages/sub/pofp-create/pofp-fullshow.js
Page({

	/**
	 * 组件的初始数据
	 */
	data: {
		currentLocation: {
			name: '宝安中心区', // 地点名称
			latitude: 22.55329,
			longitude: 113.90308,
		},
		tagsList: [{
				value: "标签1",
				select: true
			},
			{
				value: "标签2",
				select: false
			}
		],
		locationName: '', // 用于存储选择的位置名称
		selectedTags: [], // 存储已选择的标签
		photos: [], // 存储已选择的媒体文件路径
		previewShow: false, // 是否展示预览
		currentPhoto: '', // 当前预览的图片
		currentPhotoIndex: null, // 当前预览图片的索引
	},

	goBack() {
		wx.navigateBack(); // 返回到上一页
	},
	// 标签点击事件
	onTagTap(e) {
		const index = e.currentTarget.dataset.index; // 获取点击的标签索引
		const tagsList = this.data.tagsList;
		console.log(e);
		console.log(tagsList);
		// 切换选中状态
		tagsList[index].select = !tagsList[index].select;
		// 更新数据
		this.setData({
			tagsList
		});
	},
	// 选择位置
	chooseLocation() {
		console.log("chooseLocation");
		wx.chooseLocation({
			success: (res) => {
				console.log(res);
				this.setData({
					currentLocation: {
						name: res.name || "未知地点",
						latitude: res.latitude,
						longitude: res.longitude,
					},
				});
			},
			fail: (err) => {
				console.error("选择地点失败：", err);
			},
		});
	},
	// 添加照片
	addPhoto() {
		const self = this;
		// 计算剩余可选数量
		const maxSelectable = 3 - self.data.photos.length;
		if (maxSelectable <= 0) {
			wx.showToast({
				title: '最多只能选择3张图片',
				icon: 'none',
			});
			return;
		}
		wx.chooseMedia({
			count: maxSelectable, // 每次只选一个媒体文件
			mediaType: ['image'], // 只允许选择图片
			sourceType: ['album', 'camera'], // 可以从相册选择或拍摄
			success(res) {
				console.log(res);
				const newPhotos = [...self.data.photos, ...res.tempFiles.map(file => file.tempFilePath)];
				self.setData({
					photos: newPhotos,
				});
			},
			fail(err) {
				console.error('Media selection failed:', err);
			},
		});
	},
	// 预览照片
	previewPhoto(e) {
		const index = e.currentTarget.dataset.index;
		wx.previewImage({
			current: this.data.photos[0], // 当前显示图片的http链接
			urls: this.data.photos // 需要预览的图片http链接列表
		})
		// wx.navigateTo({
		//   url: `/pages/photoPreview/photoPreview?photo=${this.data.photos[index]}&index=${index}`,
		// });
	},
	// 打开预览
	openPreview(e) {
		const index = e.currentTarget.dataset.index;
		this.setData({
			previewShow: true,
			currentPhoto: this.data.photos[index],
			currentPhotoIndex: index,
		});
	},
	// 关闭预览
	closePreview() {
		this.setData({
			previewShow: false
		});
	},
	// 设为首图
	setAsCover(e) {
		const {
			index
		} = e.detail;
		const photos = this.data.photos;

		// 将当前图片置于第一位
		photos.splice(index, 1);
		photos.unshift(this.data.currentPhoto);

		this.setData({
			photos
		});
		wx.showToast({
			title: '已设为首图',
			icon: 'success'
		});
	},

	// 删除照片
	deletePhoto(e) {
		const {
			index
		} = e.detail;
		const photos = this.data.photos;

		// 删除当前图片
		photos.splice(index, 1);

		this.setData({
			photos
		});
		wx.showToast({
			title: '照片已删除',
			icon: 'success'
		});
	},
	onSave() {
		wx.showToast({
			title: '内容已暂存',
			icon: 'success'
		});
	},
	onPublish() {
		wx.showModal({
			title: '确认发布',
			content: '您确定要发布内容吗？',
			success(res) {
				if (res.confirm) {
					wx.showToast({
						title: '发布成功',
						icon: 'success'
					});
				}
			},
		});
  },
  onLoad: function () {
		console.log("onLoad")
		// this.reLocation();
		// Toast('加载中');
		// this.pofpTypeListReload();
  },
  onShow() {
		console.log("onShow")
  },
  onReady() {
		console.log("onReady")
	}
})
