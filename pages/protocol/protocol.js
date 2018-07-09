/**
 * 商品详情页js
 * @author Moon
 * 
 */
var WxParse = require('../../wxParse/wxParse.js');
var CONFIG = require('../../utils/config.js');
// var WxParse = require('../../../wxParse/wxParse.js');
var app = getApp();
var base_url = CONFIG.API_URL.BASE_URL;



Page({
  data: {
    base_url: base_url,
    current: 0,//记录当前tab的index
    hidden: true,//无评价时显示暂无评价,
    commentHidden: true,
    list: [],
    count: 1,//商品数量，默认为1
    firstIndex: -1,
    attrValueList: [],
    maskHidden: true,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取商品详情
    wx.request({
      url: base_url + 'index.php?c=wxApp&a=getProtocol',
      data: {},
      method: 'GET',
      success: function ( res ) {
        var data = res.data.data;
        console.log('res:', res);
        //富文本信息转化
        WxParse.wxParse('detail_desc', 'html', data.item_value, that, 0);
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function( ) {},

  /**
   * 生命周期函数--监听页面关闭
   */
  onUnload: function ( ) {},

  /**
   * 隐藏了
   */
  onHide: function () {},

})

