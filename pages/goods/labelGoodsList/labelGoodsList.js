/**
 * 标签商品列表页js
 * @author micheal
 * @since 2017-01-16
 */
var CONFIG = require('../../../utils/config.js');
var app = getApp();
var base_url = CONFIG.API_URL.BASE_URL;

//页面初始化数据
var page = 1;         
var page_size = 8;
var is_more = true;  //数据还能不能加载了了  
// var get_info = "正在加载中..";//加载提示 正在加载中 下拉加载更多 没有更多了
var label_id;   //标签id

// 获取数据
var GetList = function(that){
    if(is_more){
        that.setData({
            hidden:false
        });
        wx.request({
            url:base_url+'index.php?c=wxApp&a=pagingLabelGoods',
            data:{
                pageIndex : page,
                pageSize : page_size,
                id : label_id
            },
            success:function(res){
                console.log(res);
                var dataList = res.data.data.dataList;
                if(dataList.length > 0){
                    var list = that.data.list;
                    for(var i = 0; i < dataList.length; i++){
                        list.push(dataList[i]);
                    }
                    console.log(list);
                    that.setData({
                        list : list
                    });
                    page ++;
                    that.setData({
                        hidden:true
                    });
                }else{
                  is_more = false;
                  that.setData({
                        hidden:true
                    });
                }
            }
        });
    }
}
Page({
  data:{
    base_url:base_url,
    hidden:true,
    list:[],
    scrollTop : 0,
    scrollHeight:0
  },
  onLoad:function(data){
    //   这里要非常注意，微信的scroll-view必须要设置高度才能监听滚动事件，所以，需要在页面的onLoad事件中给scroll-view的高度赋值
      var that = this;
      label_id = data.id;
      wx.getSystemInfo({
          success:function(res){
              console.info(res.windowHeight);
              that.setData({
                  scrollHeight:res.windowHeight
              });
          }
      });
  },
  onShow:function(){
    //   在页面展示之后先获取一次数据
    var that = this;
    page = 1;   //没次进入页面的时候 因为有缓存 要重新赋值
    GetList(that);
  },
  bindDownLoad:function(){
    //   该方法绑定了页面滑动到底部的事件
      var that = this;
      if(is_more)
          GetList(that);
  },
  scroll:function(event){
    //   该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
     this.setData({
         scrollTop : event.detail.scrollTop
     });
  },
  refresh:function(event){
    //   该方法绑定了页面滑动到顶部的事件，然后做上拉刷新
      page = 1;
      this.setData({
          list : [],
          scrollTop : 0
      });
      GetList(this)
  },
  // 跳转到商品详情页
  goodsDetail: function (data) {
    wx.navigateTo({ url: '../goodsDetail/goodsDetail?id=' + data.currentTarget.dataset.id });
  }
})