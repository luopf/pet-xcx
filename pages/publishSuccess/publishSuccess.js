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
   
      // Fun.CurlPaging(that,base_url+'index.php?c=wxApp&a=pagingLabel', cData, false);
     
      // 分页展示
      


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

  



  






  




})
