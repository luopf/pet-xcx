
var CONFIG = require('../../../utils/config.js');
//index.js
var app = getApp();
var base_url = CONFIG.API_URL.BASE_URL;
var userInfo = wx.getStorageSync('userInfo');
var page = 1;
var pageSize = 6;
var allPages = 0;

//请求数据
var pagingGoods = function (options, that) {
  wx.request({
    url: base_url + 'index.php?c=wxApp&a=pagingCoupon',
    data: {
      pageIndex: page,
      pageSize: pageSize,
      user_id: userInfo.id,
    },
    method: 'GET',
    success: function (res) {
      var data = res.data.data;
      console.log(res,'res');
      var dataList = data.dataList;
      var list = that.data.list;
      allPages = data.pageInfo.all_pages;
      for (var i = 0; i < dataList.length; i++) {
        if (dataList[i]['is_get'] == 0){
          dataList[i]['btn_text'] = "立即领取";
          dataList[i]['listener_text'] = 'getCoupon';
          dataList[i]['class_text'] = 'btn';
        } else if (dataList[i]['is_get'] == 1){
          dataList[i]['btn_text'] = "已领取";
          dataList[i]['listener_text'] = 'sendCoupon';
          dataList[i]['class_text'] = 'btn_text';
        }
      
        list.push(dataList[i])
      }
      that.setData({ list: list });
      // console.log( that.data.list )
      page++;
    }
  })
};

Page({
  data: {
    headerBgOpacity: 0,
    base_url: base_url,
    hidden: true,//输入框关闭按钮默认不显示
    list: []
  },

  onLoad: function (options) {
    var that = this;
    pagingGoods(options, that);

  },

  onUnload: function () {
    page = 1;
    pageSize = 6;
    allPages = 0;
    this.setData({
      list: [],
    })
  },
  /**
   * 触底加载
   */
  onReachBottom: function (options) {
    var that = this;
    if (page > allPages) {
      return false;
    } else {
      pagingGoods(options, that);
    }
  },

//领取优惠券
  getCoupon: function (e) {
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var that = this;
    var dataList = this.data.list;
    console.log(index);
    console.log(that);
    wx.request({
      url: base_url + 'index.php?c=wxApp&a=getCoupon',
      data: {
        'couponId': id,
        'user_id': userInfo.id,
        'nick_name': userInfo.nick_name
      },
      method: 'GET',
      success: function (res) {
        console.log(res);
        if (res.data.errorCode == 0) {
          dataList[index]['btn_text'] = "已领取";
          dataList[index]['listener_text'] = 'sendCoupon';
          dataList[index]['class_text'] = 'btn_text';
          that.setData({ list: dataList });
          console.log(that.data.list);
          wx.showToast({
            title: '领取成功',
            icon: 'success',
            duration: 2000
          });

        } else if (res.data.errorCode == 1) {
          wx.showToast({
            title: res.data.errorInfo,
            image: '../../../static/images/my/error_tip.png',
            duration: 1000
          })
        }
      }
    })
  },

 //已领过的优惠券
  sendCoupon: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.showToast({
      title: '该优惠券已领过啦',
      image: '../../../static/images/my/error_tip.png',
      duration: 1000
    })

  },


  //去使用
  goIndex: function () {
    wx.reLaunch({
      url: '../../index/index',
    });
  },
  //我的优惠卷
  myCoupon: function () {
	  wx.navigateBack({
		  delta: 1
	  })
//     wx.reLaunch({
//       url: '/pages/coupon/myCoupon/myCoupon?currentTab=99',
//     });
  },
})











  
 