// pages/services/services.js
var itemList = require('../../common/itemList/itemList.js');
var CONFIG = require('../../utils/config.js');

var app = getApp();
var base_url = CONFIG.API_URL.BASE_URL;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    base_url: base_url,
    is_swiper: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取幻灯片信息
    wx.request({
      url: base_url + 'index.php?c=wxApp&a=serviceSlideList',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {

        var data = res.data.data;
        if(data.length == 0){
          that.setData({
            is_swiper: false
          })
        }
        that.setData({
          sliderList: data
        })
      }
    }),
      //获取服务信息
      wx.request({
      url: base_url + 'index.php?c=wxApp&a=getServicesList',
        data: {},
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function (res) {
          var data = res.data.data;
          that.setData({
            serviceList: data
          })
        }
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  /**
   * 点击查看详情
   */
  serviceImg: function (e) {
    var sid = e.currentTarget.dataset.sid;
    wx.navigateTo({
      url: '../serviceDetail/serviceDetail?id=' + sid,
    })
  },

  /**
  * 转发
  */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: 'Mu连锁便利店',
      path: '',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
  
})