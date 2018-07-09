var CONFIG = require('../../utils/config.js');
var Fun = require('../../utils/common.js')
var app = getApp();
var base_url = CONFIG.API_URL.BASE_URL;
Page({
  data:{
     base_url: base_url,
     templateData:{ loadingBall:1 }
  },
  onLoad:function(options){
    var that = this;
    let url = base_url + 'index.php?c=wxApp&a=discountList';
    let cData = {pageSize: 3};
    // 页面初始化 options为页面跳转所带来的参数
    Fun.CurlPaging( that, url, cData, false);
    console.log('-------------------', that.data.list);
    
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
  },
  onReachBottom: function(){
    //下拉加载
    var that = this;
    let cData = {pageSize: 3};
    Fun.CurlReachBottom(that, cData,)
  }
})