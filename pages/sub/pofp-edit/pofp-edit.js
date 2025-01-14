// pages/sub/pofp-create/pofp-fullshow.js
const app = getApp();
import { uploadMedia, sendRequest } from '../../../utils/util.js';

const pofpCacheKey = 'pofpCreateCache';

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
        pofpTypeList: [],
        previewShow: false, // 是否展示预览
        currentPhoto: '', // 当前预览的图片
        currentPhotoIndex: null, // 当前预览图片的索引


        pofpInfo: {
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
        wx.setStorageSync(pofpCacheKey, this.data.pofpInfo);
        wx.navigateBack(); // 返回到上一页
    },
    onInputTitle(e) {
        this.data.pofpInfo.title = e.detail.value;
    },
    onInputContent(e) {
        this.data.pofpInfo.content = e.detail.value;
    },
    // 标签点击事件
    onTypeBtnTap(e) {
        const index = e.currentTarget.dataset.index; // 获取点击的标签索引
        var pofpTypeList = this.data.pofpTypeList;
        this.data.pofpInfo.typeID = pofpTypeList[index].id;
        // 切换选中状态
        for (let i = 0; i < pofpTypeList.length; i++) {
            pofpTypeList[i].select = false;
            if (i == index) {
                pofpTypeList[i].select = true;
            }
        }
        // 更新数据
        this.setData({
            pofpTypeList
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
                var lonLat = _this.data.pofpInfo.lonLat;
                lonLat.lat = res.latitude;
                lonLat.lon = res.longitude;
                _this.data.pofpInfo.address = res.name || "未知地点";
                this.setData({
                    pofpInfo: _this.data.pofpInfo,
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
        const maxSelectable = photoMax - _this.data.pofpInfo.photos.length;
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
                    _this.data.pofpInfo.photos.push(res.tempFiles[i]);
                }
                _this.setData({
                    pofpInfo: _this.data.pofpInfo
                });
                console.log('photo set:', _this.data.pofpInfo);
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
            currentPhoto: this.data.pofpInfo.photos[index].tempFilePath,
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
        const photos = this.data.pofpInfo.photos;
        const photoSet = photos[index];
        // 将当前图片置于第一位
        photos.splice(index, 1);
        photos.unshift(photoSet);
        this.setData({
            pofpInfo: this.data.pofpInfo
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
        const photos = this.data.pofpInfo.photos;
        // 删除当前图片
        photos.splice(index, 1);
        this.setData({
            pofpInfo: this.data.pofpInfo
        });
        wx.showToast({
            title: '照片已删除',
            icon: 'success'
        });
    },
    onSave() {
        wx.setStorageSync(pofpCacheKey, this.data.pofpInfo);
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
    doPofpCreate() {
        wx.setStorageSync(pofpCacheKey, this.data.pofpInfo);
        var pofp = this.data.pofpInfo;
        // 显示加载进度
        wx.showLoading({
            title: '发布中',
        });
        const pofpData = {
            type_id: pofp.typeID,
            title: pofp.title,
            content: pofp.content,
            lng_lat: {
                lon: pofp.lonLat.lon,
                lat: pofp.lonLat.lat
            },
            address: pofp.address,
        };
        const photoList = pofp.photos.map(photo => photo.tempFilePath);
        uploadMedia(app, photoList, 1).then((res) => {
            console.log(res);
            sendRequest(app, '/pofp', 'POST', pofpData).then((res) => {
                wx.hideLoading();
                console.log(res);
                wx.removeStorageSync(pofpCacheKey);
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
        const pofp = this.data.pofpInfo;
        const _this = this;
        wx.showModal({
            title: '确认发布',
            content: '您确定要发布内容吗？',
            success(res) {
                if (res.confirm) {
                    // 检查清单
                    if (pofp.title.length < 1) {
                        _this.toastFormError('请添加标题', 'title');
                        return;
                    }
                    if (pofp.content.length < 1) {
                        _this.toastFormError('请添加正文', 'title');
                        return;
                    }
                    if (pofp.lonLat.lon == 0) {
                        _this.toastFormError('请选择位置', 'title');
                        return;
                    }
                    _this.doPofpCreate();
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
        var pofpCache = wx.getStorageSync('pofpCreateCache');
        if (pofpCache) {
            this.data.pofpInfo = pofpCache;
        }

        if (options.lat && options.lon) {
            var marker = this.data.mapData.markers[0];
            marker.latitude = options.lat;
            marker.longitude = options.lon;
            var lonLat = this.data.pofpInfo.lonLat;
            lonLat.lat = options.lat;
            lonLat.lon = options.lon;
        }
        if (options.address) {
            this.data.pofpInfo.address = options.address || "未知地点";
        }
        this.setData({
            mapData: this.data.mapData,
            pofpInfo: this.data.pofpInfo
        });
        // get pofp type
        this.pofpTypeListReload();
    },
    onShow() {
        console.log("onShow")
    },
    onReady() {
        console.log("onReady")
    },
    // 加载足迹类型信息
    pofpTypeListReload() {
        app.getPofpTypes().then((listData) => {
            console.log("get pofp list res.data", listData);
            for (let i = 0; i < listData.length; i++) {
                listData[i].select = false;
            }
            listData[0].select = true;
            this.setData({
                pofpTypeList: listData,
            });
        }).catch((err) => {
            console.error('list poi type failed:', err);
        });
    }
})
