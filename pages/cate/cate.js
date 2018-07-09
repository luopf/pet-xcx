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
  //定位
  getLocation: function () {
    var page = this;
    wx.getLocation({
      type: 'wgs84',   //<span class="comment" style="margin:0px;padding:0px;border:none;">默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标</span><span style="margin:0px;padding:0px;border:none;"> </span>  
      success: function (res) {
        // success    
        var longitude = res.longitude;
        var latitude = res.latitude;
        page.loadCity(longitude, latitude);
      }
    })
  },
  inputContent: function (e) {
    var that = this;
    that.setData({
      inputContent: e.detail.value
    });

  },
  //enter_petDoctor进入宠物医生
  enter_petDoctor: function () {
    var that = this;
    wx.navigateTo({
      url: '../petDoctor/petDoctor',
    })
  },
  //经纬度转换城市
  loadCity: function (longitude, latitude) {
    var that = this;
    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/?ak=Ww4RAMZzxP83c38UdkEuH9gwmdik6b7d&location=' + latitude + ',' + longitude + '&output=json',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // success    

        var city = res.data.result.addressComponent.city;
        that.setData({ currentCity: city });

      },
      fail: function () {
        console.log(error);
        that.setData({ currentCity: "获取定位失败" });
      },

    })
  },
  //请求分页数据
  pagingData: function (city, pageIndex, pageSize, content = null) {
    var that = this;
    wx.request({
      url: base_url + 'index.php/front/message/paggingMessage',
      data: {
        'city': city,
        'pageIndex': pageIndex,
        'pageSize': pageSize,
        'content': content,
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
  //点击拨打电话
  call_user: function (e) {
    var phone_num = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone_num //仅为示例，并非真实的电话号码
    })
  },
  // 点击进入发布消息详情页
  messageDetail: function (e) {
    var mid = e.currentTarget.dataset.mid;
    console.log(mid);

    wx.navigateTo({
      url: '../goods/goodsDetail/goodsDetail?mid=' + mid,
    })
  },
  searchPublish: function () {
    var that = this;
    that.setData({
      messageList: []
    });
    that.pagingData(that.data.currentCity, pageIndex, pageSize, that.data.inputContent);
  },

  // 客服按钮点击事件
  call_kefu: function () {
    console.log("联系客服");
  },
  // 点击进入分类列表页
  enter_cateList: function (e) {
    var cid = e.currentTarget.dataset.cid;
    console.log(cid);
    wx.navigateTo({
      url: '../cateList/cateList?cid=' + cid,
    })
  },

  onShow: function () {
    var that = this;
    //设置底部导航信息：
    let nav_active = {
      cate: 'active',
      circle: '',
      center: ''
    };
    that.setData({ nav_active: nav_active });

    //调用定位方法
    that.getLocation();



  },
  // 点击进入宠物百科页面
  enter_petarticleList: function (e) {
    var cid = e.currentTarget.dataset.cid;
    console.log(cid);
    wx.navigateTo({
      url: '../petArticleHome/petArticleHome?cid=' + cid,
    })
  },
  onLoad: function (options) {
    var that = this;
    //获取幻灯片信息
    wx.request({
      url: base_url + 'index.php/front/slide/getAllSlide',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        var data = res.data.data;

        that.setData({
          sliderList: data,
          imgWidth: wx.getSystemInfoSync().windowWidth
        })
      }
    }),
      // Fun.CurlPaging(that,base_url+'index.php?c=wxApp&a=pagingLabel', cData, false);
      //获取所有分类
      wx.request({
      url: base_url + 'index.php/front/label/findAllLables',
        data: {},
        method: 'GET',
        success: function (res) {
          let data = res.data.data;

          that.setData({ cateList: data, hidden: false });
        }
      }),
      // 分页展示
      that.pagingData(that.data.currentCity, 1, pageSize);


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
    // //2. 版权信息设置
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
      that.pagingData(city, pageIndex, pageSize);
    }

  },

  /**
   * 跳转到商品列表页面
   */
  pagingCateGoods: function (e) {
    var that = this;
    var cid = e.currentTarget.dataset.cid;
    var cname = e.currentTarget.dataset.cname;
    // console.log(cid )
    wx.navigateTo({
      url: '/pages/goods/goodsList/goodsList?cid=' + cid + '&pageTitle=' + cname,
    })
  },




})
