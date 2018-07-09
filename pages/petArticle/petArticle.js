var CONFIG = require('../../utils/config.js');
var Fun = require('../../utils/common.js');
var WxParse = require('../../wxParse/wxParse.js');
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
    aid:0,
    aticleContent: '',
    templateData: {
      lodingBall: 1
    },

  },
 
  onShow: function () {
    var that = this;
   



  },

  onLoad: function (options) {
    var that = this;
    var aid = options.aid;
    that.setData({
      aid:aid
    });
    //获取文章详情
    wx.request({
      url: base_url + 'index.php/front/petaticle/findAticle',
      data: { 'aid': aid },
      method: 'GET',
      success: function (res) {
        let data = res.data.data;
        let content = data.content;
        that.setData({ aticleInfo: data, aticleContent: content });
        var temp = WxParse.wxParse('aticleContent', 'html', that.data.aticleContent, that, 5) || '';
        
       
      }
    });
   


   

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
   * 专题详情页面
   */
  labelDetail: function (e) {
    var that = this;
    let lid = e.currentTarget.dataset.id;
    let pageTitle = e.currentTarget.dataset.pageTitle;
    if (lid) {
      wx.navigateTo({
        url: '/pages/labelDetail/labelDetail?lid=' + lid + '&pageTitle=' + pageTitle,
      })
    }

  },












})
