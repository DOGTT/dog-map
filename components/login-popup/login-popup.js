// components/login-popup/login-popup.js
const app = getApp();
const {
    cropImage
} = require('../../utils/canvas');

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
            avatar_data: ''
        },
        isAgreed: false,
    },
    lifetimes: {
        attached() { }
    },
    methods: {
        onLoad() {
            console.log("onload");
        },
        onClose() {
            this.setData({
                show: false
            });
            this.triggerEvent('close'); // 通知父级页面关闭
        },
        getUserProfile(e) {
            // 使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
            wx.getUserProfile({
                desc: '注册用户头像', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
                success: (res) => {
                    console.log(res);
                    this.setData({
                        wxUserInfo: res.userInfo
                    })
                }
            })
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
                console.log('图片生成成功A:', resPath);
                petInfo.avatar = resPath
                this.setData({
                    petInfo
                })
            }).catch((err) => {
                console.error('图片生成失败:', err);
            });
        },
        onTermsCheckboxChange(e) {
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
            if (app.globalData.userInfo) {
                console.error("login is done, can't reg");
                return
            }
            if (!this.data.isAgreed) {
                wx.showToast({
                    title: '请确认同意用户协议',
                    icon: 'none',
                });
                return;
            }
            var _this = this
            wx.login({
                success: res => {
                    console.log('fastreg get code:', res.code);
                    wx.request({
                        url: app.globalData.baseUrl + '/user/wx/reg/fast',
                        method: 'POST',
                        data: {
                            wx_code: res.code,
                            pet: {
                                name: _this.data.petInfo.name,
                                avatar_data: _this.data.petInfo.a
                            }
                        },
                        success: (regRes) => {
                            console.log('fastreg success', regRes);
                            if (regRes.statusCode != 200) {
                                console.error("fastreg fail:", regRes);
                                return
                            }
                            const res = regRes.data;
                            wx.setStorageSync('userInfo', res.user_info);
                            wx.setStorageSync('token', res.token);
                            app.globalData.userInfo = res.user_info;
                            this.triggerEvent("reg", app.globalData.userInfo); // 通知父级页面登录成功
                            this.onClose();
                            wx.showToast({
                                title: '注册成功',
                                icon: 'success',
                            });
                        },
                        fail: (res) => {
                            console.error("get res fail:", res);
                        },
                    });
                }
            });
        }
    },
});
