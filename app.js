// app.js

App({
	globalData: {
		wxCode: '',
		userInfo: null,
		baseUrl: 'http://localhost:8080/v1',
		pofpTypes: null,
		// theme: 'dark',
	},
	onLaunch() {
		// 展示本地存储能力
		const logs = wx.getStorageSync('logs') || []
		logs.unshift(Date.now())
		wx.setStorageSync('logs', logs)
    this.tryUserLogin();
    this.loadPopfTypes();
	},
	decodeJWT(token) {
		// 检查 token 是否有效
		if (!token) {
			throw new Error("无效的 token");
		}
		// 分割 token
		const parts = token.split('.');
		if (parts.length !== 3) {
			throw new Error("无效的 token 格式");
		}
		// 解码载荷部分
		const payload = parts[1];
		// 使用 atob 解码 Base64Url 编码
		const decodedPayload = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
		return decodedPayload;
  },
  // 
  loadPopfTypes: function () {
    const _this = this;
    return new Promise((resolve, reject) => {
      wx.request({
        method: "GET",
        url: _this.globalData.baseUrl + '/popf/type',
        header: {
          WeixinRequestCode: _this.globalData.wxCode
        },
        dataType: 'json',
        success: (res) => {
          console.log("get pofp list res.data", res.data);
          _this.globalData.pofpTypes = res.data.pofp_types;
          resolve(_this.globalData.pofpTypes)
        },
        fail: (err) => {
          console.error('list poi type failed:', err);
          reject(err);
        }
      });
    });
  },
  getPofpTypes: function () {
    const _this = this;
    return new Promise((resolve) => {
      if (_this.globalData.pofpTypes) {
        resolve(_this.globalData.someData);
      } else {
        // 数据未加载，进行加载
        _this.loadPopfTypes().then(resolve);
      }
    });
  },
	// 登录
	tryUserLogin() {
		var _this = this
		const userInfo = wx.getStorageSync('userInfo');
		const token = wx.getStorageSync('token');
		if (userInfo && token) {
			const jwt = this.decodeJWT(token);
			const currentTime = Math.floor(Date.now() / 1000);
			if (jwt && jwt.exp) {
				if (jwt.exp > currentTime) {
					console.log('login status ok', userInfo, jwt.exp);
					return
				}
			}
			console.log("Token 已过期");
		}
		wx.login({
			success: res => {
				console.log('login get code:', res.code);
				this.globalData.wxCode = res.code;
				wx.request({
					url: _this.globalData.baseUrl + '/user/wx/login',
					method: 'POST',
					data: {
						wx_code: res.code
					},
					success: (res) => {
						console.log("login get res:", res);
						if (res.statusCode != 200) {
							console.error("login fail:", res);
							return
						}
						const loginRes = res.data;
						wx.setStorageSync('userInfo', loginRes.user_info);
						wx.setStorageSync('token', loginRes.token);
						_this.globalData.userInfo = loginRes.user_info;
						// 设置页面 data
						wx.showToast({
							title: '登录成功',
							icon: 'success',
						});
					},
					fail: (res) => {
						console.error("get res fail:", res);
					},
				});
			},
			fail: res => {
				console.error(res);
				wx.showToast({
					title: '用户标识获取失败',
					icon: 'error'
				});
			}
		})
	}
})
