// pages/map/map.js
const app = getApp()
const mk = require('./marker')
import {
    sendRequest
} from '../../utils/http'
import {
    getFormattedDistance
} from '../../utils/geo'
import {
    getShortAddress
} from '../../utils/util'

// Main
Page({
    headZoneStyle: '',
    isMarkerTapProcessing: false,
    mapTapTimer: null,
    data: {
        loginPopupShow: false,
        // for render
        channelDetailCard: {
            show: false,
            popUpAnimation: 'slideUp',
            isLiked: false,
            data: {}
        },
        buttonOffset: 0, // 按钮位置偏移量
        poiFullPage: {},
        mapSetting: { // 使用setting配置，方便统一还原
            rotate: 0,
            skew: 0,
            layerStyle: 1,
            showLocation: true,
            enableZoom: true,
            enableScroll: true,
            enableRotate: false,
            showCompass: false,
            enable3D: false,
            enableOverlooking: false,
            enableSatellite: false,
            enableTraffic: false
        },
        mapData: {
            latitude: 22.55329,
            longitude: 113.90308,
            scale: 14,
            circles: [],
            markers: [],
            markerSet: {
                id: 9999,
                title: "发布气泡",
                latitude: 22.55329,
                longitude: 113.90308,
                iconPath: "/static/png/marker/m-r.png",
                width: "45px",
                height: "45px",
                callout: {
                    content: "在此发布",
                    display: "ALWAYS",
                    padding: 5,
                    borderRadius: 10,
                    borderWidth: 2,
                    fontSize: "15",
                    color: "#FFF",
                    borderColor: "#FFF",
                    bgColor: "#00BFFF",
                }
            }
        },
        channelTypeList: [],
        channelTypeStateMap: {},

        channelDataList: {},

        touchStartTime: 0, // 记录触摸开始时间
        longPressTimeout: null, // 记录长按定时器
    },
    onSearchFocus() {
        console.log("onSearchFocus,chooseLocation")
        const mapData = this.data.mapData;
        wx.chooseLocation({
            success: (res) => {
                console.debug("chooseLocation", res)
                mapData.latitude = res.latitude;
                mapData.longitude = res.longitude;
                this.setData({
                    mapData: mapData
                })
            },
            fail: (err) => {
                console.error("选择地点失败：", err)
            },
        })
    },
    // 长按交互控制
    onMapTouchStart(e) {
        console.log("onMapTouchStart")
        const {
            latitude,
            longitude
        } = e.detail;
        // 开始记录时间并设置长按触发逻辑
        this.setData({
            touchStartTime: Date.now(),
        })

        this.data.longPressTimeout = setTimeout(() => {
            this.onMapLongPress({
                latitude,
                longitude
            })
        }, 3000) // 长按 3 秒
    },
    // 长按交互控制
    onMapTouchEnd() {
        // 清除长按检测
        clearTimeout(this.data.longPressTimeout)
    },
    // 长按交互控制
    onMapLongPress({
        latitude,
        longitude
    }) {
        wx.showToast({
            title: '长按触发!',
            icon: 'success',
        })
    },
    navToChannelPage() {
        console.log('navToChannelPage', this.data.channelDetailCard)
        const chanData = this.data.channelDetailCard.data
        wx.navigateTo({
            url: `/pages/sub/channel-main/channel-main?id=${chanData.id}&title=${chanData.title}`
        })
    },

    navToChannelHome() {
        console.log('navToChannelHome', this.data.channelDetailCard)
        const chanData = this.data.channelDetailCard.data
        wx.navigateTo({
            url: `/pages/sub/channel-home/channel-home?id=${chanData.id}`
        })
    },
    // 过滤poi类型按钮点击事件
    onChannelTypeButtonClick(e) {
        // console.log("tap id e:",e)
        var id = e.currentTarget.dataset.id; // 获取按钮的唯一标识
        var ps = this.data.channelTypeStateMap;
        const allTrue = Object.values(ps).every(value => value.select === true)
        console.log("tap id:", id, ps, this.data.channelTypeList)
        if (allTrue) {
            for (let key in ps) {
                ps[key].select = !ps[key].select;
            }
        }
        this.data.channelTypeStateMap[id].select = !ps[id].select;
        this.channelReRender()
        // 更新数据
        this.setData({
            channelTypeStateMap: this.data.channelTypeStateMap,
        })
    },
    // 点击地图事件
    onTapMap(event) {
        console.log("onTapMap", event)
        const latitude = event.detail.latitude;
        const longitude = event.detail.longitude;
        if (this.isMarkerTapProcessing) {
            return;
        }
        // 使用定时器延迟处理地图点击
        this.mapTapTimer = setTimeout(() => {
            // 再次检查是否在处理 marker 点击
            if (!this.isMarkerTapProcessing) {
                // 处理地图点击逻辑
                const md = this.data.mapData;
                let markerSet = md.markers.at(-1)
                if (!markerSet || markerSet.id != md.markerSet.id) {
                    md.markers.push(md.markerSet)
                    markerSet = md.markerSet;
                }
                markerSet.latitude = latitude;
                markerSet.longitude = longitude;
                this.setData({
                    mapData: this.data.mapData,
                })
            }
        }, 50)

        // var markers = this.data.mapData.markers;
        // const mapCtx = wx.createMapContext('map', this)
        // let hasMarkerNearby = false;
        // for (let i = 0; i < markers.length; i++) {
        //     const marker = markers[i];
        //     const distance = geolib.getDistance({
        //         latitude: latitude,
        //         longitude: longitude
        //     }, {
        //         latitude: marker.latitude,
        //         longitude: marker.longitude
        //     })
        //     console.log("两点之间的距离为：" + distance + "米")
        //     if (distance < 100) {
        //         hasMarkerNearby = true;
        //         break;
        //     }
        // }

        // if (hasMarkerNearby) {
        //     wx.showToast({
        //         title: '附近有marker',
        //     })
        // } else {
        // console.log(markers)
        // const md = this.data.mapData;
        // let markerSet = md.markers.at(-1)
        // if (!markerSet || markerSet.id != md.markerSet.id) {
        //     md.markers.push(md.markerSet)
        //     markerSet = md.markerSet;
        // }
        // markerSet.latitude = latitude;
        // markerSet.longitude = longitude;
        // this.setData({
        //     mapData: this.data.mapData,
        // })
        // }

    },
    // 地图标签点击事件
    onLabelTap(event) {
        console.log("onLabelTap")
    },
    // 地图气泡点击事件
    onCalloutTap(event) {
        console.log("onCalloutTap")
        this.navigateToChannelCreate()
    },
    // 重置图标到圆形
    markerIconReset() {
        const markers = this.data.mapData.markers;
        for (let i = 0; i < markers.length; i++) {
            if (markers[i].id == this.data.mapData.markerSet.id) {
                continue;
            }
            const poiInfo = this.data.channelDataList[i];
            markers[i].iconPath = this.data.channelTypeStateMap[poiInfo.type_id].icon;
            markers[i].width = mk.IconSize.default
            markers[i].height = mk.IconSize.default
        }
        this.setData({
            mapData: this.data.mapData
        })
    },
    // 标注点击回调
    onTapMarker(event) {
        console.debug("onTapMarker", event)
        // 设置标志，表明正在处理 marker 点击
        this.isMarkerTapProcessing = true;
        // 清除可能存在的地图点击定时器
        if (this.mapTapTimer) {
            clearTimeout(this.mapTapTimer)
            this.mapTapTimer = null;
        }
        const poiInfo = this.data.channelDataList[event.markerId];
        console.log("onTapMarker poiInfo", poiInfo)
        // 重置其他图标
        this.markerIconReset()
        // change icon
        const markerSelect = this.data.mapData.markers[event.markerId];
        markerSelect.iconPath = this.data.channelTypeStateMap[poiInfo.type_id].iconSet;
        markerSelect.width = mk.IconSize.focus;
        markerSelect.height = mk.IconSize.focus;
        // update marker info to detail
        const channelDetailCard = this.data.channelDetailCard;
        channelDetailCard.data = poiInfo;
        this.setData({
            mapData: this.data.mapData,
            channelDetailCard
        })
        this.channelDetailCardUp()
        // 一段时间后重置标志
        setTimeout(() => {
            this.isMarkerTapProcessing = false;
        }, 100)
    },
    // poi点击回调
    onTapPoi(event) {
        const name = event.detail.name.length <= 8 ? event.detail.name : event.detail.name.substring(0, 8) + '...';
        const latitude = event.detail.latitude;
        const longitude = event.detail.longitude;
        console.log("tap poi")
        this.setData({
            poiInfo: name + '：' + latitude.toFixed(6) + ',' + longitude.toFixed(6),
        })

    },
    // 足迹卡片弹出加载
    channelDetailCardUp() {
        // load channel detail info
        const channelDetailCard = this.data.channelDetailCard;
        // 计算地址
        channelDetailCard.shortAddress = getShortAddress(channelDetailCard.data.location.address);
        // 计算距离
        channelDetailCard.distance = getFormattedDistance(this.data.mapData, {
            latitude: channelDetailCard.data.location.lng_lat.lat,
            longitude: channelDetailCard.data.location.lng_lat.lng
        })
        console.log('card up', this.data.channelDetailCard)
        sendRequest(app, '/channel/full_query_by_id', 'GET', {
            chan_id: this.data.channelDetailCard.data.id
        }).then((res) => {
            console.info('get channel res', res)
            const channelDetailCard = this.data.channelDetailCard;
            channelDetailCard.avatar = res.data.channel.avatar.get_url;
            this.setData({
                channelDetailCard
            })

            // 获取弹出框实际高度并调整按钮位置
            this.adjustButtonPositions();
        }).catch((err) => {
            console.error('get channel failed', err)
        })
        channelDetailCard.show = true;
        channelDetailCard.popUpAnimation = 'slideUp';
        this.setData({
            channelDetailCard
        })

        // 获取弹出框实际高度并调整按钮位置
        setTimeout(() => {
            this.adjustButtonPositions();
        }, 300); // 等待动画完成
    },

    // 调整按钮位置
    adjustButtonPositions() {
        const query = wx.createSelectorQuery();
        query.select('.channel-detail-popup').boundingClientRect();
        query.exec((res) => {
            if (res && res[0]) {
                const popupHeight = res[0].height;
                // 更新按钮位置
                this.setData({
                    buttonOffset: popupHeight
                });

                // 动态设置CSS变量
                const style = document.documentElement.style;
                style.setProperty('--popup-height', `${popupHeight}px`);
            }
        });
    },

    // 足迹卡片收回
    channelDetailCardDown() {
        const channelDetailCard = this.data.channelDetailCard;
        channelDetailCard.popUpAnimation = 'slideDown';
        this.setData({
            channelDetailCard
        })
        // 动画完成后再隐藏组件
        channelDetailCard.show = false;
        setTimeout(() => {
            this.setData({
                channelDetailCard
            })
        }, 300) // 动画时长与 CSS 定义一致
    },
    // 监听视野变化
    onChangeRegion(event) {
        console.log("onChangeRegion")
        // 关闭弹出框
        this.channelDetailCardDown()
        if (event.type === 'end' && event.causedBy === 'drag') {
            this.channelListReload()
            const mapCtx = wx.createMapContext('map', this)
            mapCtx.getCenterLocation({
                success: res => {
                    const latitude = res.latitude;
                    const longitude = res.longitude;
                    console.log("center loc：", latitude, longitude)
                }
            })
        }
    },
    // 移动视野到位置
    moveViewToLocation: function () {
        // 重新获取位置，然后在回调中移动视野
        this.reLocation(() => {
            console.log("moveViewToLocation", this.data.mapData)
            const mapCtx = wx.createMapContext('map', this)
            mapCtx.moveToLocation(this.data.mapData.latitude, this.data.mapData.longitude)
        });
    },
    // 重新定位
    reLocation: function (callback) {
        var mapData = this.data.mapData;
        // 获取用户的位置信息
        wx.getLocation({
            type: 'wgs84', // 返回可以用于 wx.openLocation 的经纬度
            success: (res) => {
                const latitude = res.latitude; // 纬度
                const longitude = res.longitude; // 经度
                console.log("reLocation", latitude, longitude)
                mapData.latitude = latitude;
                mapData.longitude = longitude;
                mapData.circles = [{
                    latitude: latitude,
                    longitude: longitude,
                    radius: 1000, // 圆圈半径，单位米
                    fillColor: '#00000011',
                    color: '#E6E6FA', // 圆圈边框颜色
                    strokeWidth: 0 // 边框宽度
                }];
                this.setData({
                    mapData: mapData,
                })
                if (callback) {
                    callback();
                }
            },
            fail: (err) => {
                console.error('获取位置失败', err)
            }
        })
    },
    // 足迹点重渲染
    channelReRender() {
        var markers = [];
        console.log("channelReRender this.channelDataList", this.data.channelDataList)
        var ptsMap = this.data.channelTypeStateMap;
        var pList = this.data.channelDataList;
        if (!pList) {
            return
        }
        for (let i = 0; i < pList.length; i++) {
            let channel = pList[i];
            let pts = ptsMap[channel.type_id];
            console.debug("channel info", i, channel, pts)
            if (pts && pts.select) {
                let loc = channel.location;
                markers.push(new mk.PoiMarker(i,
                    loc.lng_lat.lat, loc.lng_lat.lng,
                    channel.title, pts.icon))
            }
        }
        console.log("markers ", markers)
        this.data.mapData.markers = markers;
        this.setData({
            mapData: this.data.mapData,
        }, () => {
            console.log("markers已更新", this.data.mapData.markers);
        });
    },
    // 足迹列表重加载
    channelListReload() {
        console.log('channelListReload')
        const mapCtx = wx.createMapContext('map', this)
        const typeIds = [];
        const typeData = this.data.channelTypeList
        for (let i = 0; i < typeData.length; i++) {
            if (typeData[i].select) {
                typeIds.push(parseInt(typeData[i].id))
            }
        }

        mapCtx.getRegion({
            success: region => {
                console.log("reload channel,get center region", region, typeIds)
                sendRequest(app, '/channel/base_query_by_bound', 'POST', {
                    type_ids: typeIds,
                    bound: {
                        ne: {
                            lat: region.northeast.latitude,
                            lng: region.northeast.longitude
                        },
                        sw: {
                            lat: region.southwest.latitude,
                            lng: region.southwest.longitude
                        }
                    }
                }).then((res) => {
                    console.log("this.channelDataList res", res)
                    this.data.channelDataList = res.data.channels;
                    this.channelReRender()
                    console.log("channel list res.data", res.data)
                }).catch((err) => {
                    console.error('list channel failed:', err)
                })
            },
            fail: err => {
                console.error(err)
            }
        })

    },
    // 喜欢按钮
    toggleLike() {
        const d = this.data.channelDetailCard;
        console.log("toggleLike", d.isLiked)
        d.isLiked = !d.isLiked;
        this.setData({
            channelDetailCard: d
        })
    },
    // 注册框弹出
    regWithLoginPop() {
        this.setData({
            loginPopupShow: true,
        })
    },
    // 足迹完整信息页面
    showChannelFullPage() {

    },
    // 足迹创建页面
    navigateToChannelCreate() {
        const lng = this.data.mapData.longitude;
        const lat = this.data.mapData.latitude;
        wx.navigateTo({
            url: `/pages/sub/channel-create/channel-create?lng=${lng}&lat=${lat}`
        })
    },

    // 切换卫星图层
    toggleSatelliteLayer() {
        const mapSetting = this.data.mapSetting;
        mapSetting.enableSatellite = !mapSetting.enableSatellite;
        this.setData({
            mapSetting: mapSetting
        });

        // 显示提示
        wx.showToast({
            title: mapSetting.enableSatellite ? '已切换到卫星图层' : '已切换到普通图层',
            icon: 'none',
            duration: 1500
        });
    },

    // 加载足迹类型信息
    channelTypeListReload() {
        var _this = this;
        app.getChannelTypes().then((listData) => {
            console.log("get channel-type list res.data", listData)
            for (let i = 0; i < listData.length; i++) {
                listData[i].select = true;
                listData[i].icon = '/static/png/channel-type-show/' + listData[i].id + '.png';
                listData[i].iconSet = '/static/png/channel-type-show/' + listData[i].id + '-set.png';
                _this.data.channelTypeStateMap[listData[i].id] = listData[i];
            }
            _this.setData({
                channelTypeList: listData,
                channelTypeStateMap: _this.data.channelTypeStateMap,
            }, function () {
                // 在setData的回调中执行channelListReload，确保数据已更新
                _this.channelListReload();
            });
        }).catch((err) => {
            console.error('list poi type failed:', err)
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        console.log("onReady")
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        console.log("onLoad")
        const menuButtonInfo = wx.getMenuButtonBoundingClientRect()
        // 获取胶囊按钮的高度和位置
        const capsuleHeight = menuButtonInfo.height;
        const capsuleTop = menuButtonInfo.top;
        this.setData({
            headZoneStyle: `top: ${capsuleTop}px;`
        })
        console.log("onload", capsuleHeight, capsuleTop)

        // 先执行reLocation，然后在回调中执行channelTypeListReload
        this.reLocation(() => {
            this.channelTypeListReload();
        });
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        console.log("onShow")

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

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }


})
