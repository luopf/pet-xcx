var CONFIG = require('../../utils/config.js');
var Fun = require('../../utils/common.js');
var app = getApp();
var base_url = CONFIG.API_URL.BASE_URL;
var img_url = CONFIG.API_URL.IMG_URL;
Page({
  data:{
    text:"Page template",
    base_url: base_url,
    img_url: img_url,
    userInfo:'',
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo.id == 0 || userInfo.id == null || userInfo.id == undefined) {
      wx.redirectTo({
        url: '../pages/index/index'
      })
    }
    that.setData({
      userInfo: userInfo
    });  
    console.log(userInfo,"============");
    // 查找当前用户的所有未读消息并用数字的方式显示提醒
    // wx.request({
    //   url: base_url + 'index.php/front/message/paggingMessage',
    //   data: {
    //     'city': city,
    //     'pageIndex': pageIndex,
    //     'pageSize': pageSize,
    //     'content': content,
    //     'status': 1,
    //   },
    //   method: "POST",
    //   success: function (res) {

    //     var data = res.data.data;
    //     var dataList = data.dataList;
    //     var messageList = that.data.messageList;
    //     allPages = data.pageInfo.all_pages;
    //     for (var i = 0; i < dataList.length; i++) {
    //       messageList.push(dataList[i]);
    //     }
    //     that.setData({ messageList: messageList });
    //   }
    // })



  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})