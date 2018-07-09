// pages/goods/goodsSearch/goodsSearch.js
var CONFIG = require('../../../utils/config.js');
var app = getApp();
var base_url = CONFIG.API_URL.BASE_URL;
var page = 1;
var pageSize = 8;
var currPage = 0;
var keyWord = '';//搜索关键字

var userInfo = '';
userInfo = wx.getStorageSync('userInfo');

var loadMore = function (that, options,info){
  wx.showLoading({
    title: '加载中',
  }),

  wx.request({
    url: base_url + 'index.php?c=wxApp&a=pagingSearchGoods',
    data: {
      account: userInfo.account,
      pageIndex: page,
      pageSize: pageSize,
      keyword: that.data.keyword
    },
    method: 'GET',
    success: function (res) {
      wx.hideLoading()
      var goodsList = res.data.data.dataList;
      if(goodsList.length == 0){
        that.setData({
          hidden: false,
          tip: "没有更多了"
        })
      }
      var list = that.data.list;
      var count = 0;
      currPage = res.data.data.pageInfo.total_page;
      count = res.data.cartNums;

      for (var i = 0; i < goodsList.length; i++) {
        list.push(goodsList[i]);
      }
      
      that.setData({
        goodsList: list,
        count: count,
        base_url: base_url
      })
      //console.log(that.data.goodsList,info);
      page++;
    }
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    hidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = 1;
    var that = this;
    that.setData({ keyword: options.keyword });
    keyWord = options;
    // loadMore(that, options,'uoLoad');
  },
  onShow:function(){   
    page = 1;
    var that = this;
    // that.setData({ keyword: keyWord.keyword,});
    loadMore(that, keyWord,'onShow');
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (data) {
    var that = this;
    page = 1;
    that.setData({ list: []})
    loadMore(that, data);
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (options) {
    var that = this;
    if (currPage < page){
      that.setData({
        hidden: false,
        tip: "没有更多了"
      })
      return false;
    }else{
      var that = this;
      loadMore(that, options);
    }
  },

  /**
   * 添加购物车
   */
  add: function (e,options) {
    var that = this;
    var gid = e.target.dataset.gid;

    wx.request({
      url: base_url + 'index.php?c=wxApp&a=addCart',
      data: {
        account: userInfo.account,
        gid: gid,
      },
      method: 'GET',
      success: function (res) {
        var count = res.data.data.count;
        pageSize = (page - 1) * pageSize;
        page = 1;
        that.setData({
          list: []
        })
        
        loadMore(that, options);
      
      }
    })
  },

  /**
   * 减少购物车
   */
  reduce: function (e,options) {
    var that = this;
    // var index = e.target.dataset.num;
    var gid = e.target.dataset.gid;
    wx.request({
      url: base_url + 'index.php?c=wxApp&a=delCart',
      data: {
        account: userInfo.account,
        gid: gid,
      },
      method: 'GET',
      success: function (res) {
        var count = res.data.data.count;
        pageSize = (page - 1) * pageSize;
        page = 1;
        that.setData({
          list: []
        })

        loadMore(that, options);

      }
    })
  },
  /**
   * 获取input值
   */
  bindChange: function (e){
    var keyword = e.detail.value;
    this.setData({ keyword: keyword});
  },

  /**
   * 搜索
   */
  search: function (options) {
    var that = this;
    that.setData({ list: [] });
    page = 1;
    var keyword = that.data.keyword;
    
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: base_url + 'index.php?c=wxApp&a=pagingSearchGoods',
      data: {
        account: userInfo.account,
        pageIndex: page,
        pageSize: pageSize,
        keyword: keyword
      },
      method: 'GET',
      success: function (res) {
        wx.hideLoading()
        // console.log(res.data)
        var goodsList = res.data.data.dataList;
        var list = that.data.list;
        var count = 0;
        currPage = res.data.data.pageInfo.total_page;
        count = res.data.cartNums;

        for (var i = 0; i < goodsList.length; i++) {
          list.push(goodsList[i]);
        }

        that.setData({
          goodsList: list,
          count: count
        })
        page++;
      }
    })
  },
  /**
   * enter事件搜索
   */
  searchGoods:function(e){
    var that = this;
    that.setData({ list: [] });
    page = 1;
    var keyword = e.detail.value;
    
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: base_url + 'index.php?c=wxApp&a=pagingSearchGoods',
      data: {
        account: userInfo.account,
        pageIndex: page,
        pageSize: pageSize,
        keyword: keyword
      },
      method: 'GET',
      success: function (res) {
        wx.hideLoading()
        // console.log(res.data)
        var goodsList = res.data.data.dataList;
        var list = that.data.list;
        var count = 0;
        currPage = res.data.data.pageInfo.total_page;
        count = res.data.cartNums;

        for (var i = 0; i < goodsList.length; i++) {
          list.push(goodsList[i]);
        }

        that.setData({
          goodsList: list,
          count: count
        })
        page++;
      }
    })
  },

  /**
   * 购物车页面
   */
  cart: function (options) {
    wx.reLaunch({
      url: '../../cart/cart',
    })
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