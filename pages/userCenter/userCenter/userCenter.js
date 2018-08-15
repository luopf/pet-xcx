// pages/userCenter/userCenter.js
var app = getApp();
var CONFIG = require('../../../utils/config.js');
var tools = require('../../../utils/tools.js');
var wxLogin = require('../../../utils/wxLogin.js');
var base_url = CONFIG.API_URL.BASE_URL;
var userInfo = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
  userInfo:''
  },
  // 进入发布列表
  enter_messgeList:function(e){
    var status = e.currentTarget.dataset.status;
    wx.navigateTo({
      url: '../../messageList/messageList?status=' + status,
    })
  },

  enter_main:function(e){
    console.log("test");
    wx.navigateTo({
      url: '../../main/main',
    })
  },
// 进入收藏列表
  enter_favorite:function(e){
    let that = this;
   
  
    wx.navigateTo({
      url: '../../favorite/favorite',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo.id == 0 || userInfo.id == 1 || userInfo.id == null || userInfo.id == undefined) {
      wx.redirectTo({
        url: '../pages/index/index'
      })
    }
    that.setData({
      userInfo: userInfo
    }); 

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    let userInfo = that.data.userInfo;
    let user_id = userInfo.id;
    app.getUserNoReadNews(user_id, that);
    //设置底部导航信息：
    let nav_active = {
      center: 'active',
      circle: '',
     
    };
    that.setData({ nav_active: nav_active });
  },


 



})