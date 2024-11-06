// pages/map/map.js

var i = 1;
Page({
  data: {
    show: false,
    popupStyle: "height: 30%;",
    detailHidden:true,
    poiInfo: "",
    setting: { // 使用setting配置，方便统一还原
      rotate: 0,
      skew: 0,
      enableRotate: true,
    },
    latitude: null,
    longitude: null,
    address: '',
    scale: 14,
    circles: [],
    markers:[{
      id:1,
      title: "测试点",
      latitude: 22.55329,
      longitude:113.90308,
      iconPath:"/static/png/marker/Marker3_Activated@3x.png",
      width:"38px",
      height:"38px",
      callout: {
        content:"测试C",
        display:"ALWAYS",
        padding: 10,
        borderRadius: 2
      }
    }]
  },
  onLoad: function () {
    this.getLocation();
  },
	// 点击地图事件
	onTapMap (event) {
		const latitude = event.detail.latitude;
    const longitude = event.detail.longitude;
    var markers = this.data.markers[0];
    markers.latitude = latitude;
    markers.longitude = longitude;
		this.setData({
      // mapCallbackTxt: latitude.toFixed(6) + ',' + longitude.toFixed(6),
      
			markers: [markers]
		});
  },
  onLabelTap (event) {
    console.log("tap")
  },
  onCalloutTap (event) {
    console.log("tap callout")
    this.setData({
      show: true
    });
  },
  popFullsize() {
    console.log("popFullsize")
    this.setData({
      popupStyle:"height: 80%;"
    })
  },
  onClose() {
    this.setData({
      show: false,
      popupStyle: "height: 30%;"
    });
  },
	// 标注点击回调
	onTapMarker (event) {
    const marker = this.data.markers[0];
    const mapCtx = wx.createMapContext('map', this);
    mapCtx.moveToLocation({
      latitude: marker.latitude,
      longitude: marker.longitude,
      success: () => {
        this.setData({
          latitude: marker.latitude,
          longitude: marker.longitude,
        });
      },
      fail: () => {
      }
    });

    this.setData({
      latitude: marker.latitude,
      longitude: marker.longitude
    })
		// if (!PLUGIN_KEY) {
		// 	console.error('请传入有效的key');
		// 	return;
		// }
		// const markers = this.data.markers;
		// for (let i = 0; i < markers.length; i++) { // 本示例只有一个marker，可用于处理单marker和多marker情况
		// 	if (event.markerId === markers[i].id) {
		// 		qqmapsdk.reverseGeocoder({ // 调用逆地址解析
		// 			location: {
		// 				latitude: markers[i].latitude,
		// 				longitude: markers[i].longitude
		// 			},
		// 			success: res => {
		// 				if (res.result && res.result.formatted_addresses) { // 避免名称无数据处理
		// 					this.setData({
		// 						markerCallbackTxt: res.result.formatted_addresses.recommend
		// 					});
		// 				} else {
		// 					this.setData({
		// 						markerCallbackTxt: res.result.address
		// 					});
		// 				}
		// 			}
		// 		});
		// 	}
		// }
	},

	// poi点击回调
	onTapPoi (event) {
		const name = event.detail.name.length <= 8 ? event.detail.name : event.detail.name.substring(0, 8)+'...';
		const latitude = event.detail.latitude;
    const longitude = event.detail.longitude;
    console.log("tap poi")
    this.setData({
      detailHidden:false,
      poiInfo:name + '：' + latitude.toFixed(6) + ',' + longitude.toFixed(6),
    })
		// this.setData({
			// poiCallbackTxt: name + '：' + latitude.toFixed(6) + ',' + longitude.toFixed(6)
		// });
	},

	// 监听视野变化
	onChangeRegion (event) {
		if (event.type === 'end' && event.causedBy === 'drag') {
			const mapCtx = wx.createMapContext('map', this);
			mapCtx.getCenterLocation({
				success: res => {
					const latitude = res.latitude;
          const longitude = res.longitude;
          console.log(latitude,longitude)
					// this.setData({
						// regionCallbackTxt: '中心点坐标：' + latitude.toFixed(6) + ',' + longitude.toFixed(6)
					// });
				}
			});
		}
  },
  reLocation: function () {
    console.log("reLocation")
    this.getLocation(); // 重新获取位置
    const mapCtx = wx.createMapContext('map', this);
    mapCtx.moveToLocation(this.latitude, this.longitude);
  },
  getLocation: function () {
    // 获取用户的位置信息
    wx.getLocation({
      type: 'wgs84', // 返回可以用于 wx.openLocation 的经纬度
      success: (res) => {
        // i++
        const latitude = res.latitude; // 纬度
        const longitude = res.longitude; // 经度
        console.log("reLocation", latitude, longitude)
        this.setData({
          setting: {
            rotate: 0,
            skew: 0,
            enableRotate: true
          },
          latitude: latitude,
          longitude: longitude,
          circles: [
            {
              latitude: latitude,
              longitude: longitude,
              radius: 1000, // 圆圈半径，单位米
              fillColor: '#00FF0033', // 半透明红色
              color: '#E6E6FA', // 圆圈边框颜色
              strokeWidth: 0 // 边框宽度
            }
          ]
        });
        // 可以在这里调用其他API，比如获取地址信息
        this.getAddress(latitude, longitude);
      },
      fail: (err) => {
        console.error('获取位置失败', err);
      }
    });
  },

  getAddress: function (latitude, longitude) {
    // 这里可以调用其他API来获取地址信息，比如腾讯地图API等
    // 示例代码略
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