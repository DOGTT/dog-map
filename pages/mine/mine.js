// pages/mine.js
const app = getApp()
const JWTManager = require('../../utils/jwt.js')
import {
	sendRequest,
	sendRequestNoAuth
} from '../../utils/http.js';
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
    pet: {
      avatar: "/static/png/dog-undefine.png",
      name:"汪汪",
      id:10001,
      intro: "默认简介",
      tags: ["GG","3岁"]
    },
		loginPopupShow: false,
		tabs: ["发布", "点赞", "踩过"], // 标签内容
		activeTab: 0, // 当前激活的标签索引
    // 头像编辑
		avatarEditorShow: false,

		// bottom card
		leftColumnItems: [], // 左列数据
		rightColumnItems: [], // 右列数据
		isLoading: false, // 是否正在加载
		noMoreData: false, // 是否还有更多数据
		page: 1 // 当前页码
	},

	onLoadMore() {
		console.log('onLoadMore')
		if (this.data.isLoading || this.data.noMoreData) return
		this.setData({
			isLoading: true
		})

		// 调用获取数据的API
		this.loadMoreItems().then(newItems => {
			if (newItems.length === 0) {
				this.setData({
					noMoreData: true
				})
			} else {
				// 将新数据分配到左右两列（瀑布流布局）
				const {
					leftColumnItems,
					rightColumnItems
				} = this.distributeItems(newItems)

				this.setData({
					leftColumnItems: [...this.data.leftColumnItems, ...leftColumnItems],
					rightColumnItems: [...this.data.rightColumnItems, ...rightColumnItems],
					page: this.data.page + 1
				})
			}
		}).finally(() => {
			this.setData({
				isLoading: false
			})
		})
	},
	// 切换标签
	switchTab(e) {
		const index = e.currentTarget.dataset.index
		this.setData({
			activeTab: index
		})
	},

	onAvatarTap() {
		console.log('onAvatarTap')
		this.setData({
			avatarEditorShow: true
		})
  },
  
	onAvatarEditorUpdate(e) {
		console.log('onAvatarEditorUpdate', e)
		this.setData({
			'pet.avatar': e.detail
		})
	},

	onAvatarEditorClose() {
		this.setData({
			avatarEditorShow: false
		})
	},

	navigateToUserEdit() {
		wx.navigateTo({
			url: '/pages/sub/user-edit/user-edit', // 替换为实际的协议页面路径
		})
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

  onUserLogin() {
    this.reloadPets()
  },

  reloadPets() {
    const userInfo = wx.getStorageSync('userInfo')
    console.log("userInfo ",userInfo)
    let petInfo = userInfo.user_pets[0]
    let pet = this.data.pet
    pet.name = petInfo.pet.name
    pet.id = petInfo.pet.id
    pet.avatar = petInfo.pet.avatar.get_url
    this.setData({
      pet: pet
    })
  },
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {
		const token = JWTManager.getValidToken()
		if (token) {
      // load user
      this.reloadPets()
		} else {
			// token 不存在
			console.log('Token does not exist')
			this.setData({
				loginPopupShow: true,
			})
		}
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
		console.log("onPullDownRefresh")
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom() {
		console.log("onReachBottom")
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage() {

	}
})
