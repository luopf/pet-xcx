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
    messageList: [],
    currentCity: '',
    templateData: {
      lodingBall: 1
    },
    inputContent: '',
  },
 
  onShow: function () {
    var that = this;
    //设置底部导航信息：
    let nav_active = {
      home: 'active',
      circle: '',
      center: ''
    };
    that.setData({ nav_active: nav_active });

  },
  
  onLoad: function (options) {
    var that = this;
   
    that.login();


  },
// 用户登录
  login:function(){

    wx.login({
      success: function (res) {
        var code = res.code;
        wx.request({
          url: base_url + 'index.php/front/Wxapp/wx_login',
          data: {
            js_code: code
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          success: function (res) {
            console.log(res, "+++++++++");
            var data = res.data;
            wx.setStorageSync('thirdRD_session', data);
          },
         
        })
        
      },
     
    })
    
  
 





  },
  


  


  onGotUserInfo: function (e) {
   
    this.authorize(false, into => {
    // 获取用户account

    console.log(into);
    var userData = JSON.parse(into.rawData);
    
   
      wx.getStorage({
        key: 'thirdRD_session',
        success: function(res) {
          var openid = res.data.data;
          userData.account = openid;
          
          wx.request({
            url: base_url + 'index.php/front/wxApp/testlogin',
            data: userData,
            method: 'POST', 
            header: {
              'content-type': 'application/json'
            }, // 设置请求的 header
            success: function (res) {

              console.log(res,"userInfo");
              wx.setStorage({
                key: 'userInfo',
                data: res.data,
              })
              wx.redirectTo({
                url: '../index/index',
              })
            }
          })

        },
      })


      // 打印用户信息
      var data = into.rawData;
      console.log(into,"========");
      wx.setStorage({
        key: 'userlogin',
        data: data,
      })


    })
  },



  /*
   * 授权获取用户信息
   * @withCredentials 是否带上登录态信息
   * @doSuccess 成功获取用户信息的回调
   */
  authorize: function (withCredentials, doSuccess) {
    let _pageCxt = this;
    // 通过 wx.getSetting 先查询一下用户是否授权了 "scope.userInfo" 这个 scope
    wx.getSetting({
      success: res => {
        // 先判断用户是否授权获取用户信息，如未授权，则会弹出授权框
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          _pageCxt.getUserInfo(withCredentials, doSuccess);
        } else {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              _pageCxt.getUserInfo(withCredentials, doSuccess);
            },
            fail() {
              wx.showToast({
                title: '授权获取信息失败',
                icon: 'loading',
                duration: 1500
              });
            }
          });
        }
      }
    });
  },



/**
 * 获取微信用户信息
 */
getUserInfo: function (withCredentials, doSuccess) {
    let _pageCxt = this;
    wx.getUserInfo({
      withCredentials: withCredentials,
      success: function (res) {
        _pageCxt.onSuccess(res, doSuccess);
      },
      fail: function () {
        wx.showToast({
          title: '获取用户信息失败',
          icon: 'loading',
          duration: 1200
        });
      }
    });
  },




/**
 * 获取信息成功的回调
 */
onSuccess: function (data, doSuccess) {
    if (typeof doSuccess == 'function') {
      doSuccess(data);
    }
  },






})
