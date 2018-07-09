//index.js
var CONFIG = require('../../../utils/config.js');
var Fun = require('../../../utils/common.js');
var app = getApp();
var base_url = CONFIG.API_URL.BASE_URL;
var userInfo = '';
var cid = 0;//分类id
var page = 1;
var pageSize = 6;
var allPages = 0;
var style = 0;//价格排序  由高到低 由低到高
var sortType = '';
var keywords = '';//关键词搜索
var base_args='index.php?c=wxApp&a=pagingCatGoods';

Page({
  data: {
    headerBgOpacity: 0,
    base_url: base_url,
    hidden: true,//输入框关闭按钮默认不显示
    list: [],
    open:false, //侧边栏是否展示
    templateData:{ loadingBall:1 } //加载中
  },

  onLoad: function (options) {
    var that = this;
    userInfo = wx.getStorageSync('userInfo');
    let pageTitle = options.pageTitle || '商品搜索';
    wx.setNavigationBarTitle({title: pageTitle}); //设置导航标题
    cid = options.cid ? options.cid : 0;


    //获取页面公共数据
    Fun.getAppElastic(that,base_url,that.commonSet);
  },

  //测试方法：回调
  commonSet: function(elasticInfo){
    var that = this;
    //1. 设置页头
    wx.setNavigationBarTitle({
      title: elasticInfo.pageTitle,
      success: function(res) {
        // success
      }
    })
    //2. 版权信息设置
    that.setData({
      copyrightInfo: elasticInfo.copyright
    });
  },

  onShow: function(e){
    var that = this;
    let cData = {
      cid: cid,
      sortType: sortType,
      keywords: keywords
    }
    
    let url = base_url + 'index.php?c=wxApp&a=pagingCatGoods';
    Fun.CurlPaging(that, url, cData, false,);
    //获取价格区间
    wx.request({
      url: base_url + 'index.php?c=wxApp&a=getPriceKey',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        console.log('价格区间', res.data.data);
        that.setData({'priceList':res.data.data});
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },



  /**
   * 监听input输入
   */
  listenInput: function ( e ) {
    let that = this;
    if( e.detail.value.length > 0 ) {
      //有输入值时显示显示按钮
      that.setData({ hidden: false, keywords: e.detail.value });
    } else if ( e.detail.value.length == 0 ) {
      //清除输入值时关闭按钮
      that.setData({ hidden: true });
    }
  },

  /**
   * 清除input值
   */
  clearInput: function( options ) {
    this.setData({
      keywords: '',
      hidden: true
    });
  },

  /**
   * 触底加载
   */
  onReachBottom: function ( options ) {
    var that = this;
    let _cData = {
      cid: cid,
      sortType: sortType
    };
    let cData = Fun.getSelection(that,['active_key', 'keywords'],_cData);
    Fun.CurlReachBottom(that, cData)
  },

  /**
   * 点击切换排序
   */
  changeNav: function( e,options ) {
    var that = this;
    var cur = e.currentTarget.dataset.index;
    // console.log( cur )
    //设置页面显示样式 分页数据初始化
    that.setData({ cur: cur,list: [] });
    page = 1;

    //获取排序方式
    sortType = e.currentTarget.dataset.val;
    //查询条件
    let cData = {
      cid: cid,
      sortType: sortType,
    };

    //设置排序方式 重新加载页面数据
    if( cur == 2 ) {
        //设置价格箭头样式
        if (style == 1) {
          style = 2;
          that.setData({ on: 1 });
        } else if (style = 2){
          style = 1;
          that.setData({ on: 2 });
        }
        //价格升序降序排列
        if (style == 2 ){
          sortType = sortType + ' asc';
          cData.sortType = sortType;
        } else if (style == 1) {
          sortType = sortType + ' desc';
          cData.sortType = sortType;
        }
    }else {
        that.setData({ on: 0 });
        sortType = sortType + ' desc';
        cData.sortType = sortType;
    }
    let active_key = that.data.active_key;
    if(active_key != undefined){
      cData.active_key = active_key
    }
    
    let url = base_url + base_args;
    let _cData = Fun.getSelection(that,['active_key', 'keywords'],cData);
    // console.log('组合的结果',_cData);
    Fun.CurlPaging(that,url,_cData,false)
  },

  /**
   * 搜索跳转
   */
  search: function ( e, options ) {
    var that = this;
    //keywords = that.data.keywords;
    let _cData = {
      cid: cid,
      sortType:sortType
    }
    let cData = Fun.getSelection(that,['active_key', 'keywords'],_cData);
    console.log('组合的结果',cData);
    Fun.CurlPaging(that, base_url+base_args, cData,false);
  },

  /**
   * 跳转商品详情
   */
  goodsDetail: function ( e ) {
    var that = this;
    var gid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../goodsDetail/goodsDetail?gid=' + gid,
    })
  },

  tap_ch: function(e){
    var that = this;
    let open = e.currentTarget.dataset.open;
    (open === true) ? (open = false) : (open = true);
    that.setData({open:open});
    console.log('打开还是关闭:', open);
    
  },
  
  /**
   * 切换状态:筛选区域
   */
  changeActive: function(e){
    var that = this;
    let key = e.currentTarget.dataset.key;
    
    let price_cur = that.data.active_key; //取出当前的：价格区间
    if(price_cur == key){ //取消激活状态
        that.setData({active_key:null});
    }else{  //激活当前按钮
      that.setData({active_key:key});
      
    }
    console.log('当前激活状态', that.data.active_key);
  },

  /**
   * 生命周期函数--监听页面关闭
   */
  onUnload: function () {
    //初始化参数
    this.setData({ list: [] });
    page = 1;
  },

  /**
   * 确定筛选
   */
  confirm: function(){
    var that = this;
    let url = base_url + 'index.php?c=wxApp&a=pagingCatGoods';
    //取出筛选条件，判断是否需要筛选查询
    let active_key = that.data.active_key;
    let cData = {
      cid:cid,
      sortType: sortType,
    }
    if(active_key != undefined){
      cData.active_key = active_key
    }
    let _cData = Fun.getSelection(that, ['keywords'], cData);
    Fun.CurlPaging(that,url,_cData,false);
    that.setData({open:false})
  }

})
