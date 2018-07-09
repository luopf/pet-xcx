/**
 * 商品详情页js
 * @author micheal
 * @since 2017-01-23
 */
var CONFIG = require('../../../utils/config.js');
var app = getApp();
var base_url = CONFIG.API_URL.BASE_URL;

Page({
  data: {
    base_url: base_url,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var id = options.id;//订单id

    //获取商品信息
    wx.request({
      url: base_url + 'index.php?c=wxApp&a=findOrder',
      data: { "id": id },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (result) {
        var orderInfo = result.data.data;
        that.setData({ orderInfo: orderInfo});
      }
    })
  }
})