/**
 * 商品详情页js
 * @author Moon
 * 
 */
var WxParse = require('../../../wxParse/wxParse.js');
var CONFIG = require('../../../utils/config.js');
var wxLogin = require('../../../utils/wxLogin.js');
var WxParse = require('../../../wxParse/wxParse.js');
var app = getApp();
var base_url = CONFIG.API_URL.BASE_URL;
var img_url = CONFIG.API_URL.IMG_URL;
var userInfo = '';
var pageIndex = 1;//分页显示 当前页
var pageSize = 10;//一页显示的评论的数量
var totalPage = 0;//总页数
var gid = 0;
var mid = 0;
var loading = true;//是否可触发滚动加载
var goodsInfo = {};
var standard = 0;//商品规格 0同意规格 1多规格

var pagingComment = function ( options, that ) {
  
  wx.request({
    url: base_url + 'index.php/front/Comment/findAllComment',
    data: {
      mid: options.mid,
      pageSize: pageSize,
      pageIndex: pageIndex,
      on: 1,
    },
    method: 'POST',
    success: function ( res ) {
      var data = res.data.data;
      
      that.setData({
        commentList: data
      })
    }
  })
};


Page({
  data: {
    base_url: base_url,
    img_url: img_url,
    current: 0,//记录当前tab的index
    hidden: true,//无评价时显示暂无评价,
    commentHidden: true,
    commentList: [],
    count: 1,//商品数量，默认为1
    firstIndex: -1,
    attrValueList: [],
    maskHidden: true,
    replaybox_status:"box-hide",//输入框是否显示
    input_placeholder:"请输入评论内容",// input的默认显示文字
    is_reply:0,// 是否事回复留言 0 留言 1 回复留言
    inputReplyContent:'',//评论输入框的内容
    cid :0,// 当前的评论 id
    likeisclick:false,
    favoriteisclick:false,
    messageInfo:'',
    shareViewisShow:false,
    imgList:[],
    userInfo:'',
    userisdianzan:false,
  },

  increasechecknum:function(){
    var that = this;
    var messageInfo = that.data.messageInfo;
    var id = messageInfo['id'];
    
  wx.request({
    url: base_url + 'index.php/front/message/increasechecknum',
    data: { 'id': id},
    method: 'POST',
    success: function (res) {
      var data = res.data;
    }
  })  
  },



  // 点赞
  like_click:function(e){
    var that = this;
    let messageInfo = that.data.messageInfo;// 发布的消息详情
    let userInfo = that.data.userInfo;//获取用户详情
    let userisdianzan = e.currentTarget.dataset.userisdianzan;
    if (userisdianzan){// 用户已经点赞- 点击取消点赞
      messageInfo['like_num'] -= 1;
      that.setData({
        userisdianzan: false,
        messageInfo: messageInfo
      });
      let mid = messageInfo['id'];
      let user_id = userInfo['id'];
      // 发送取消点赞请求
      wx.request({
        url: base_url + 'index.php/front/dianzan/deleteDianzan',

        data: {
          'mid': mid,
          'user_id': user_id
        },
        method: 'POST',
        success: function (res) {
          let data = res.data;
         
        }
      })

    
      

    } else{ // 用户没有点赞--点击添加点赞记录
      messageInfo['like_num'] += 1;
      that.setData({
        userisdianzan:true,
        messageInfo: messageInfo
      });
      let mid = messageInfo['id'];
      let user_id = userInfo['id'];
      // 发送怎加点赞请求
      wx.request({
        url: base_url + 'index.php/front/dianzan/addDianzan',

        data: { 
          'mid':mid,
          'user_id':user_id
         },
        method: 'POST',
        success: function (res) {
          let data = res.data;
          
        }
      })  

    }

    
    
   

  },
  // 是否点击收藏
  favorite: function (e) {
    let that = this;
    let userInfo = that.data.userInfo;
    let user_id = userInfo.id;
    let messageInfo = that.data.messageInfo;
    let mid = messageInfo['id'];
    let isclick = e.currentTarget.dataset.favo;
    console.log(e);
    if (isclick){// 已经收藏了。点击取消收藏

      // 发送增加收藏请求
      wx.request({
        url: base_url + 'index.php/front/favorite/deleteFavorite',

        data: {
          'mid': mid,
          'user_id': user_id
        },
        method: 'POST',
        success: function (res) {
          if (res.data.errorCode == 0) {

            that.setData({
              favoriteisclick: false
            });
          }

        }
      })  

     



    } else {// 没有收藏， 点击取消收藏
      // 发送取消收藏请求
      wx.request({
        url: base_url + 'index.php/front/favorite/addFavorite',

        data: {
          'mid': mid,
          'user_id': user_id
        },
        method: 'POST',
        success: function (res) {
          if (res.data.errorCode == 0) {
            that.setData({
              favoriteisclick: true
            });
          }

        }
      })  
     
    }
   },  



// 分享按钮点击事件
  fenxiang:function(){
    var that = this;
    var shareViewisShow = that.data.shareViewisShow;
    if (shareViewisShow){
      that.setData({
        shareViewisShow : false
      });
    } else {
      that.setData({
        shareViewisShow: true
      });
    }
    
  },
  
  // 点击放大图片
  previewImage:function(e){
    var that = this;
    wx.previewImage({
      current: that.data.imgList, // 当前显示图片的http链接   
      urls: that.data.imgList // 需要预览的图片http链接列表   
    }) 
  },

  // 取消分享
  cancle_share:function(e){
    var that = this;
    that.setData({
      shareViewisShow : false
    });
  },


 
  //点击拨打电话
  call_user: function (e) {
    var phone_num = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone_num //仅为示例，并非真实的电话号码
    })
  },
  //点击回复用户 回复留言is_reply = 1
  replay_user:function(e){
    var inputPlaceHolder = e.currentTarget.dataset.name;
    var cid = e.currentTarget.dataset.cid;
    this.setData({
      input_placeholder: "回复"+inputPlaceHolder
    });
    
    var that = this;
    var replaybox_status = that.data.replaybox_status;
    if (replaybox_status == 'box-hide'){
      this.setData({
        replaybox_status: 'box-show',
        is_reply : 1,
        cid: cid,
      });
      
    } else {
      this.setData({
        replaybox_status: 'box-hide',
        is_reply: 0,
        cid : 0,
      });
     
    }
  },
  // // 隐藏回复框 不评论 is_reply = 0
  // hidden_replaybox:function(e){
  
  //   var that = this;
  //   var replaybox_status = that.data.replaybox_status;
  //   if (replaybox_status == 'box-show'){
  //     this.setData({
  //       replaybox_status: 'box-hide',
  //       is_reply : 0,
  //       cid : 0,
  //     });
  //   } 
  // },
// 点击留言  留言 is_reply = 0
  say:function(e){
    
    var that = this;
   
    var inputPlaceHolder = e.currentTarget.dataset.name;
    this.setData({
      input_placeholder: "回复" + inputPlaceHolder,
      
    });
    var replaybox_status = that.data.replaybox_status;
    if (replaybox_status == 'box-hide') {
      this.setData({
        replaybox_status: 'box-show',
        is_reply :0,
        cid : 0,
      });

    } else {
      this.setData({
        replaybox_status: 'box-hide',
        is_reply: 0,
        cid : 0,
      });

    }

  },

  replayContentInput:function(e){
    var that = this;
    that.setData({
      inputReplyContent:e.detail.value
    });
  },
  //回复按钮点击事件
  replayUser:function(e){
    
    var that = this;
    var userInfo = that.data.userInfo;
    //增加评论数
    var messageInfo = that.data.messageInfo;
    messageInfo['message_num'] += 1;
    

    var mid = e.currentTarget.dataset.mid;//发布的消息id
    var mess_num = e.currentTarget.dataset.messnum;//发布消息的编号
    var content = that.data.inputReplyContent;//评论的内容
    var user_id = userInfo['id'];// 评论用户 id
    var nick_name = userInfo['nick_name'];// 评论用户的昵称
    var is_reply = that.data.is_reply;// 是否回复
    var cid = that.data.cid;// 评论id

    
   
     var commentData = {
        mid: mid,
        mess_num: mess_num,
        content: content,
        user_id: user_id,
        nick_name: nick_name,
        is_reply: is_reply,
        cid: cid,
      }
   
    wx.request({
      url: base_url + 'index.php/front/comment/addComment',
      data: commentData,
      method: 'POST',
      success: function (res) {
        var data = res.data;
        if (data.errorCode == 0){
          that.setData({ commentList: [], replaybox_status: 'box-hide', inputReplyContent:''});
          pagingComment({mid:that.data.mid}, that);
        }
      



      }
    });

    that.setData({
      messageInfo: messageInfo
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      var userInfo = wx.getStorageSync('userInfo');
     
      //获取到发布消息id
      var mid = options.mid;
      
    
     that.setData({
        mid: mid,
        userInfo:userInfo
     });
    
    //获取发布消息详情数据
    wx.request({
      url: base_url + 'index.php/front/message/messageDetail',
      data: { mid:mid},
      method: 'GET',
      success: function ( res ) {
        var messageInfo = res.data.data;
        messageInfo['check_num'] +=  1;
        that.setData({ 
          messageInfo: messageInfo
         });
         var imgs = [];
         var tempimgs = messageInfo.img_list;
         for(var i=0;tempimgs[i] != null;i++ ){
           var imgurl = img_url + tempimgs[i].image;
           imgs.push(imgurl);
         }
         that.setData({
           imgList: imgs
         });
        that.increasechecknum(); 
        let userInfo = that.data.userInfo;
        let user_id = userInfo.id;
        let mid = messageInfo.id;
        // 获取点赞信息
        wx.request({
          url: base_url + 'index.php/front/dianzan/findUserDianzan',
          data: {
            mid: mid,
            user_id: user_id
          },
          method: 'POST',
          success: function (res) {
            let data = res.data;
           
            if (data.errorCode == 1){ // 没查到
              that.setData({
                userisdianzan : false
              });
            } else{ //查到了
              that.setData({
                userisdianzan: true
              });
            }
           
          }
        });
        // 获取收藏信息
        wx.request({
          url: base_url + 'index.php/front/favorite/findUserFavorite',
          data: {
            mid: mid,
            user_id: user_id
          },
          method: 'POST',
          success: function (res) {
            let data = res.data;
            console.log(data,'==========');
            if (data.errorCode == 1) { // 没查到
              that.setData({
                favoriteisclick: false
              });
            } else { //查到了
              that.setData({
                favoriteisclick: true
              });
            }

          }
        });
    
      }
    });
    
   
    //分页加载评价列表
    pagingComment( options, that );

  },

  // 进入地图页面
  enter_mapview:function(e){
    var that = this;
    var latitude = e.currentTarget.dataset.latitude;
    var longitude = e.currentTarget.dataset.longitude;
    wx.navigateTo({
      url: '../../mapView/mapView?latitude=' + latitude + '&longitude=' + longitude,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    wx.setNavigationBarTitle({
      title: '有宠日志',
    }) 
    
    
    
  },
   


  /**
   * 生命周期函数--监听页面关闭
   */
  onUnload: function () {
    pageIndex = 1;
    this.setData({ maskHidden: true });
  },

  /**
   * 隐藏了
   */
  onHide: function () {
    this.setData({ maskHidden: true });
  },

  /**
   * 获取属性索引
   */
  getAttrIndex: function (attrName, attrValueList) {
    //返回值为-1表示不存在此属性名，需插入新属性名
    // 判断数组中的attrKey是否有该属性值
    for (var i = 0; i < attrValueList.length; i++) {
      if (attrName == attrValueList[i].attrKey) {
        break;
      }
    }
    var aa = i < attrValueList.length ? i : -1;
   

    return aa;
  },

  /**
   * 判断新拼合的数据中是否存在原始数据中的属性值 返回值为true代表原始数据已加入新拼合的数据
   */
  isValueExist: function (value, valueArr) {
    //value为原始数据的值 valueArr为组合后值的数组
    // 判断是否已有属性值
    for (var i = 0; i < valueArr.length; i++) {
      if (valueArr[i] == value) {
        break;
      }
    }
    return i < valueArr.length;
  },


 



  /**
   * 加载更多
   */
  // loadMore: function ( options ) {
  //   var that = this;
    
  //   if (page > totalPage) {
  //     return false;
  //   } else {
  //     if (loading == true) {
  //       pagingComment(options, that);
  //     }
     
  //   }
  // },

  /**
   * 点击获取评价列表
   */
  commentList: function ( options ) {
    this.setData({ current: 2 });
  },
  hidden_input:function(e){
    this.setData({
      replaybox_status: 'box-hide',
      inputReplyContent:''
    })
  },
  /**
     * 下拉加载更多标签
     */
  onReachBottom: function (options) {
    var that = this;
    var city = that.data.currentCity;

    if (pageIndex + 1 > allPages) {
      return false;
    } else {
      pageIndex++;
      //分页加载评价列表
      pagingComment(options, that);
    }

  },


 







    
 
    onShareAppMessage: function (res) {
      let that = this;
      let messageInfo = that.data.messageInfo;
        if (res.from === 'button') {
            // 来自页面内转发按钮
        }
        return {
          title: "宠物领养",
          path: 'pages/goods/goodsDetail/goodsDetail?mid=' + that.data.messageInfo.id,
            success: function(res) {
                
            
              // 转发成功增加发布消息的转发量
              wx.request({
                url: base_url + 'index.php/front/message/addShareNum',

                data: {
                  'mid': messageInfo.id,
                  'field': "report_num"
                },
                method: 'POST',
                success: function (res) {
                  let data = res.data;

                  console.log(data, "转发成功回调");
                  if (data.errorCode == 0){
                    messageInfo.report_num += 1;
                    that.setData({
                      messageInfo: messageInfo
                    });
                  }
                }
              }) 

            },
            fail: function(res) {
                // 转发失败
              console.log(res, "转发失败");
            }
        }
    },
   
    
})


