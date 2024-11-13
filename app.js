// app.js
// const originalRequest = wx.request;

// wx.request = function (options) {
//   const app = getApp(); // 获取全局对象

//   if (app.globalData.enableMock) { // 判断是否启用mock
//     // 从URL解析出mock文件的名称
//     const url = options.url.split('/').pop(); // 假设URL为 /mockData/user
//     const mockFilePath = `/${url}.js`;
//     console.log(`Mock data loaded from ${mockFilePath}`);
//     try {
//       console.log(`Mock data loaded from [${mockFilePath}]`);
//       const mockData = require(`${mockFilePath}`);
//       setTimeout(() => {
//         options.success && options.success({ data: mockData });
//       }, 500); // 模拟网络延迟
//     } catch (error) {
//       console.error(`Mock data file not found: ${mockFilePath}`, error);
//       options.fail && options.fail({ errMsg: "mock file not found" });
//     }
//   } else {
//     // 如果未启用mock，调用原始wx.request方法
//     originalRequest(options);
//   }
// };
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    console.log("aaaasds")
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    enableMock: true, // 用于控制是否开启mock
    userInfo: null
  }
})
