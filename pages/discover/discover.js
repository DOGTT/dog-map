// pages/discover/discover.js
const { darwAndsaveCanvasAsImage, cropImage } = require('../../utils/canvas');

// 参考注和现有框架释生成发现页面的微信小程序页面，发现页面是一个可以跳转到各种功能的窗口，由一个个平排展示的小窗构成，小窗类似小红书的笔记页面，由上方的图片，下方的标题/作者/点赞数构成，页面每次会刷新展示一下功能小窗列表，点击小窗会跳转到新的子页面，不需要考虑子页面的内容，只生成一个跳转示例即可。

Page({

    /**
     * 页面的初始数据
     */
    data: {
        tempFilePathA: "",
        tempFilePathB: "",
        // 功能卡片数据
        discoverCards: [
            {
                id: 1,
                title: "附近的狗狗",
                author: "社区",
                likes: 128,
                image: "/static/images/nearby-dogs.jpg",
                path: "/pages/nearby/nearby"
            },
            {
                id: 2,
                title: "狗狗广场",
                author: "社区",
                likes: 256,
                image: "/static/images/square.jpg",
                path: "/pages/square/square"
            },
            {
                id: 3,
                title: "今天去哪里？",
                author: "推荐",
                likes: 64,
                image: "/static/images/random.jpg",
                path: "/pages/random/random"
            },
            {
                id: 4,
                title: "异次元狗狗",
                author: "AI生成",
                likes: 512,
                image: "/static/images/ai-dogs.jpg",
                path: "/pages/ai-dogs/ai-dogs"
            }
        ],
        // 记录页面状态
        pageState: {
            lastRefreshTime: 0,
            currentView: 'all' // 可以是 'all', 'nearby', 'square', 'random', 'ai'
        }
    },

    // 页面跳转函数
    navigateToNearbyDogs() {
        wx.navigateTo({
            url: '/pages/nearby/nearby'
        });
    },

    navigateToSquare() {
        wx.navigateTo({
            url: '/pages/square/square'
        });
    },

    navigateToRandom() {
        wx.navigateTo({
            url: '/pages/random/random'
        });
    },

    navigateToAIDogs() {
        wx.navigateTo({
            url: '/pages/ai-dogs/ai-dogs'
        });
    },

    // 返回上一页
    goBack() {
        wx.navigateBack();
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 可以在这里加载数据
        this.loadDiscoverData();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        // 每次显示页面时检查是否需要刷新数据
        this.checkAndRefreshData();
    },

    // 加载发现页数据
    loadDiscoverData() {
        // 这里可以添加获取数据的逻辑
        console.log("加载发现页数据");
        
        // 更新页面状态
        this.setData({
            'pageState.lastRefreshTime': Date.now()
        });
    },

    // 检查并刷新数据
    checkAndRefreshData() {
        const now = Date.now();
        const lastRefresh = this.data.pageState.lastRefreshTime;
        const refreshInterval = 5 * 60 * 1000; // 5分钟刷新一次
        
        // 如果距离上次刷新超过设定时间，则刷新数据
        if (now - lastRefresh > refreshInterval) {
            this.refreshDiscoverData();
        } else {
            console.log("数据较新，无需刷新");
        }
    },

    // 刷新发现页数据
    refreshDiscoverData() {
        // 这里可以添加获取新数据的逻辑
        console.log("刷新发现页数据");
        
        // 更新页面状态
        this.setData({
            'pageState.lastRefreshTime': Date.now()
        });
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
        // 下拉刷新
        this.refreshDiscoverData();
        wx.stopPullDownRefresh();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        // 上拉加载更多
        console.log("上拉加载更多");
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {
        return {
            title: '发现更多狗狗世界',
            path: '/pages/discover/discover'
        };
    }
})
