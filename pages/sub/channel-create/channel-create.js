const app = getApp()
import {
	MediaType,
	uploadMedia,
	sendRequest
} from '../../../utils/http.js'

const channelCacheKey = 'channelCreateCache'

Page({

	/**
	 * 组件的初始数据
	 */
	data: {
		mapData: {
			markers: [{
				id: 1,
				title: "选中位置",
				latitude: 22.55329,
				longitude: 113.90308,
				iconPath: "/static/png/marker/Marker3_Activated@3x.png",
				width: "38px",
				height: "38px",
				callout: {
					content: "当前选中位置",
					display: "ALWAYS",
					padding: 10,
					borderRadius: 10
				}
			}],
			mapSetting: { // 使用setting配置，方便统一还原
				rotate: 0,
				skew: 0,
				layerStyle: 1,
				showLocation: true,
				enableZoom: false,
				enableScroll: false,
			},
		},
		channelTypeList: [],
		previewShow: false, // 是否展示预览
		currentPhoto: '', // 当前预览的图片
		currentPhotoIndex: null, // 当前预览图片的索引


		channelCreatForm: {
			lngLat: {
				lng: 0,
				lat: 0
			},
			address: "",
			loctionName: "",
			typeID: "1",
			title: "",
			photos: [], // 存储已选择的媒体文件路径
			postContent: ""
		}
	},
	goBack() {
		wx.setStorageSync(channelCacheKey, this.data.channelCreatForm)
		wx.navigateBack() // 返回到上一页
	},
	onInputTitle(e) {
		this.data.channelCreatForm.title = e.detail.value
	},
	onInputContent(e) {
		this.data.channelCreatForm.postContent = e.detail.value
	},
	// 标签点击事件
	onTypeBtnTap(e) {
		const index = e.currentTarget.dataset.index // 获取点击的标签索引
		var channelTypeList = this.data.channelTypeList
		this.data.channelCreatForm.typeID = channelTypeList[index].id
		// 切换选中状态
		for (let i = 0; i < channelTypeList.length; i++) {
			channelTypeList[i].select = false
			if (i == index) {
				channelTypeList[i].select = true
			}
		}
		// 更新数据
		this.setData({
			channelTypeList
		})
	},
	// 选择位置
	chooseLocation() {
		console.log("chooseLocation")
		const _this = this
		wx.chooseLocation({
			success: (res) => {
				console.log(res, _this.data.mapData)
				var marker = _this.data.mapData.markers[0]
				marker.latitude = res.latitude
				marker.longitude = res.longitude
				var lngLat = _this.data.channelCreatForm.lngLat
				lngLat.lat = res.latitude
				lngLat.lng = res.longitude
				_this.data.channelCreatForm.address = res.address || "未知地点"
				_this.data.channelCreatForm.loctionName = res.name || "未知地点"
				this.setData({
					channelCreatForm: _this.data.channelCreatForm,
					mapData: _this.data.mapData
				})
			},
			fail: (err) => {
				console.error("选择地点失败：", err)
			},
		})
	},
	// 添加照片
	addPhoto() {
		const _this = this
		const photoMax = 9
		// 计算剩余可选数量
		const maxSelectable = photoMax - _this.data.channelCreatForm.photos.length
		if (maxSelectable <= 0) {
			wx.showToast({
				title: '最多只能选择' + photoMax + '张图片',
				icon: 'error',
			})
			return
		}
		wx.chooseMedia({
			count: maxSelectable,
			mediaType: ['image'], // 只允许选择图片
			sourceType: ['album', 'camera'], // 可以从相册选择或拍摄
			success(res) {
				console.log(res)
				for (let i = 0; i < res.tempFiles.length; i++) {
					_this.data.channelCreatForm.photos.push(res.tempFiles[i])
				}
				_this.setData({
					channelCreatForm: _this.data.channelCreatForm
				})
				console.log('photo set:', _this.data.channelCreatForm)
			},
			fail(err) {
				console.error('Media selection failed:', err)
			},
		})
	},
	// 打开预览
	openPreview(e) {
		const index = e.currentTarget.dataset.index
		this.setData({
			previewShow: true,
			currentPhoto: this.data.channelCreatForm.photos[index].tempFilePath,
			currentPhotoIndex: index,
		})
	},
	// 关闭预览
	closePreview() {
		this.setData({
			previewShow: false
		})
	},
	// 设为首图
	setAsCover(e) {
		const {
			index
		} = e.detail
		const photos = this.data.channelCreatForm.photos
		const photoSet = photos[index]
		// 将当前图片置于第一位
		photos.splice(index, 1)
		photos.unshift(photoSet)
		this.setData({
			channelCreatForm: this.data.channelCreatForm
		})
		wx.showToast({
			title: '已设为首图',
			icon: 'success'
		})
	},

	// 删除照片
	deletePhoto(e) {
		const {
			index
		} = e.detail
		const photos = this.data.channelCreatForm.photos
		// 删除当前图片
		photos.splice(index, 1)
		this.setData({
			channelCreatForm: this.data.channelCreatForm
		})
		wx.showToast({
			title: '照片已删除',
			icon: 'success'
		})
	},
	onSave() {
		wx.setStorageSync(channelCacheKey, this.data.channelCreatForm)
		console.log(this.data.channelCreatForm)
		wx.showToast({
			title: '内容已暂存',
			icon: 'success'
		})
	},
	toastFormError(title, eleID) {
		wx.showToast({
			title: title,
			icon: 'error',
			duration: 2000,
			success: () => {
				// 使用 setTimeout 确保提示框显示后再聚焦
				// setTimeout(() => {
				//   wx.createSelectorQuery().select(`#${eleID}`).focus().exec()
				// }, 2000)
			}
		})
	},
	doChannelCreate() {
		wx.setStorageSync(channelCacheKey, this.data.channelCreatForm)
		var channel = this.data.channelCreatForm
		// 显示加载进度
		wx.showLoading({
			title: '发布中',
		})
		console.log("channal creating", channel)
		const photoList = channel.photos.map(photo => photo.tempFilePath)
		// 创建频道
		// 取第一个做头像
		const channelAva = photoList.slice(0, 1)
		uploadMedia(app, channelAva, MediaType.Channel).then((res) => {
			console.log("uploadMedia done", res)
			const channelCreateData = {
				channel: {
					type_id: parseInt(channel.typeID),
					title: channel.title,
					intro: "",
					location: {
						lng_lat: {
							lng: parseFloat(channel.lngLat.lng),
							lat: parseFloat(channel.lngLat.lat)
						},
						address: channel.address
					}
				}
			}
			channelCreateData.channel.avatar = res.data.media[0]
			console.log("channelData creating", channelCreateData)
			sendRequest(app, '/channel', 'POST', channelCreateData).then((res) => {
				wx.hideLoading()
				console.log("channel create res", res)
				wx.removeStorageSync(channelCacheKey)
				wx.showToast({
					title: '发布成功',
					icon: 'success'
				})
				wx.navigateBack()
			})
		}).catch(err => {
			wx.hideLoading()
			console.error('频道创建失败', err)
			wx.showToast({
				title: '频道创建失败',
				icon: 'error'
			})
		})
	},
	onPublishBtnTap() {
		const channel = this.data.channelCreatForm
		const _this = this
		wx.showModal({
			title: '确认发布',
			content: '您确定要发布内容吗？',
			success(res) {
				if (res.confirm) {
					// 检查清单
					if (channel.title.length < 1) {
						_this.toastFormError('请添加标题', 'title')
						return
					}
					if (channel.lngLat.lng == 0) {
						_this.toastFormError('请选择位置', 'title')
						return
					}
					if (channel.postContent.length < 1) {
						_this.toastFormError('请添加正文', 'title')
						return
					}
					_this.doChannelCreate()
					wx.showToast({
						title: '发布成功',
						icon: 'success'
					})
				}
			},
		})
	},
	onLoad: function (options) {
		console.log("onLoad", options)
		wx.showToast({
			title: '加载中'
		})

		// load cache
		var channelCache = wx.getStorageSync(channelCacheKey)
		if (channelCache) {
			this.data.channelCreatForm = channelCache
			console.log('load cache', channelCache)
		}

		if (options.lat && options.lng) {
			var marker = this.data.mapData.markers[0]
			marker.latitude = options.lat
			marker.longitude = options.lng
			var lngLat = this.data.channelCreatForm.lngLat
			lngLat.lat = options.lat
			lngLat.lng = options.lng
		}
		if (options.address) {
			this.data.channelCreatForm.address = options.address || "未知地点"
		}
		this.setData({
			mapData: this.data.mapData,
			channelCreatForm: this.data.channelCreatForm
		})
		// get channel type
		this.channelTypeListReload()
	},
	onShow() {
		console.log("onShow")
	},
	onReady() {
		console.log("onReady")
	},
	// 加载足迹类型信息
	channelTypeListReload() {
		app.getChannelTypes().then((listData) => {
			console.log("get channel list res.data", listData)
			const idSet = "" || this.data.channelCreatForm.typeID
			for (let i = 0; i < listData.length; i++) {
				listData[i].select = (idSet == listData[i].id)
			}
			if (idSet == "") {
				listData[0].select = true
			}
			this.setData({
				channelTypeList: listData,
			})
		}).catch((err) => {
			console.error('list poi type failed:', err)
		})
	}
})
