// pages/map/map.js
const app = getApp();
const token = wx.getStorageSync('token');
const {
	darwAndsaveCanvasAsImage
} = require('../../utils/canvas');
import Toast from '../../components/@vant/weapp/toast/toast';

class PoiMarker {
	constructor(id, latitude, longitude, title, icon) {
		this.id = id;
		this.latitude = latitude;
		this.longitude = longitude;
		// this.title = title;
		this.iconPath = icon;
		this.width = "48px";
    this.height = "48px";
    this.anchor = {x:0.5,y:0.5};
		this.callout = {
			content: title,
			display: "BYCLICK",
			padding: 10,
			borderRadius: 2
		};
	}
}
// Main
Page({
	data: {
		// for render
		poiDetailPopupShow: false,
		poiDetailPopupAnimation: 'slideUp',
		poiDetail: {
			id: "",
			title: "信息待填充",
			content: "",
			address: "",
			create_at: "",
			update_at: "",
			publish_user: {
				user_id: 1,
				avatar: ""
			},
			dynamic_info: {}
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
				title: "当前位置",
				latitude: 22.55329,
				longitude: 113.90308,
				iconPath: "/static/png/marker/Marker3_Activated@3x.png",
				width: "38px",
				height: "38px",
				callout: {
					content: "我的位置",
					display: "BYCLICK",
					padding: 10,
					borderRadius: 2
				}
			}]
		},
		poiMap: {},
		poiTypeList: [],
		poiTypeStateMap: {}
	},
	onPOITypeButtonClick(e) {
		// console.log("tap id e:",e)
		var id = e.currentTarget.dataset.id; // 获取按钮的唯一标识
		var ps = this.data.poiTypeStateMap;
		console.log("tap id:", id, ps)
		const allTrue = Object.values(ps).every(value => value.select === true);
		if (allTrue) {
			for (let key in ps) {
				ps[key].select = !ps[key].select;
			}
		}
		this.data.poiTypeStateMap[id].select = !ps[id].select;
		this.poiListReRender();
		// 更新数据
		this.setData({
			poiTypeStateMap: this.data.poiTypeStateMap,
		});
	},
	// 点击地图事件
	onTapMap(event) {
		console.log("onTapMap")
		const latitude = event.detail.latitude;
		const longitude = event.detail.longitude;
		var markers = this.data.mapData.markers;
		markers[0].latitude = latitude;
		markers[0].longitude = longitude;

	},
	onLabelTap(event) {
		console.log("onLabelTap")
	},
	onCalloutTap(event) {
		console.log("onCalloutTap")
		this.setData({
			show: true
		});
	},
	popFullsize() {
		console.log("popFullsize")
		this.setData({
			popupStyle: "height: 80%;"
		})
	},
	onClose() {
		this.setData({
			show: false,
			popupStyle: "height: 30%;"
		});
  },
  
  markerIconReset() {
     let markers = this.data.mapData.markers;
     for (let i=1;i<markers.length;i++) {
      let poiInfo = this.data.poiMap[i+1];
      markers[i].iconPath = this.data.poiTypeStateMap[poiInfo.type_id].icon;
      markers[i].anchor = {x:0.5,y:0.5};
     }
     this.data.mapData.markers = markers;
     this.setData({
      mapData: this.data.mapData
		})
  },
	// 标注点击回调
	onTapMarker(event) {
    console.log("onTapMarker", event)
    const poiInfo = this.data.poiMap[event.markerId];
    console.log(poiInfo);
    this.markerIconReset();
    // change icon
    let markers = this.data.mapData.markers;
    for (let i=1;i<markers.length;i++) {
      if (i+1===event.markerId) {
        markers[i].iconPath = this.data.poiTypeStateMap[poiInfo.type_id].iconSet;
        markers[i].anchor = {x: 0.5, y: 1};
        markers[i].width = '58px';
        markers[i].height = '58px';
      }
      console.log('data:',markers[i] )
    }
    this.data.mapData.markers = markers;
		// update marker info to detail
		this.setData({
      mapData: this.data.mapData,
			poiDetail: {
				title: poiInfo.name,
			}
		})
		this.poiDetailUp();
		// const marker = this.data.markers[0];
		// const mapCtx = wx.createMapContext('map', this);
		// mapCtx.moveToLocation({
		// 	latitude: marker.latitude,
		// 	longitude: marker.longitude,
		// 	success: () => {
		// 		this.setData({
		// 			latitude: marker.latitude,
		// 			longitude: marker.longitude,
		// 		});
		// 	},
		// 	fail: () => {}
		// })
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
		// this.setData({
		// poiCallbackTxt: name + '：' + latitude.toFixed(6) + ',' + longitude.toFixed(6)
		// });
	},
	poiDetailUp() {
		this.setData({
			poiDetailPopupShow: true,
			poiDetailPopupAnimation: 'slideUp', // 添加向上动画
		});
	},
	poiDetailDown() {
		this.setData({
			poiDetailPopupAnimation: 'slideDown', // 添加向下动画
		});
		// 动画完成后再隐藏组件
		setTimeout(() => {
			this.setData({
				poiDetailPopupShow: false,
			});
		}, 300); // 动画时长与 CSS 定义一致
	},
	// 监听视野变化
	onChangeRegion(event) {
		console.log("onChangeRegion")
		// 关闭弹出框
		this.poiDetailDown();
		if (event.type === 'end' && event.causedBy === 'drag') {
			const mapCtx = wx.createMapContext('map', this);
			mapCtx.getCenterLocation({
				success: res => {
					const latitude = res.latitude;
					const longitude = res.longitude;
					console.log(latitude, longitude)
					// this.setData({
					// regionCallbackTxt: '中心点坐标：' + latitude.toFixed(6) + ',' + longitude.toFixed(6)
					// });
				}
			});
		}
	},
	moveViewToLocation: function () {
		this.reLocation(); // 重新获取位置
		console.log("moveViewToLocation", this.data.mapData)
		const mapCtx = wx.createMapContext('map', this);
		mapCtx.moveToLocation(this.data.mapData.latitude, this.data.mapData.longitude);
	},
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
					fillColor: '#00FF0033', // 半透明红色
					color: '#E6E6FA', // 圆圈边框颜色
					strokeWidth: 0 // 边框宽度
				}];
				this.setData({
					mapData: mapData,
				});
				// 可以在这里调用其他API，比如获取地址信息
				// this.getAddress(latitude, longitude);
			},
			fail: (err) => {
				console.error('获取位置失败', err);
			}
		});
	},
	drowPOIPng() {
		var canvasConfigs = [];
		for (let typeID in this.data.poiTypeStateMap) {
			let poiData = this.data.poiTypeStateMap[typeID].data;
			canvasConfigs.push({
				typeID: typeID,
				canvasId: '#icon-' + typeID,
				// canvasSetId: '#iconSet-'+typeID,
				//        shape:'circle',drop
        iconSrc: poiData.icon,
        fillStyle: poiData.icon_bg_color,
			})
		}
		console.log("ddd ", canvasConfigs)
		const imagePromises = canvasConfigs.map((config) =>
			darwAndsaveCanvasAsImage({
				canvasId: config.canvasId,
				shape: 'circle',
        iconSrc: config.iconSrc,
        fillStyle: config.fillStyle,
			}).then((tempPath) => {
				this.data.poiTypeStateMap[config.typeID].icon = tempPath;
			}).catch((err) => {
				console.error('图片生成失败:', err);
			})
		);
		// 批量处理图片生成
		Promise.all(imagePromises)
			.then(() => {
				console.log('所有图片生成成功:', this.data.poiTypeStateMap);
				this.poiListReRender();
			})
			.catch((err) => {
				console.error('图片生成失败:', err);
			});

		var canvasSetConfigs = [];
		for (let typeID in this.data.poiTypeStateMap) {
      let poiData = this.data.poiTypeStateMap[typeID].data;
			canvasSetConfigs.push({
				typeID: typeID,
				canvasId: '#iconSet-' + typeID,
        iconSrc: poiData.icon,
        fillStyle: poiData.icon_bg_color,
			})
		}
		const imagePromisesSet = canvasSetConfigs.map((config) =>
			darwAndsaveCanvasAsImage({
				canvasId: config.canvasId,
				shape: 'drop',
        iconSrc: config.iconSrc,
        fillStyle: config.fillStyle,
			}).then((tempPath) => {
				this.data.poiTypeStateMap[config.typeID].iconSet = tempPath;
			}).catch((err) => {
				console.error('图片生成失败:', err);
			})
		);
		// 批量处理图片生成
		Promise.all(imagePromisesSet)
			.then(() => {
				console.log('所有选择中图片生成成功:', this.data.poiTypeStateMap);
			})
			.catch((err) => {
				console.error('图片生成失败:', err);
			});
	},
	poiTypeListReload() {
		// 查询poi类型列表
		wx.request({
			url: app.globalData.baseUrl + '/poi_type_list',
			header: {
				Authorization: `Bearer ${token}`
			},
			dataType: 'json',
			data: {},
			success: (res) => {
				console.log("res.data", res.data);
				var listData = res.data.poi_type_list;
				for (let i = 0; i < listData.length; i++) {
					this.data.poiTypeStateMap[listData[i].id] = {
						select: true,
						data: listData[i],
					};
				}

				this.setData({
					poiTypeList: res.data.poi_type_list,
					poiTypeStateMap: this.data.poiTypeStateMap,
				});
				this.drowPOIPng();
				this.poiListReload();
			},
			fail: (err) => {
				console.error('list poi type failed:', err);
			}
		});
	},
	poiListReRender() {
		var markers = [];
		if (this.data.mapData.markers.length > 0 && this.data.mapData.markers[0].id == 1) {
			markers.push(this.data.mapData.markers[0]);
		}
		console.log("poiListReRender this.poiMap", this.data.poiMap);
		var ptsMap = this.data.poiTypeStateMap;
		var pMap = this.data.poiMap;
		for (let makerID in pMap) {
			let poi = pMap[makerID];
			let pts = ptsMap[poi.type_id];
			console.log("Debug", makerID, poi, pts);
			if (pts.select) {
				markers.push(new PoiMarker(parseInt(makerID, 10),
					poi.latitude, poi.longitude,
					poi.name, pts.icon));
			}
		}

		console.log(markers)
		this.data.mapData.markers = markers;
		this.setData({
			mapData: this.data.mapData,
		});
	},
	poiListReload() {
		// 查询附近的poi
		wx.request({
			url: app.globalData.baseUrl + '/poi_list',
			header: {
				Authorization: `Bearer ${token}`
			},
			dataType: 'json',
			data: {
				longitude: this.data.mapData.latitude,
				latitude: this.data.mapData.latitude
			},
			success: (res) => {
				console.log("res.data", res.data);
				let pl = res.data.poi_list;
				for (let i = 0; i < pl.length; i++) {
					// marker id = i+2
					this.data.poiMap[i + 2] = pl[i];
				}
				console.log("this.poiMap", this.data.poiMap)
				this.poiListReRender();
			},
			fail: (err) => {
				console.error('list poi failed:', err);
			}
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
		Toast('加载中');
		this.poiTypeListReload();

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
