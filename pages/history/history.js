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
    aid: 0,
    sliderInfo:'',
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
    var id = options.urlid;
    console.log(options);
  
    //获取slide详情
    wx.request({
      url: base_url + 'index.php/front/slide/getSlideInfo',
      data: {
        'id': id,
      },
      method: 'POST',
      success: function (res) {
        let data = res.data.data;
        that.setData({
          sliderInfo: data
        });
        console.log(data,"===========");
      }
    });





  },






 












})
