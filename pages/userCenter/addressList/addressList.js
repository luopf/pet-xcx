var CONFIG = require('../../../utils/config.js');
var base_url = CONFIG.API_URL.BASE_URL;
var app = getApp();
var userInfo = wx.getStorageSync('userInfo');

var loadPage = function(that){
  wx.request({
    url: base_url + 'index.php?c=wxApp&a=addressList',
    data: { id: userInfo.id },
    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    success: function (res) {
      console.log('res.data:', res.data);
      that.setData({
        list: res.data
      });
    }
  })
};
Page({
  data: {},
  onLoad: function (options) {
    var that = this;
    loadPage(that);
  },
  onShow:function(){
    var that = this;
    loadPage(that);
  },
  changeRadio: function (e) {//点击单选按钮 改变默认地址
    var checkedId = e.currentTarget.dataset.id;
    console.log('e:', e);
    console.log('checkedId:', checkedId);
    var that = this;
    wx.request({
      url: base_url + 'index.php?c=wxApp&a=setDefaultAddress',
      data: {
        id: checkedId,
        user_id: userInfo.id
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        var list = that.data.list;
        console.log('list', that.data.list);
        for (var i = 0; i < list.length; i++){
          list[i].is_default = checkedId == list[i].id ? 1 : 0;
        }
        that.setData({ list: list });
      }
    })
  },
  eidtAddress: function (e) {//跳转到编辑地址页面
    wx.navigateTo({ url: '../addAddress/addAddress?id=' + e.target.dataset.id });
  },
  addAddress: function () {//跳转到添加地址页面
    wx.navigateTo({ url: '../addAddress/addAddress' });
  },
  deleteAddress: function (e) {//删除地址
    var id = e.target.dataset.id;
    var that = this;
    wx.request({
      url: base_url + 'index.php?c=wxApp&a=deleteAddress',
      data: { id: id, user_id: userInfo.id },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        var list = that.data.list;
        console.log(list);
        for (var i = 0; i < list.length; i++) {
          if (list[i].id == id) {
            list.splice(i, 1);
            break;
          }
        }
       that.setData({ list: list });
      }
    })
  }
})