// pages/map/map.js
const app = getApp();
const geolib = require('geolib');

import { sendRequest, sendRequestNoAuth } from '../../utils/util.js';

const markerIconSizeDefault = "35px";
const markerIconSizeSet = "55px";
class PoiMarker {
    constructor(id, latitude, longitude, title, icon) {
        this.id = id;
        this.latitude = latitude;
        this.longitude = longitude;
        this.title = title;
        this.iconPath = icon;
        this.width = markerIconSizeDefault;
        this.height = markerIconSizeDefault;
        this.anchor = {
            x: 0.5,
            y: 1
        };
        this.callout = {
            content: title,
            // display: "ALWAYS",
            padding: 10,
            borderRadius: 5
        };
    }
}
// Main
Page({
    isMarkerTapProcessing: false,
    mapTapTimer: null,
    data: {
        loginPopupShow: false,
        // for render
        pofpDetailCard: {
            show: false,
            popUpAnimation: 'slideUp',
            isLiked:false,
            data: {
                uuid: "",
                type_id: 1,
                pid: 1,
                lng_lat: {},
                title: "标题待填充",
                content: "内容待填充",
                address: "地址待填充",
                created_at: {
                    seconds: 1734860780,
                    nanos: 918615000
                },
                updated_at: {
                    seconds: 1734860780,
                    nanos: 918615000
                }
            }
        },
        poiFullPage: {},
        mapSetting: { // 使用setting配置，方便统一还原
            rotate: 0,
            skew: 0,
            layerStyle: 1,
            showLocation: true,
            enableZoom: true,
            enableScroll: true,
            enableRotate: false,
            showCompass: true,
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
                iconPath: "/static/png/marker/m.png",
                width: "38px",
                height: "38px",
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
        pofpTypeList: [],
        pofpTypeStateMap: {},

        pofpDataList: {},

        touchStartTime: 0, // 记录触摸开始时间
        longPressTimeout: null, // 记录长按定时器
    },
    onSearchFocus(){
      console.log("onSearchFocus,chooseLocation");
      const mapData = this.data.mapData;
      wx.chooseLocation({
          success: (res) => {
              console.debug("chooseLocation",res);
              mapData.latitude = res.latitude;
              mapData.longitude = res.longitude;
              this.setData({
                  mapData: mapData
              });
          },
          fail: (err) => {
              console.error("选择地点失败：", err);
          },
      });
    },
    // 长按交互控制
    onMapTouchStart(e) {
        console.log("onMapTouchStart");
        const {
            latitude,
            longitude
        } = e.detail;
        // 开始记录时间并设置长按触发逻辑
        this.setData({
            touchStartTime: Date.now(),
        });

        this.data.longPressTimeout = setTimeout(() => {
            this.onMapLongPress({
                latitude,
                longitude
            });
        }, 3000); // 长按 3 秒
    },
    // 长按交互控制
    onMapTouchEnd() {
        // 清除长按检测
        clearTimeout(this.data.longPressTimeout);
    },
    // 长按交互控制
    onMapLongPress({
        latitude,
        longitude
    }) {
        wx.showToast({
            title: '长按触发!',
            icon: 'success',
        });
    },
    // 过滤poi类型按钮点击事件
    onPofpTypeButtonClick(e) {
        // console.log("tap id e:",e)
        var id = e.currentTarget.dataset.id; // 获取按钮的唯一标识
        var ps = this.data.pofpTypeStateMap;
        console.log("tap id:", id, ps)
        const allTrue = Object.values(ps).every(value => value.select === true);
        if (allTrue) {
            for (let key in ps) {
                ps[key].select = !ps[key].select;
            }
        }
        this.data.pofpTypeStateMap[id].select = !ps[id].select;
        this.pofpReRender();
        // 更新数据
        this.setData({
            pofpTypeStateMap: this.data.pofpTypeStateMap,
        });
    },
    // 点击地图事件
    onTapMap(event) {
        console.log("onTapMap", event);
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
                let markerSet = md.markers.at(-1);
                if (!markerSet || markerSet.id != md.markerSet.id) {
                    md.markers.push(md.markerSet);
                    markerSet = md.markerSet;
                }
                markerSet.latitude = latitude;
                markerSet.longitude = longitude;
                this.setData({
                    mapData: this.data.mapData,
                });
            }
        }, 50);

        // var markers = this.data.mapData.markers;
        // const mapCtx = wx.createMapContext('map', this);
        // let hasMarkerNearby = false;
        // for (let i = 0; i < markers.length; i++) {
        //     const marker = markers[i];
        //     const distance = geolib.getDistance({
        //         latitude: latitude,
        //         longitude: longitude
        //     }, {
        //         latitude: marker.latitude,
        //         longitude: marker.longitude
        //     });
        //     console.log("两点之间的距离为：" + distance + "米");
        //     if (distance < 100) {
        //         hasMarkerNearby = true;
        //         break;
        //     }
        // }

        // if (hasMarkerNearby) {
        //     wx.showToast({
        //         title: '附近有marker',
        //     });
        // } else {
        // console.log(markers);
        // const md = this.data.mapData;
        // let markerSet = md.markers.at(-1);
        // if (!markerSet || markerSet.id != md.markerSet.id) {
        //     md.markers.push(md.markerSet);
        //     markerSet = md.markerSet;
        // }
        // markerSet.latitude = latitude;
        // markerSet.longitude = longitude;
        // this.setData({
        //     mapData: this.data.mapData,
        // });
        // }

    },
    // 地图标签点击事件
    onLabelTap(event) {
        console.log("onLabelTap")
    },
    // 地图气泡点击事件
    onCalloutTap(event) {
        console.log("onCalloutTap")
        this.navigateToPofpCreate();
    },
    // 重置图标到圆形
    markerIconReset() {
        const markers = this.data.mapData.markers;
        for (let i = 0; i < markers.length; i++) {
            if (markers[i].id == this.data.mapData.markerSet.id) {
                continue;
            }
            const poiInfo = this.data.pofpDataList[i];
            markers[i].iconPath = this.data.pofpTypeStateMap[poiInfo.type_id].icon;
            markers[i].width = markerIconSizeDefault;
            markers[i].height = markerIconSizeDefault;
        }
        this.setData({
            mapData: this.data.mapData
        })
    },
    // 标注点击回调
    onTapMarker(event) {
        console.debug("onTapMarker", event);
        // 设置标志，表明正在处理 marker 点击
        this.isMarkerTapProcessing = true;

        // 清除可能存在的地图点击定时器
        if (this.mapTapTimer) {
            clearTimeout(this.mapTapTimer);
            this.mapTapTimer = null;
        }


        const poiInfo = this.data.pofpDataList[event.markerId];
        console.log("onTapMarker poiInfo", poiInfo);
        // 重置其他图标
        this.markerIconReset();
        // change icon
        const markerSelect = this.data.mapData.markers[event.markerId];
        markerSelect.iconPath = this.data.pofpTypeStateMap[poiInfo.type_id].iconSet;
        markerSelect.width = markerIconSizeSet;
        markerSelect.height = markerIconSizeSet;
        // update marker info to detail
        const pofpDetailCard = this.data.pofpDetailCard;
        pofpDetailCard.data = poiInfo;
        this.setData({
            mapData: this.data.mapData,
            pofpDetailCard
        })
        this.pofpDetailCardUp();

        // 一段时间后重置标志
        setTimeout(() => {
            this.isMarkerTapProcessing = false;
        }, 100);
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
    pofpDetailCardUp() {
        // load pofp detail info
        // check token
        const token = wx.getStorageSync('token');
        if (!token || !app.globalData.userInfo) {
            this.regWithLoginPop();
            return
        }
        sendRequest(app, '/popf/detail_query_by_id', 'GET', {
            uuid: this.data.pofpDetailCard.data.uuid
        }).then((res) => {
            console.info('get pofp res', res);
        }).catch((err) => {
            console.error('get pofp failed', err);
        })

        const pofpDetailCard = this.data.pofpDetailCard;
        pofpDetailCard.show = true;
        pofpDetailCard.popUpAnimation = 'slideUp';
        this.setData({
            pofpDetailCard
        });
    },
    // 足迹卡片收回
    pofpDetailCardDown() {
        const pofpDetailCard = this.data.pofpDetailCard;
        pofpDetailCard.popUpAnimation = 'slideDown';
        this.setData({
            pofpDetailCard
        });
        // 动画完成后再隐藏组件
        pofpDetailCard.show = false;
        setTimeout(() => {
            this.setData({
                pofpDetailCard
            });
        }, 300); // 动画时长与 CSS 定义一致
    },
    // 监听视野变化
    onChangeRegion(event) {
        console.log("onChangeRegion")
        // 关闭弹出框
        this.pofpDetailCardDown();
        if (event.type === 'end' && event.causedBy === 'drag') {
            this.pofpListReload();
            const mapCtx = wx.createMapContext('map', this);
            mapCtx.getCenterLocation({
                success: res => {
                    const latitude = res.latitude;
                    const longitude = res.longitude;
                    console.log("center loc：", latitude, longitude)
                }
            });
        }
    },
    // 移动视野到位置
    moveViewToLocation: function () {
        this.reLocation(); // 重新获取位置
        console.log("moveViewToLocation", this.data.mapData)
        const mapCtx = wx.createMapContext('map', this);
        mapCtx.moveToLocation(this.data.mapData.latitude, this.data.mapData.longitude);
    },
    // 重新定位
    reLocation: function () {
        var mapData = this.data.mapData;
        // 获取用户的位置信息
        wx.getLocation({
            type: 'wgs84', // 返回可以用于 wx.openLocation 的经纬度
            success: (res) => {
                const latitude = res.latitude; // 纬度
                const longitude = res.longitude; // 经度
                console.log("reLocation", latitude, longitude);
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
                });
            },
            fail: (err) => {
                console.error('获取位置失败', err);
            }
        });
    },
    // 足迹点重渲染
    pofpReRender() {
        var markers = [];
        console.log("pofpReRender this.pofpDataList", this.data.pofpDataList);
        var ptsMap = this.data.pofpTypeStateMap;
        var pList = this.data.pofpDataList;
        for (let i = 0; i < pList.length; i++) {
            let pofp = pList[i];
            let pts = ptsMap[pofp.type_id];
            console.debug("pofp info", i, pofp, pts);
            if (pts.select) {
                markers.push(new PoiMarker(i,
                    pofp.lng_lat.lat, pofp.lng_lat.lng,
                    pofp.title, pts.icon));
            }
        }
        console.log("markers ", markers);
        this.data.mapData.markers = markers;
        this.setData({
            mapData: this.data.mapData,
        });
    },
    // 足迹列表重加载
    pofpListReload() {
        console.log('pofpListReload');
        const mapCtx = wx.createMapContext('map', this);
        mapCtx.getRegion({
            success: region => {
                console.log("reload pofp,get center region", region);
                sendRequestNoAuth(app, '/popf/base_query_by_bound', 'POST', {
                    type_ids: [],
                    bound: {
                        ne: {
                            lat: region.northeast.latitude,
                            lon: region.northeast.longitude
                        },
                        sw: {
                            lat: region.southwest.latitude,
                            lon: region.southwest.longitude
                        }
                    }
                }).then((res) => {
                    console.log("pofp list res.data", res.data);
                    this.data.pofpDataList = res.data.pofps;
                    console.log("this.pofpDataList", this.data.pofpDataList)
                    this.pofpReRender();
                    console.log("pofp list res.data", res.data);
                }).catch((err) => {
                    console.error('list pofp failed:', err);
                })
            },
            fail: err => {
                console.error(err);
            }
        })

    },
    // 喜欢按钮
    toggleLike() {
        const d = this.data.pofpDetailCard;
        console.log("toggleLike", d.isLiked);
        d.isLiked = !d.isLiked;
        this.setData({
          pofpDetailCard: d
        });
    },
    // 注册框弹出
    regWithLoginPop() {
        this.setData({
            loginPopupShow: true,
        });
    },
    // 足迹完整信息页面
    showPofpFullPage() {

    },
    // 足迹创建页面
    navigateToPofpCreate() {
        const lon = this.data.mapData.longitude;
        const lat = this.data.mapData.latitude;
        wx.navigateTo({
            url: `/pages/sub/pofp-create/pofp-create?lon=${lon}&lat=${lat}`
        });
    },

    // 加载足迹类型信息
    pofpTypeListReload() {
        var _this = this;
        app.getPofpTypes().then((listData) => {
            console.log("get pofp list res.data", listData);
            for (let i = 0; i < listData.length; i++) {
                listData[i].select = true;
                listData[i].icon = '/static/png/pofp-type-show/' + listData[i].id + '.png';
                listData[i].iconSet = '/static/png/pofp-type-show/' + listData[i].id + '-set.png';
                _this.data.pofpTypeStateMap[listData[i].id] = listData[i];
            }
            _this.setData({
                pofpTypeList: listData,
                pofpTypeStateMap: _this.data.pofpTypeStateMap,
            });
            _this.pofpListReload();
        }).catch((err) => {
            console.error('list poi type failed:', err);
        });
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
        this.reLocation();
        this.pofpTypeListReload();
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
