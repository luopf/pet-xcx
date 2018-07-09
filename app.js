//app.js
var CONFIG = require('utils/config.js');
var base_url = CONFIG.API_URL.BASE_URL;
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },



  

});