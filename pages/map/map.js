// pages/map/map.js
const app = getApp();
const geolib = require('geolib');
const token = wx.getStorageSync('token');
const {
	darwAndsaveCanvasAsImage
} = require('../../utils/canvas');
const {
	buildUrlWithParams
} = require('../../utils/util');

class PoiMarker {
	constructor(id, latitude, longitude, title, icon) {
		this.id = id;
		this.latitude = latitude;
		this.longitude = longitude;
		this.title = title;
		this.iconPath = icon;
		this.width = "48px";
		this.height = "48px";
		this.anchor = {
			x: 0.5,
			y: 0.5
		};
		this.callout = {
			content: title,
			display: "ALWAYS",
			padding: 10,
			borderRadius: 5
		};
	}
}
// Main
Page({
	data: {
		loginPopupShow: false,
		// for render
		pofpDetailCard: {
			show: false,
			popUpAnimation: 'slideUp',
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
			markers: [{
				id: 1,
				title: "示例位置",
				latitude: 22.55329,
				longitude: 113.90308,
				iconPath: "/static/png/marker/Marker3_Activated@3x.png",
				width: "38px",
				height: "38px",
				callout: {
					content: "此处-发布",
					display: "ALWAYS",
					padding: 10,
					borderRadius: 2
				}
			}]
		},
		pofpMap: {},
		pofpTypeList: [],
		pofpTypeStateMap: {},
		touchStartTime: 0, // 记录触摸开始时间
		longPressTimeout: null, // 记录长按定时器
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
		console.log("onTapMap", event)
		const latitude = event.detail.latitude;
		const longitude = event.detail.longitude;
		var markers = this.data.mapData.markers;
		const mapCtx = wx.createMapContext('map', this);
		let hasMarkerNearby = false;
		for (let i = 0; i < markers.length; i++) {
			const marker = markers[i];
			const distance = geolib.getDistance({
				latitude: latitude,
				longitude: longitude
			}, {
				latitude: marker.latitude,
				longitude: marker.longitude
			});
			console.log("两点之间的距离为：" + distance + "米");
			if (distance < 100) {
				hasMarkerNearby = true;
				break;
			}
		}

		if (hasMarkerNearby) {
			wx.showToast({
				title: '附近有marker',
				icon: 'success'
			});
		} else {
			// console.log(markers);
			this.data.mapData.markers[0].latitude = latitude;
			this.data.mapData.markers[0].longitude = longitude;
			this.data.mapData.markers = markers;
			this.setData({
				mapData: this.data.mapData,
			});
		}

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
		let markers = this.data.mapData.markers;
		for (let i = 1; i < markers.length; i++) {
			let poiInfo = this.data.pofpMap[i + 1];
			markers[i].iconPath = this.data.pofpTypeStateMap[poiInfo.type_id].icon;
			markers[i].anchor = {
				x: 0.5,
				y: 0.5
			};
		}
		this.data.mapData.markers = markers;
		this.setData({
			mapData: this.data.mapData
		})
	},
	// 标注点击回调
	onTapMarker(event) {
		console.debug("onTapMarker", event)
		const poiInfo = this.data.pofpMap[event.markerId];
		console.log("onTapMarker poiInfo", poiInfo);
		// 重置其他图标
		this.markerIconReset();
		// change icon
		let markers = this.data.mapData.markers;
		let markerSelect = markers[event.markerId - 1];
		markerSelect.iconPath = this.data.pofpTypeStateMap[poiInfo.type_id].iconSet;
		markerSelect.anchor = {
			x: 0.5,
			y: 1
		};
		// update marker info to detail
		var pofpDetailCard = this.data.pofpDetailCard;
		pofpDetailCard.data = poiInfo;
		this.setData({
			mapData: this.data.mapData,
			pofpDetailCard
		})
		this.pofpDetailCardUp();

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
		let token = wx.getStorageSync('token');
		if (!token || !app.globalData.userInfo) {
			this.regWithLoginPop();
			return
		}
		const _this = this;
		const baseUrl = app.globalData.baseUrl + '/popf/detail_query_by_id';
		const url = buildUrlWithParams(baseUrl, {
			uuid: _this.data.pofpDetailCard.data.uuid
		});

		wx.request({
			method: 'GET',
			url: url,
			header: {
				WeixinRequestCode: app.globalData.wxCode,
				Authorization: `Bearer ${token}`
			},
			dataType: 'json',
			success: (res) => {
				console.info('get pofp res', res);
			},
			fail: (err) => {
				console.error('get pofp failed', err);
			}
		});

		let pofpDetailCard = this.data.pofpDetailCard;
		pofpDetailCard.show = true;
		pofpDetailCard.popUpAnimation = 'slideUp';
		this.setData({
			pofpDetailCard
		});
	},
	// 足迹卡片收回
	pofpDetailCardDown() {
		let pofpDetailCard = this.data.pofpDetailCard;
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
			const mapCtx = wx.createMapContext('map', this);
			mapCtx.getCenterLocation({
				success: res => {
					const latitude = res.latitude;
					const longitude = res.longitude;
					console.log("center loc：", latitude, longitude)
				}
			});
			mapCtx.getRegion({
				success: res => {
					console.log("center res", res)
				}
			})
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
					fillColor: '#00FF0033',
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
		if (this.data.mapData.markers.length > 0 && this.data.mapData.markers[0].id == 1) {
			markers.push(this.data.mapData.markers[0]);
		}
		console.log("pofpReRender this.pofpMap", this.data.pofpMap);
		var ptsMap = this.data.pofpTypeStateMap;
		var pMap = this.data.pofpMap;
		for (let makerID in pMap) {
			let poi = pMap[makerID];
			let pts = ptsMap[poi.type_id];
			console.log("Debug", makerID, poi, pts);
			if (pts.select) {
				markers.push(new PoiMarker(parseInt(makerID, 10),
					poi.lng_lat.lat, poi.lng_lat.lng,
					poi.title, pts.icon));
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
		const mapCtx = wx.createMapContext('map', this);
		mapCtx.getRegion({
			success: region => {
				console.log("reload pofp,get center region", region);
				// 查询附近的poi
				wx.request({
					method: 'POST',
					url: app.globalData.baseUrl + '/popf/base_query_by_bound',
					header: {
						WeixinRequestCode: app.globalData.wxCode
						// Authorization: `Bearer ${token}`
					},
					dataType: 'json',
					data: {
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
					},
					success: (res) => {
						console.log("pofp list res.data", res.data);
						let pl = res.data.pofps;
						for (let i = 0; i < pl.length; i++) {
							this.data.pofpMap[i + 2] = pl[i];
						}
						console.log("this.pofpMap", this.data.pofpMap)
						this.pofpReRender();
					},
					fail: (err) => {
						console.error('list pofp failed:', err);
					}
				});
			}
		})


	},
	// 喜欢按钮
	toggleFavorite() {
		var d = this.data.pofpDetail;
		console.log("toggleFavorite", d.is_favorited);
		d.is_favorited = !d.is_favorited;
		this.setData({
			pofpDetail: d
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
	// 绘制足迹图标
	drawPofpPng() {
		var canvasConfigs = [];
		for (let typeID in this.data.pofpTypeStateMap) {
			let poiData = this.data.pofpTypeStateMap[typeID].data;
			canvasConfigs.push({
				typeID: typeID,
				canvasId: '#icon-' + typeID,
				// canvasSetId: '#iconSet-'+typeID,
				//        shape:'circle',drop
				iconSrc: '/static/png/pofp-type/' + typeID + '.png',
				fillStyle: poiData.theme_color,
			})
		}
		console.log("canvasConfigs ", canvasConfigs)
		const imagePromises = canvasConfigs.map((config) =>
			darwAndsaveCanvasAsImage({
				canvasId: config.canvasId,
				shape: 'circle',
				iconSrc: config.iconSrc,
				fillStyle: config.fillStyle,
			}).then((tempPath) => {
				this.data.pofpTypeStateMap[config.typeID].icon = tempPath;
			}).catch((err) => {
				console.error('图片生成失败:', err);
			})
		);
		// 批量处理图片生成
		Promise.all(imagePromises)
			.then(() => {
				console.log('所有图片生成成功:', this.data.pofpTypeStateMap);
				this.setData({
					pofpTypeStateMap: this.data.pofpTypeStateMap,
				})
				// this.pofpListReRender();
			})
			.catch((err) => {
				console.error('图片生成失败:', err);
			});

		var canvasSetConfigs = [];
		for (let typeID in this.data.pofpTypeStateMap) {
			let poiData = this.data.pofpTypeStateMap[typeID].data;
			canvasSetConfigs.push({
				typeID: typeID,
				canvasId: '#iconSet-' + typeID,
				iconSrc: '/static/png/pofp-type/' + typeID + '.png',
				fillStyle: poiData.theme_color,
			})
		}
		const imagePromisesSet = canvasSetConfigs.map((config) =>
			darwAndsaveCanvasAsImage({
				canvasId: config.canvasId,
				shape: 'drop',
				iconSrc: config.iconSrc,
				fillStyle: config.fillStyle,
			}).then((tempPath) => {
				this.data.pofpTypeStateMap[config.typeID].iconSet = tempPath;
			}).catch((err) => {
				console.error('图片生成失败:', err);
			})
		);
		// 批量处理图片生成
		Promise.all(imagePromisesSet)
			.then(() => {
				console.log('所有选择中图片生成成功:', this.data.pofpTypeStateMap);
			})
			.catch((err) => {
				console.error('图片生成失败:', err);
			});
	},
	// 加载足迹类型信息
	pofpTypeListReload() {
		var _this = this;
		app.getPofpTypes().then((listData) => {
			console.log("get pofp list res.data", listData);
			for (let i = 0; i < listData.length; i++) {
				_this.data.pofpTypeStateMap[listData[i].id] = {
					select: true,
					data: listData[i],
				};
			}
			_this.setData({
				pofpTypeList: listData,
				pofpTypeStateMap: _this.data.pofpTypeStateMap,
			});
			_this.drawPofpPng();
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
