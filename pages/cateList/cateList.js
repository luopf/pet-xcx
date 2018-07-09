// pages/cate/cate.js
//引入域名信息
var CONFIG = require('../../utils/config.js');
//引入通用工具类js
var tools = require('../../utils/tools.js');
var app = getApp();
//获取域名信息
var base_url = CONFIG.API_URL.BASE_URL;
var img_url = CONFIG.API_URL.IMG_URL;
var pageIndex = 1;
var pageSize = 10;
var allPages = 0;
//定义请求的数据
var cData = {};
var gids = '';
var firId = 0;
var secId = 0;
var bStop = true;

// var tipHidden = ''


Page({

  /**
   * 页面的初始数据
   */
  data: {
    base_url: base_url,
    //设置第一个分类为默认选中
    on: 0,
    img_url: img_url,
    list: [],
    key: 0,
    index:1,
    messageList:[],
    longitude: '',//经度
    latitude:'',//纬度
    lid:'',
    labelInfo:'',
    inputContent:'',
      },
// 获取分类信息
get_labelDetail:function(lid){
  var that = this;
  wx.request({
    url: base_url + 'index.php/front/label/findLabelDetail',
    data: {
      lid: lid
    },
    method: "POST",
    success: function (res) {
      
      that.setData({labelInfo: res.data.data });
      console.log(res.data.data,"============");
    }
  })


},
// 进入发布页面
  enter_publishPage:function(){
    wx.reLaunch({
      url: '../publish/publish',
    })
  },
// 输入框
  InputContent:function(e){
    var that = this;
    that.setData({
      inputContent: e.detail.value
    });
  },
// 点击完成时点击事件
  confirm_sousuo:function(e){
  var that = this;
  var content = e.detail.value;
  var index = that.data.index;
  var order = "";
  if (index == 1) {// 默认
    order = "default";
  } else if (index == 2) {// 距离
    order = "distance";
  } else if (index == 3) {// 浏览
    order = "check";
  } else if (index == 4) {// 评论
    order = "message";
  }
  that.setData({
    messageList:[]
  });
  that.pagingMessage(order, pageIndex, pageSize, content);

  },
  // 点击进入发布消息详情页
  messageDetail: function (e) {
    var mid = e.currentTarget.dataset.mid;
    // console.log(mid);

    wx.navigateTo({
      url: '../goods/goodsDetail/goodsDetail?mid=' + mid,
    })
  },

// 导航栏切换
  tab_change:function(e){
    var that = this;
    var index = e.currentTarget.dataset.id;
    that.setData({
      index:index,
      messageList:[],
    });
    var order = "";
    if (index == 1) {// 默认
      order = "default";
    } else if (index == 2) {// 距离
      order = "distance";
    } else if (index == 3) {// 浏览
      order = "check";
    } else if (index == 4) {// 评论
      order = "message";
    }
    that.pagingMessage(order,pageIndex, pageSize);

  },
// 定位
  getLocation: function () {
    var that = this;
    wx.getLocation({
      type: 'wgs84',   //<span class="comment" style="margin:0px;padding:0px;border:none;">默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标</span><span style="margin:0px;padding:0px;border:none;"> </span>  
      success: function (res) {
        // success    
        var longitude = res.longitude;
        var latitude = res.latitude;
        that.setData({
          longitude: longitude,
          latitude: latitude,
        });
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
  // 分页展示发布消息
  //请求分页数据
  pagingMessage: function (order, pageIndex, pageSize,content=null) {
    var that = this;
    wx.request({
      url: base_url + 'index.php/front/message/paggingMessage',
      data: {
        'order': order,
        'pageIndex': pageIndex,
        'pageSize': pageSize,
        'longitude': that.data.longitude,
        'latitude': that.data.latitude,
        'content': content,
        'lid':that.data.lid,
        'status': 1,
      },
      method: "POST",
      success: function (res) {
        var data = res.data.data;
        console.log(data.dataList);
        
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



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var that = this;
     var lid = options.cid;
    
   
    that.setData({
      lid: lid
    });
    that.get_labelDetail(lid);
    // //获取设备信息
    // wx.getSystemInfo({
    //   success: function (res) {
    //     that.setData({ scrollH: res.windowHeight - 51 + 'px' });
    //   }
    // });
    that.getLocation();
    var order = "";
    if(that.data.index == 1){// 默认
      order = "default";
    } else if(that.data.index == 2){// 距离
      order = "distance";
    } else if (that.data.index == 3){// 浏览
      order = "check";
    } else if (that.data.index == 4){// 评论
       order = "message"
    }
    that.pagingMessage(order, pageIndex, pageSize);

  },

  onShow: function () {
    var that = this;
    //设置底部导航信息：
    // let cartGoodsCount = wx.getStorageSync('cartGoodsCount');
    // let nav_active = {
    //   home: '',
    //   circle: '',
    //   cate: 'active',
    //   center: '',
    //   img: cartGoodsCount.img
    // };
    // that.setData({
    //   nav_active: nav_active,
    // });
  },

 

  /**
   * 加载更多
   */
  loadMore: function () {
    if (bStop) {
      bStop = false;
      var that = this;
      if (page > allPages) {
        return false;
      } else {
        cData = {
          pageIndex: page,
          pageSize: pageSize,
          firId: firId,
          secId: secId
        }
        pagingGoods(that, cData);
      }
    } else {
      return false;
    }
  },

  /**
   * 切换二级分类
   */
  changeSec: function (e) {
    var that = this;
    var act = e.currentTarget.dataset.index;
    secId = e.currentTarget.dataset.id;
    that.setData({ act: act, list: [] });
    page = 1;
    allPages = 0;
    var cData = {
      firId: firId,
      secId: secId,
      pageIndex: page,
      pageSize: pageSize
    };
    pagingGoods(that, cData);
  },

  /**
   * 生命周期函数--监听页面关闭
   */
  onUnload: function () {
    this.setData({ list: [] });
    pageIndex = 1;
    allPages = 0;
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


  /**
  * 下拉加载更多标签
  */
  onReachBottom: function () {
    var that = this;
    
   
    if (pageIndex+1 > allPages) {
      return false;
    } else {
      pageIndex++;
      var order = "";
      if (that.data.index == 1) {// 默认
        order = "default";
      } else if (that.data.index == 2) {// 距离
        order = "distance";
      } else if (that.data.index == 3) {// 浏览
        order = "check";
      } else if (that.data.index == 4) {// 评论
        order = "message"
      }
      that.pagingMessage(order, pageIndex, pageSize);
    }

  },
})