// components/login-popup/login-popup.js

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
const app = getApp();

Component({
	properties: {
		show: {
			type: Boolean,
			value: false, // 默认不显示弹窗
		},
	},
	data: {
		canIUseGetUserProfile: wx.canIUse('getUserProfile'),
		phoneNumber: '',
		password: '',
		userInfo: {
			avatarUrl: "/static/png/dog-undefine.png",
			nickName: '',
    },
    isAgreed: false,
		hasUserInfo: false,
		canIUseGetUserProfile: wx.canIUse('getUserProfile'),
		canIUseNicknameComp: wx.canIUse('input.type.nickname'),
	},
	methods: {
		onClose() {
			this.setData({
				show: false
			});
			this.triggerEvent('close'); // 通知父级页面关闭
		},
		// onWeChatLogin(event) {
		// 	// 微信一键登录逻辑
		// 	if (event.detail.errMsg === "getPhoneNumber:ok") {
		// 		const phoneInfo = event.detail;
		// 		wx.showToast({
		// 			title: "登录成功",
		// 			icon: "success",
		// 		});
		// 		this.triggerEvent("login", phoneInfo); // 通知父级页面登录成功
		// 		this.onClose();
		// 	} else {
		// 		wx.showToast({
		// 			title: "登录失败，请重试",
		// 			icon: "none",
		// 		});
		// 	}
		// },
		getUserProfile(e) {
			// 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
			wx.getUserProfile({
				desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
				success: (res) => {
					console.log(res)
					this.setData({
						userInfo: res.userInfo,
						hasUserInfo: true
					})
				}
			})
    },
    onChooseAvatar(e) {
      const { avatarUrl } = e.detail
      // const { nickName } = this.data.userInfo
      this.setData({
        "userInfo.avatarUrl": avatarUrl,
        // hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
      })
    },
		onCheckboxChange(e) {
			const isAgreed = e.detail.value.includes("agree");
			this.setData({
				isAgreed
			});
			console.log("用户是否同意协议:", isAgreed);
		},
		navigateToTerms() {
			wx.navigateTo({
				url: '/pages/sub/user-terms/user-terms', // 替换为实际的协议页面路径
			});
		},
		onLogin() {
      console.log("login click");
      if (!this.data.isAgreed) {
        wx.showToast({
          title: '请确认同意用户协议',
          icon: 'none',
        });
        return;
      }
			wx.request({
				url: app.globalData.baseUrl + '/login', // 替换为实际接口地址
				method: 'POST',
				data: {
					username: 'test', // 示例数据
					password: '123456',
				},
				success: (res) => {
          console.log(res);
          // todo 检查
					// if (res.data.message === 'OK') {
            // wx.showToast({
						// 	title: '登录失败',
						// 	icon: 'none',
						// });
          // }
						const loginRes = res.data;
						// 将 data 存储到本地
						// wx.setStorageSync('userInfo', loginRes.user_info);
						wx.setStorageSync('token', loginRes.token);
						// 更新全局数据（若需要）
						app.globalData.userInfo = loginRes.user_info;
						// 设置页面 data
						// this.setData({
						// 	userInfo,
						// });
            // this.triggerEvent("login", userInfo); // 通知父级页面登录成功
            this.onClose();
						wx.showToast({
							title: '登录成功',
							icon: 'success',
						});
				},
				fail: () => {
					wx.showToast({
						title: '登陆接口请求失败',
						icon: 'none',
					});
				},
			});
		}
	},
});
