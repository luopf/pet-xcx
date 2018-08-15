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
  // 获取用户所有未读消息
  getUserNoReadNews:function(user_id, that){
    // 查找当前用户的所有未读消息并用数字的方式显示提醒
    let newCount = 0;
    wx.request({
      url: base_url + 'index.php/front/News/getCountForUserNoRead',
      data: {
        'user_id': user_id,
      },
      method: "POST",
      success: function (res) {

        newCount = res.data.data;
       let nav_active = {
         newsCount: newCount
        };
        that.setData({
          nav_active: nav_active
        });
      }
    })
  
  }


  

});