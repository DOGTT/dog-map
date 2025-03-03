const app = getApp();
import { uploadMedia, sendRequest } from '../../../utils/util.js';

const channelCacheKey = 'channelCreateCache';

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


        channelInfo: {
            typeID: 0,
            title: "",
            content: "",
            photos: [], // 存储已选择的媒体文件路径
            lonLat: {
                lon: 0,
                lat: 0
            },
            address: ""
        }
    },
    goBack() {
        wx.setStorageSync(channelCacheKey, this.data.channelInfo);
        wx.navigateBack(); // 返回到上一页
    },
    onInputTitle(e) {
        this.data.channelInfo.title = e.detail.value;
    },
    onInputContent(e) {
        this.data.channelInfo.content = e.detail.value;
    },
    // 标签点击事件
    onTypeBtnTap(e) {
        const index = e.currentTarget.dataset.index; // 获取点击的标签索引
        var channelTypeList = this.data.channelTypeList;
        this.data.channelInfo.typeID = channelTypeList[index].id;
        // 切换选中状态
        for (let i = 0; i < channelTypeList.length; i++) {
            channelTypeList[i].select = false;
            if (i == index) {
                channelTypeList[i].select = true;
            }
        }
        // 更新数据
        this.setData({
            channelTypeList
        });
    },
    // 选择位置
    chooseLocation() {
        console.log("chooseLocation");
        const _this = this;
        wx.chooseLocation({
            success: (res) => {
                console.log(res, _this.data.mapData);
                var marker = _this.data.mapData.markers[0];
                marker.latitude = res.latitude;
                marker.longitude = res.longitude;
                var lonLat = _this.data.channelInfo.lonLat;
                lonLat.lat = res.latitude;
                lonLat.lon = res.longitude;
                _this.data.channelInfo.address = res.name || "未知地点";
                this.setData({
                    channelInfo: _this.data.channelInfo,
                    mapData: _this.data.mapData
                });
            },
            fail: (err) => {
                console.error("选择地点失败：", err);
            },
        });
    },
    // 添加照片
    addPhoto() {
        const _this = this;
        const photoMax = 9;
        // 计算剩余可选数量
        const maxSelectable = photoMax - _this.data.channelInfo.photos.length;
        if (maxSelectable <= 0) {
            wx.showToast({
                title: '最多只能选择' + photoMax + '张图片',
                icon: 'error',
            });
            return;
        }
        wx.chooseMedia({
            count: maxSelectable,
            mediaType: ['image'], // 只允许选择图片
            sourceType: ['album', 'camera'], // 可以从相册选择或拍摄
            success(res) {
                console.log(res);
                for (let i = 0; i < res.tempFiles.length; i++) {
                    _this.data.channelInfo.photos.push(res.tempFiles[i]);
                }
                _this.setData({
                    channelInfo: _this.data.channelInfo
                });
                console.log('photo set:', _this.data.channelInfo);
            },
            fail(err) {
                console.error('Media selection failed:', err);
            },
        });
    },
    // 打开预览
    openPreview(e) {
        const index = e.currentTarget.dataset.index;
        this.setData({
            previewShow: true,
            currentPhoto: this.data.channelInfo.photos[index].tempFilePath,
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
        const photos = this.data.channelInfo.photos;
        const photoSet = photos[index];
        // 将当前图片置于第一位
        photos.splice(index, 1);
        photos.unshift(photoSet);
        this.setData({
            channelInfo: this.data.channelInfo
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
        const photos = this.data.channelInfo.photos;
        // 删除当前图片
        photos.splice(index, 1);
        this.setData({
            channelInfo: this.data.channelInfo
        });
        wx.showToast({
            title: '照片已删除',
            icon: 'success'
        });
    },
    onSave() {
        wx.setStorageSync(channelCacheKey, this.data.channelInfo);
        wx.showToast({
            title: '内容已暂存',
            icon: 'success'
        });
    },
    toastFormError(title, eleID) {
        wx.showToast({
            title: title,
            icon: 'error',
            duration: 2000,
            success: () => {
                // 使用 setTimeout 确保提示框显示后再聚焦
                // setTimeout(() => {
                //   wx.createSelectorQuery().select(`#${eleID}`).focus().exec();
                // }, 2000);
            }
        });
    },
    doChannelCreate() {
        wx.setStorageSync(channelCacheKey, this.data.channelInfo);
        var channel = this.data.channelInfo;
        // 显示加载进度
        wx.showLoading({
            title: '发布中',
        });
        const channelData = {
            type_id: channel.typeID,
            title: channel.title,
            content: channel.content,
            lng_lat: {
                lon: channel.lonLat.lon,
                lat: channel.lonLat.lat
            },
            address: channel.address,
        };
        const photoList = channel.photos.map(photo => photo.tempFilePath);
        uploadMedia(app, photoList, 1).then((res) => {
            console.log(res);
            sendRequest(app, '/channel', 'POST', channelData).then((res) => {
                wx.hideLoading();
                console.log(res);
                wx.removeStorageSync(channelCacheKey);
                wx.showToast({
                    title: '发布成功',
                    icon: 'success'
                });
                this.goBack();
            });
        }).catch(err => {
            wx.hideLoading();
            console.error('图片上传失败:', err);
            wx.showToast({
                title: '图片上传失败',
                icon: 'error'
            });
        })
    },
    onPublishBtnTap() {
        const channel = this.data.channelInfo;
        const _this = this;
        wx.showModal({
            title: '确认发布',
            content: '您确定要发布内容吗？',
            success(res) {
                if (res.confirm) {
                    // 检查清单
                    if (channel.title.length < 1) {
                        _this.toastFormError('请添加标题', 'title');
                        return;
                    }
                    if (channel.content.length < 1) {
                        _this.toastFormError('请添加正文', 'title');
                        return;
                    }
                    if (channel.lonLat.lon == 0) {
                        _this.toastFormError('请选择位置', 'title');
                        return;
                    }
                    _this.doChannelCreate();
                    wx.showToast({
                        title: '发布成功',
                        icon: 'success'
                    });
                }
            },
        });
    },
    onLoad: function (options) {
        console.log("onLoad", options);
        wx.showToast({
            title: '加载中'
        });

        // load cache
        var channelCache = wx.getStorageSync('channelCreateCache');
        if (channelCache) {
            this.data.channelInfo = channelCache;
        }

        if (options.lat && options.lon) {
            var marker = this.data.mapData.markers[0];
            marker.latitude = options.lat;
            marker.longitude = options.lon;
            var lonLat = this.data.channelInfo.lonLat;
            lonLat.lat = options.lat;
            lonLat.lon = options.lon;
        }
        if (options.address) {
            this.data.channelInfo.address = options.address || "未知地点";
        }
        this.setData({
            mapData: this.data.mapData,
            channelInfo: this.data.channelInfo
        });
        // get channel type
        this.channelTypeListReload();
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
            console.log("get channel list res.data", listData);
            for (let i = 0; i < listData.length; i++) {
                listData[i].select = false;
            }
            listData[0].select = true;
            this.setData({
                channelTypeList: listData,
            });
        }).catch((err) => {
            console.error('list poi type failed:', err);
        });
    }
})
