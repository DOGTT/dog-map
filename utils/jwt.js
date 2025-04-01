// jwtUtils.js
const JWTManager = {
  // 存储Token
  setToken: function(token) {
    wx.setStorageSync('jwt_token', token);
  },
  
  // 获取Token并验证有效性
  getValidToken: function() {
    const token = wx.getStorageSync('jwt_token');
    return this.isValid(token) ? token : null;
  },
  
  // 验证Token有效性
  isValid: function(token) {
    if (!token) return false;
    
    try {
      const payload = this._parsePayload(token);
      if (!payload || !payload.exp) return false;
      
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (e) {
      console.error('Token验证失败:', e);
      return false;
    }
  },
  
  // 解析Payload
  _parsePayload: function(token) {
    const payloadBase64 = token.split('.')[1];
    const payloadJson = wx.base64ToArrayBuffer(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
    const payloadString = String.fromCharCode.apply(null, new Uint8Array(payloadJson));
    return JSON.parse(payloadString);
  },
  
  // 清除Token
  clearToken: function() {
    wx.removeStorageSync('jwt_token');
  },
  
  // 获取剩余有效时间（秒）
  getRemainingTime: function(token) {
    if (!this.isValid(token)) return 0;
    
    const payload = this._parsePayload(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp - currentTime;
  }
};

module.exports = JWTManager;