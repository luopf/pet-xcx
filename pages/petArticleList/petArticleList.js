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
    cid: 0,
    sliderList:[],
    aticleList: [],
    inputContent:'',
    templateData: {
      lodingBall: 1
    },

  },
  //请求分页数据
  pagingData: function (cid, pageIndex, pageSize,keyWord = '') {
    var that = this;
    wx.request({
      url: base_url + 'index.php/front/petaticle/paggingAticle',
      data: {
        'cid': cid,
        'pageIndex': pageIndex,
        'pageSize': pageSize,
        'keyWord': keyWord
      },
      method: "POST",
      success: function (res) {
        var data = res.data.data;
        var dataList = data.dataList;
        var aticleList = that.data.aticleList;
        allPages = data.pageInfo.all_pages;
        console.log(data, 33);
        for (var i = 0; i < dataList.length; i++) {
          aticleList.push(dataList[i]);
        }
        that.setData({ aticleList: aticleList });
      }
    })
  },
  // 点击搜索
  searchPublish:function(){
    let that = this;
    let cid = that.data.cid;
    let keyWord = that.data.inputContent;
    that.setData({
      aticleList : []
    });
    that.pagingData(cid, pageIndex, pageSize, keyWord);


  },
  // 输入框事件
  inputContent: function (e) {
    var that = this;
    that.setData({
      inputContent: e.detail.value
    });

    
  },


  // 点击文章详情页
  ent_petAticle: function (e) {
    var aid = e.currentTarget.dataset.id;


    wx.navigateTo({

      url: '../petArticle/petArticle?aid=' + aid,
    })
  },
 
  // 点击进入分类列表页
  enter_cateList: function (e) {
    var cid = e.currentTarget.dataset.cid;
    
    wx.navigateTo({
      url: '../cateList/cateList?cid=' + cid,
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

  onLoad: function (options) {
    var that = this;
    var cid = options.cid;
    that.setData({
      cid:cid
    });
    that.pagingData(cid, pageIndex, pageSize);
    //获取幻灯片信息
    wx.request({
      url: base_url + 'index.php/front/Petaticle/getAllSlide',
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
