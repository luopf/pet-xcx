var CONFIG = require('../../utils/config.js');
var Fun = require('../../utils/common.js')
//index.js
var app = getApp();
var base_url = CONFIG.API_URL.BASE_URL;
var img_url = CONFIG.API_URL.IMG_URL;
var elasticInfo = {};
var pageIndex = 1;
var pageSize = 10;
var allPages = 0;


Page({
  data: {
    headerBgOpacity: 0,
    home: "active",
    base_url: base_url,
    img_url: img_url,
    hidden: true,
    status:0,
    messageList: [],
    currentCity: '',
    templateData: {
      lodingBall: 1
    },
    inputContent: '',
    userInfo:'',
    statustext:'审核中',

  },

  //点击拨打电话
  call_user: function (e) {
    var phone_num = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone_num //仅为示例，并非真实的电话号码
    })
  },


  //请求分页数据
  pagingData: function (user_id,status, pageIndex, pageSize) {
    var that = this;
    status = parseInt(status);
    wx.request({
      url: base_url + 'index.php/front/message/paggingMessage',
      data: {
        'user_id': user_id,
        'status': status,
        'pageIndex': pageIndex,
        'pageSize': pageSize,
      },
      method: "POST",
      success: function (res) {
        var data = res.data.data;
        var dataList = data.dataList;
        var messageList = that.data.messageList;
        allPages = data.pageInfo.all_pages;
        for (var i = 0; i < dataList.length; i++) {
          messageList.push(dataList[i]);
        }
        that.setData({ messageList: messageList });
      }
    })
  },

  // 点击进入发布消息详情页
  messageDetail: function (e) {
    var mid = e.currentTarget.dataset.mid;
    wx.navigateTo({
      url: '../goods/goodsDetail/goodsDetail?mid=' + mid,
    })
  },




  onShow: function (options) {
    var that = this;
    
    //设置底部导航信息：
    let nav_active = {
      message: 'active',
      circle: '',
      center: ''
    };
    that.setData({ nav_active: nav_active });
    




  },

  onLoad: function (options) {
    var that = this;
    var status = options.status;
    var userInfo = wx.getStorageSync("userInfo");
    var user_id = userInfo.id;
    that.setData({
      status: status,
    });
    that.pagingData(user_id, status, pageIndex, pageSize);
    that.setData({
    userInfo: userInfo
    });


    //获取页面公共数据
    Fun.getAppElastic(that, base_url, that.commonSet);


  },

  //测试方法：回调
  commonSet: function (elasticInfo) {
    var that = this;
    //1. 设置页头
    // wx.setNavigationBarTitle({
    //   title: elasticInfo.pageTitle,
    //   success: function(res) {
    //     // success
    //   }
    // })
    //2. 版权信息设置
    // that.setData({
    //   copyrightInfo: elasticInfo.copyright
    // });
  },

  login: function () {
    if (wx.getStorageSync('thirdRD_session')) return;
    //获取用户信息
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code;
        wx.request({
          url: base_url + 'index.php?c=wxApp&a=wx_login',
          data: {
            js_code: code
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          success: function (res) {

            var data = res.data;
            console.log(data);
            wx.setStorageSync('thirdRD_session', data);
            wx.getUserInfo({
              success: function (res) {
                // success
                var encryptedData = res.encryptedData;
                var iv = res.iv;  //加密算法的初始向量
                var thridRDSession = wx.getStorageSync('thirdRD_session');

                wx.request({
                  url: base_url + 'index.php?c=wxApp&a=decryptUserInfo&thridRDSession=' + thridRDSession + "&encryptedData=" + encryptedData + "&iv=" + iv,
                  data: {
                    thridRDSession: thridRDSession,
                    encryptedData: encryptedData,
                    iv: iv
                  },
                  method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                  header: {
                    'content-type': 'application/json'
                  }, // 设置请求的 header
                  success: function (res) {

                    if (userInfo != "" || userInfo != null) {
                      var ws = res.data;
                      var json = ws.replace(/^[\s\uFEFF\xa0\u3000]+|[\uFEFF\xa0\u3000\s]+$/g, "");

                      var userInfo = JSON.parse(json);

                      wx.setStorage({
                        key: "userInfo",
                        data: userInfo
                      });
                      that.getCartGoodsCount();
                    }

                    // success
                  },
                  fail: function () {
                    // fail
                  },
                  complete: function () {
                    // complete
                  }
                })

              },
              fail: function () {
                // fail
              },
              complete: function () {
                // complete
              }
            })
            // success
          },
          fail: function () {
            // fail
          },
          complete: function () {
            // complete
          }
        })
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },











  /**
   * 下拉加载更多标签
   */
  onReachBottom: function () {
    var that = this;
    var status = that.data.status;
    var user_id = that.data.userInfo.id;
    if (pageIndex + 1 > allPages) {
      return false;
    } else {
      pageIndex++;
      that.pagingData(user_id, status, pageIndex, pageSize);
    }

  },

})
