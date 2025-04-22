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
            name: "汪汪",
            id: 10001,
            intro: "默认简介",
            tags: ["GG", "3岁"]
        },
        loginPopupShow: false,
        tabs: ["我创建的", "关注的", "去过的"], // 标签内容
        activeTab: 0, // 当前激活的标签索引
        // 头像编辑
        avatarEditorShow: false,

        // bottom card
        leftColumnItems: [], // 左列数据
        rightColumnItems: [], // 右列数据
        isLoading: false, // 是否正在加载
        noMoreData: false, // 是否还有更多数据
        page: 1, // 当前页码
        // 不同tab的示例数据
        tabData: {
            0: [
                { id: 1, title: '公园散步', description: '今天在中央公园散步，遇到了很多小伙伴' },
                { id: 2, title: '海边玩耍', description: '第一次带狗狗去海边，玩得很开心' },
                { id: 3, title: '生日派对', description: '给狗狗举办的生日派对，来了好多朋友' }
            ],
            1: [
                { id: 4, title: '训练日常', description: '日常训练打卡，今天学会了新技能' },
                { id: 5, title: '周末野餐', description: '周末带狗狗去野餐，享受阳光' }
            ],
            2: [
                { id: 6, title: '美容护理', description: '定期美容护理，保持狗狗健康' }
            ]
        }
    },

    // 分配数据到左右两列
    distributeItems(items) {
        const leftColumnItems = [];
        const rightColumnItems = [];

        items.forEach((item, index) => {
            if (index % 2 === 0) {
                leftColumnItems.push(item);
            } else {
                rightColumnItems.push(item);
            }
        });

        return { leftColumnItems, rightColumnItems };
    },

    // 切换标签
    switchTab(e) {
        const index = e.currentTarget.dataset.index;
        this.setData({
            activeTab: index,
            leftColumnItems: [],
            rightColumnItems: [],
            page: 1,
            noMoreData: false
        });

        // 加载当前tab的数据
        this.loadTabData(index);
    },

    // 加载当前tab的数据
    loadTabData(tabIndex) {
        const items = this.data.tabData[tabIndex] || [];
        if (items.length === 0) {
            this.setData({
                noMoreData: true
            });
            return;
        }

        const { leftColumnItems, rightColumnItems } = this.distributeItems(items);
        this.setData({
            leftColumnItems,
            rightColumnItems
        });
    },

    onLoadMore() {
        console.log('onLoadMore')
        if (this.data.isLoading || this.data.noMoreData) return;

        this.setData({
            isLoading: true
        });

        // 模拟加载更多数据
        setTimeout(() => {
            const currentItems = this.data.tabData[this.data.activeTab] || [];
            const newItems = currentItems.map(item => ({
                ...item,
                id: item.id + this.data.page * 10
            }));

            if (newItems.length === 0) {
                this.setData({
                    noMoreData: true
                });
            } else {
                const { leftColumnItems, rightColumnItems } = this.distributeItems(newItems);
                this.setData({
                    leftColumnItems: [...this.data.leftColumnItems, ...leftColumnItems],
                    rightColumnItems: [...this.data.rightColumnItems, ...rightColumnItems],
                    page: this.data.page + 1
                });
            }

            this.setData({
                isLoading: false
            });
        }, 1000);
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
        // 初始化加载第一个tab的数据
        this.loadTabData(0);
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
        console.log("userInfo ", userInfo)
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
