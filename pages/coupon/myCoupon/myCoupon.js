
var CONFIG = require('../../../utils/config.js');
//index.js
var app = getApp();
var base_url = CONFIG.API_URL.BASE_URL;
var userInfo = wx.getStorageSync('userInfo');
var state = '';
var page = 1;
var pageSize = 6;
var allPages = 0;
var optionData = '';

var pagingGoods = function ( that) {
  wx.request({
    url: base_url + 'index.php?c=wxApp&a=pagingMyCoupon',
    data: {
      user_id: userInfo.id,
      state:state,
      pageIndex: page,
      pageSize: pageSize,
    },
    method: 'GET',
    success: function (res) {
      var data = res.data.data;
      // console.log(res,'resss');
      var dataList = data.dataList;
      var list = that.data.list;
      allPages = data.pageInfo.all_pages;
      for (var i = 0; i < dataList.length; i++) {
        list.push(dataList[i])
      }
      that.setData({ list: list });
      console.log('list:', list);
      page++;
    }
  })
};

Page({
  data: {
    currentTab:99,
    headerBgOpacity: 0,
    base_url: base_url,
    list: []
  },

  onLoad: function (options) {
	  optionData = options;
  },
  onUnload: function () {
    page = 1;
    pageSize = 6;
    allPages=0;
    this.setData({
      list:[],
    })
  },

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		page = 1;
		this.setData({
			list: [],
		})
		var that = this;
		state = optionData.currentTab;
		state = state == 99 ? '' : state;
		pagingGoods( that)
	},

  
  /**
   * 触底加载
   */
  onReachBottom: function (options) {
    var that = this;
    if (page > allPages) {
      return false;
    } else {
      pagingGoods( that);
    }
  },

  /**
   * 点击切换排序
   */
  swichNav: function (e, options) {
    var that = this;
    state = e.currentTarget.dataset.current;
    //设置页面显示样式 分页数据初始化
    that.setData({ currentTab:state,list: [] });
    state = state == 99 ? '' : state;
    page = 1;
    pagingGoods( that);
    
  },
  //去领券中心
  goCoupon: function () {
    wx.navigateTo({
      url: '/pages/coupon/couponList/couponList',
    });
  },
})