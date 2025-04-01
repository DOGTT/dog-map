// components/login-popup/login-popup.js
const app = getApp()
const {
	cropImage
} = require('../../utils/canvas')
const JWTManager = require('../../utils/jwt.js')
import {
	sendRequest,
	sendRequestNoAuth
} from '../../utils/http.js';
Component({
	properties: {
		show: {
			type: Boolean,
			value: false, // 默认不显示弹窗
		},
	},
	data: {
		canIUseGetUserProfile: wx.canIUse('getUserProfile'),
		wxUserInfo: {},
		petInfo: {
			avatar: '/static/png/dog-undefine.png',
			name: '',
			avatar_base64_data: ''
		},
		isAgreed: false,
	},
	lifetimes: {
		attached() {}
	},
	methods: {
		onLoad() {
			console.log("onload")
		},
		onClose() {
			this.setData({
				show: false
			})
			this.triggerEvent('close') // 通知父级页面关闭
		},
		getUserProfile(e) {
			// 使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
			wx.getUserProfile({
				desc: '注册用户头像', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
				success: (res) => {
					console.log(res)
					this.setData({
						wxUserInfo: res.userInfo
					})
				}
			})
		},
		onNameInputChange(e) {
			console.log("onNameInputChange", e)
			// 更新 petInfo 中的 name 字段
			let name = e.detail.value
			this.setData({
				'petInfo.name': name
			})
			if (name.length > 10) {
				wx.showToast({
					title: '名字不能超过10个字符',
					icon: 'none'
				})
			}
		},
		onChooseAvatar(e) {
			console.log("onChooseAvatar", e)
			const {
				avatarUrl
			} = e.detail
			const petInfo = this.data.petInfo
			cropImage({
				ctx: this,
				canvasId: "#avatarCropper",
				tempFilePath: avatarUrl,
				width: 640,
				height: 640
			}).then((resPath) => {
				console.log('图片生成成功A:', resPath)
				petInfo.avatar = resPath
				wx.getFileSystemManager().readFile({
					filePath: petInfo.avatar,
					encoding: 'base64',
					success: res => {
						petInfo.avatar_base64_data = res.data
						console.log('转换完成:', petInfo.avatar_base64_data.length)
					},
					fail: err => {
						console.error('转换失败:', err)
					}
				})
				this.setData({
					petInfo
				})
			}).catch((err) => {
				console.error('图片生成失败:', err)
			})
		},

		onTermsCheckboxChange(e) {
			const isAgreed = e.detail.value.includes("agree")
			this.setData({
				isAgreed
			})
			console.log("用户是否同意协议:", isAgreed)
		},
		navigateToTerms() {
			wx.navigateTo({
				url: '/pages/sub/user-terms/user-terms', // 替换为实际的协议页面路径
			})
		},
		onLogin() {
			console.log("login click")
			if (app.globalData.userInfo) {
				console.error("login is done, can't reg")
				return
			}
			if (!this.data.isAgreed) {
				wx.showToast({
					title: '请确认同意用户协议',
					icon: 'none',
				})
				return
			}
			var _this = this
			wx.login({
				success: res => {
          console.log('fastreg get code:', res.code, 'petinfo', _this.data.petInfo)
          sendRequestNoAuth(app,'/user/fast_reg/wx','POST',{
            wx_code: res.code,
            reg_data: {
              pet_name: _this.data.petInfo.name,
              pet_title: '主人',
              pet_avatar_data: _this.data.petInfo.avatar_base64_data
            }
          }).then((res) => {
            console.log('fastreg success', res)
            const resData = res.data
            JWTManager.setToken(resData.token)
            wx.setStorageSync('userInfo', resData.user)
            app.globalData.userInfo = resData.user
            this.onClose()
            this.triggerEvent('login') 
            wx.showToast({
              title: '注册成功',
              icon: 'success',
            })
          }).catch((err) => {
            console.error("reg fail:", err)
          })
				}
			})
		}
	},
})
