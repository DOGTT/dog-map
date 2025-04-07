const JWTManager = require('jwt.js')


// 将参数对象转换为 URL 查询字符串
const buildUrlWithParams = (baseUrl, params) => {
	const queryString = Object.keys(params)
		.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
		.join('&')
	// 返回完整的 URL
	return `${baseUrl}?${queryString}`
}

const MediaType = {
  User: 1,
  Channel: 2,
  PostImg: 3,
}

const uploadMedia = (app, filePathList, media_type) => {
	return new Promise((resolve, reject) => {
		const baseUrl = app.globalData.baseUrl + '/media/put_url/batch'
		const count = filePathList.length
		const url = buildUrlWithParams(baseUrl, {
			media_type: media_type,
			count: count
		})
		const token = JWTManager.getValidToken()
		wx.request({
			url: url,
			method: 'GET',
			header: {
				WeixinRequestCode: app.globalData.wxCode,
				Authorization: `Bearer ${token}`
			},
			success: (res) => {
				if (res.statusCode !== 200) {
					reject(new Error('获取预签名URL失败'))
				}
				resolve(res)
				// s3 put 方法 上传filepath
				const mediaList = res.data.media
				const uploadPromises = []
				for (let i = 0; i < filePathList.length; i++) {
					const uploadPromise = new Promise((resolve, reject) => {
						console.log('uploading', filePathList[i], 'to')
						// 1. 获取文件的 ArrayBuffer
						wx.getFileSystemManager().readFile({
							filePath: filePathList[i],
							encoding: '', 
							success: (res) => {
								wx.request({
									url: mediaList[i].put_url,
									method: 'PUT',
									header: {
										'Content-Type': 'image/jpeg', // 必须与生成 URL 时的 ContentType 一致
									},
									data: res.data,
									success: (res) => {
										console.log('upload res', res)
										if (res.statusCode === 200) {
											resolve(mediaList[i])
										} else {
											reject(new Error('上传失败'))
										}
									},
									fail: (err) => {
										console.log('upload err', err)
										reject(err)
									}
								})
							},
							fail: (err) => {
								console.log('upload err, load file fail', err)
								reject(err)
							},
						})
					})
					uploadPromises.push(uploadPromise)
				}

				Promise.all(uploadPromises)
					.then(results => {
						resolve(results)
					})
					.catch(err => {
						reject(err)
					})

			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}


const sendRequest = (app, urlPath, method, data) => {
	return new Promise((resolve, reject) => {
		console.log('sendRequest:', app.globalData, urlPath, method, data)
		let url = app.globalData.baseUrl + urlPath
		if (method == 'GET') {
			url = buildUrlWithParams(url, data)
    }
    let headerData = {
      WeixinRequestCode: app.globalData.wxCode,
    }
    const token = JWTManager.getValidToken()
    if (token != null ) {
      headerData.Authorization =  `Bearer ${token}`
    }
		wx.request({
			url: url,
			method: method,
			header: headerData,
			data: data,
			success: (res) => {
				if (res.statusCode !== 200) {
          console.error('stautscode error',res)
					reject(res)
				}
				resolve(res)
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}


export {
  MediaType,
	uploadMedia,
	sendRequest,
	buildUrlWithParams
}
