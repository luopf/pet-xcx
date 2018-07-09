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
    hederindex:1,
    userInfo:'',
  },
  //请求分页数据
  pagingData: function (user_id,type_id, pageIndex, pageSize) {
    var that = this;
    wx.request({
      url: base_url + 'index.php/front/news/pagingNews',
      data: {
        'user_id': user_id,
        'pageIndex': pageIndex,
        'pageSize': pageSize,
        'type_id': type_id,
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
        console.log(messageList,"===============");
        that.setData({ messageList: messageList });
      }
    })
  },
  // 切换导航栏
  exchange_headerindex:function(e){
    let that = this;
    
    let index = e.currentTarget.dataset.index;
    that.setData({
      hederindex : index,
      messageList:[],
    });
    let user_id = that.data.userInfo.id;
    that.pagingData(user_id, index, pageIndex, pageSize);
  },
  

 

 
  

 

  onShow: function () {
    var that = this;
    //设置底部导航信息：
    let nav_active = {
      message: 'active',
      circle: '',
      center: ''
    };
    that.setData({ nav_active: nav_active });
    let user_id = that.data.userInfo.id;
    let type_id = that.data.hederindex;
    that.pagingData(user_id, type_id, pageIndex, pageSize);
  
  },
  
  onLoad: function (options) {
    var that = this;
    let userInfo = wx.getStorageSync('userInfo');
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
	 * 转发
	*/
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: elasticInfo.share.title,
      path: elasticInfo.share.path,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
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






  /**
   * 下拉加载更多标签
   */
  onReachBottom: function () {
    var that = this;
    var city = that.data.currentCity;

    if (pageIndex + 1 > allPages) {
      return false;
    } else {
      pageIndex++;
      that.pagingData(user_id, pageIndex, pageSize);
    }

  },

 



})
