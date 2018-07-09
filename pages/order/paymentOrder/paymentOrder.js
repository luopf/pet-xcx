// pages/order/paymentOrder/paymentOrder.js
var CONFIG = require('../../../utils/config.js');
var app = getApp();
var base_url = CONFIG.API_URL.BASE_URL;

Page({
  data: {base_url:base_url},
  onLoad: function (options) {
    var that = this;
     var oid = options.oid;
    // options.module = 'wxAppPay';
    // 页面初始化 options为页面跳转所带来的参数
    wx.request({
      // url: base_url + './pay/request/code.php?oid=',
      url:base_url+"index.php?c=wxApp&a=findOrder",
      data:{oid:oid},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
         console.log(res);
        var goodsList = res.data.data.goods_list;
        var address = res.data.data.address;
        var sum = res.data.data.total_price;
        var real_money = res.data.data.real_money;
        var add_time = res.data.data.add_time;
        var order_num = res.data.data.order_num;
        var fee = (parseFloat(res.data.data.fee)).toFixed(2);
        var min = res.data.data.min;
        var money = (parseFloat(sum)).toFixed(2);
        that.setData({
          goodsList:goodsList,
          sum:sum,
          real_money: real_money,
          min:min,
          oid:oid,
          fee: fee,
          address:address,
          add_time:add_time,
          order_num:order_num,
          money:money
        });
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  payOrder: function (event) {
    var that = this;
//     console.log(event);
    var oid = event.currentTarget.dataset.oid;
//      console.log(oid,'---->this is oid');
    wx.request({
      url: base_url + 'index.php?c=wxApp&a=isUpdownCanBuy',
      data: { oid: oid },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
      //    console.log(res,'是否可以支付');//是否可以支付
        if (res.data.errorCode == 0){
          wx.request({
            url: base_url+'pay/request/wxAppPay.php?oid='+oid,
            data: {oid:oid},
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res){
            //   console.log(res,'回调');
              // success
              wx.requestPayment({
                    'timeStamp': res.data.timeStamp,
                    'nonceStr': res.data.nonceStr,
                    'package': res.data.package,
                    'signType': 'MD5',
                    'paySign': res.data.paySign,
                    'success':function(res){
                        console.log('success');
                        wx.showToast({
                            title: '支付成功',
                            icon: 'success',
                            duration: 3000
                        });
                        wx.redirectTo({ url: '/pages/userCenter/orderList/orderList'});
                    },
                    'fail':function(res){
                        // console.log(res);
                    },
                    'complete':function(res){
                        // console.log(res);
                    }
                });
              
            },
            fail: function(res) {
              // fail
            //   console.log(res);
            },
            complete: function(res) {
              // complete
            }
          })
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.errorInfo,
            showCancel: false,
            confirmText: '知道了',
          })
        }
      }
    })
   
  },

//货到付款
  daofu:function(e){
    var that = this;
//     console.log(e);
    var oid = e.currentTarget.dataset.oid;
    wx.request({
      url: base_url + 'index.php?c=wxApp&a=isUpdownCanBuy',
      data: { oid: oid },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
      //   console.log(res, '是否可以支付');//是否可以支付
        if (res.data.errorCode == 0) {
          wx.request({
            url: base_url + 'index.php?c=wxApp&a=inCash',
            data: { oid: oid },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function (res) {
              wx.showToast({
                title: '支付成功',
                icon: 'success',
                duration: 3000
              });
              wx.navigateTo({ url: '../../userCenter/orderList/orderList?currentTab=1'});
            }
            
          })
        }
      }
    });
  },

  /**
  * 转发
  */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
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