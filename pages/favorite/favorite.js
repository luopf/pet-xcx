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
    index: 1,
    messageList: [],
    longitude: '',//经度
    latitude: '',//纬度
    lid: '',
    labelInfo: '',
    inputContent: '',
    userInfo:''
  },
 
  // 点击进入发布消息详情页
  messageDetail: function (e) {
    var mid = e.currentTarget.dataset.mid;
    wx.navigateTo({
      url: '../goods/goodsDetail/goodsDetail?mid=' + mid,
    })
  },

  
  
 
  // 分页展示发布消息
  //请求分页数据
  pagingMessage: function (user_id,pageIndex, pageSize) {
    var that = this;
    wx.request({
      url: base_url + 'index.php/front/message/paggingMessage',
      data: {
        'user_id': user_id,
        'pageIndex': pageIndex,
        'pageSize': pageSize,
        
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
        console.log(that.data.messageList);
        that.setData({ messageList: messageList });
      }
    })
  },
  getUserFavorite:function(user_id){
    let that = this;
    wx.request({
      url: base_url + 'index.php/front/favorite/findUserAllFavorite',
      data: {
        'user_id': user_id,
      },
      method: "POST",
      success: function (res) {
        let messageList = res.data;
        console.log(messageList);
        that.setData({ messageList: messageList });
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    that.setData({
      userInfo: userInfo,
    });
    
    



   



    // that.pagingMessage(user_id,pageIndex,pageSize);
   
  },

    
    
   

  onShow: function () {
    var that = this;
    let userInfo = that.data.userInfo;
    let user_id = userInfo['id'];
    that.getUserFavorite(user_id);
    
  },


  /**
  * 下拉加载更多标签
  */
  onReachBottom: function () {
    // var that = this;
    // let userInfo = that.data.userInfo;
    // let user_id = userInfo.id;
    // if (pageIndex + 1 > allPages) {
    //   return false;
    // } else {
    //   pageIndex++;
    //   that.pagingMessage(user_id, pageIndex, pageSize);
    // }

  },


  /**
   * 生命周期函数--监听页面关闭
   */
  onUnload: function () {
    this.setData({ messageList: [] });
    pageIndex = 1;
    allPages = 0;
  },

  


 
})