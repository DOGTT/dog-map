
// 将参数对象转换为 URL 查询字符串
const buildUrlWithParams = (baseUrl, params) => {
  const queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
  // 返回完整的 URL
  return `${baseUrl}?${queryString}`;
}

const uploadMedia = (app, filePathList, media_type) => {
  return new Promise((resolve, reject) => {
      const baseUrl = app.globalData.baseUrl + '/media/put_presign_url/batch';
      const count = filePathList.length;
      const url = buildUrlWithParams(baseUrl, {
          media_type: media_type,
          count: count
      });
      const token = wx.getStorageSync('token');

      wx.request({
          url: url,
          method: 'GET',
          header: {
              WeixinRequestCode: app.globalData.wxCode,
              Authorization: `Bearer ${token}`
          },
          success: (res) => {
              if (res.statusCode !== 200) {
                  reject(new Error('获取预签名URL失败'));
              }
              resolve(res);
              // s3 put 方法 上传filepath
              const mediaList = res.data.media;
              const uploadPromises = [];

              for (let i = 0; i < filePathList.length; i++) {
                  const uploadPromise = new Promise((resolve, reject) => {
                      wx.uploadFile({
                          url: mediaList[i].put_url,
                          filePath: filePathList[i],
                          name: 'file',
                          success: (res) => {
                              if (res.statusCode === 200) {
                                  resolve(mediaList[i]);
                              } else {
                                  reject(new Error('上传失败'));
                              }
                          },
                          fail: (err) => {
                              reject(err);
                          }
                      });
                  });
                  uploadPromises.push(uploadPromise);
              }

              Promise.all(uploadPromises)
                  .then(results => {
                      resolve(results);
                  })
                  .catch(err => {
                      reject(err);
                  });

          },
          fail: (err) => {
              reject(err);
          }
      })
  });
}


const sendRequest = (app, urlPath, method, data) => {
  return new Promise((resolve, reject) => {
      const token = wx.getStorageSync('token');
      console.debug('sendRequest:',app.globalData,urlPath,method,data);
      let url = app.globalData.baseUrl + urlPath
      if (method=='GET') {
        url = buildUrlWithParams(url, data);
      }
      wx.request({
          url: url,
          method: method,
          header: {
              WeixinRequestCode: app.globalData.wxCode,
              Authorization: `Bearer ${token}`
          },
          data: data,
          success: (res) => {
              if (res.statusCode !== 200) {
                  reject(new Error('请求失败,状态码错误'));
              }
              resolve(res);
          },
          fail: (err) => {
              reject(err);
          }
      });
  });
}

const sendRequestNoAuth = (app, urlPath, method, data) => {
  return new Promise((resolve, reject) => {
      wx.request({
          url: app.globalData.baseUrl + urlPath,
          method: method,
          header: {
              WeixinRequestCode: app.globalData.wxCode,
          },
          data: data,
          success: (res) => {
              if (res.statusCode !== 200) {
                  console.error('request fail',res)
                  reject(new Error('请求失败,状态码错误'));
              }
              resolve(res);
          },
          fail: (err) => {
              reject(err);
          }
      });
  });
}

export { uploadMedia, sendRequest, sendRequestNoAuth, buildUrlWithParams };

