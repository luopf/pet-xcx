// pages/order/paymentOrder/paymentOrder.js
var CONFIG = require('../../utils/config.js');
var app = getApp();
var base_url = CONFIG.API_URL.BASE_URL;
var userInfo = '';
var imgList = [];//定义上传的图片
var imgNum = 9;//规定要上传的图片的数量

var uploadImages = function (that, tempFilePaths) {
  for (var i = 0; i < tempFilePaths.length; i++) {
    //上传图片到服务器
    wx.uploadFile({
      url: base_url + 'index.php?c=wxApp&a=uploadImage',
      filePath: tempFilePaths[i],
      name: 'file',
      formData: null,
      success: function (res) {
        //获取到的结果为字符串形式，转化为对象
        var data = JSON.parse(res.data);
        var img_url = data.data.img_url;
        imgList.push({ img_url: img_url });

        //最多上传几张图片，此处为9张
        if (imgList.length >= imgNum) {
          that.setData({
            btnShow: false
          });
        }

        that.setData({
          imgList: imgList,
          imgShow: true,
        });
        // console.log( that.data.imgList.length );
      }
    });
  }
}


Page({
  data: { 
        base_url: base_url,
        user_id: userInfo.id,
        stars: [0, 1, 2, 3, 4],
        normalSrc: '../../static/images/my/normal.png',
        selectedSrc: '../../static/images/my/selected.png',
        halfSrc: '../../static/images/my/half.png',
        key: 0,//评分,
        btnShow: true,//添加图片按钮显示
        imgHide: true,//无上传图片不显示
        imgList: [],
       
    },
  onLoad: function (options) {
    var that = this;
    userInfo = wx.getStorageSync('userInfo');
    // 页面初始化 options为页面跳转所带来的参数
    wx.request({
      url: base_url + "index.php?c=wxApp&a=findOrder",
      data: options,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        var goodsList = res.data.data.goods_list;
        var sum = res.data.data.total_price;
        that.setData({
          goodsList: goodsList,
          sum: sum,
          oid: options.oid,
          fee: res.data.data.fee,
          order_num: res.data.data.order_num,
          nick_name: res.data.data.nick_name,
          comment:''
        });
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    });

    //没有上传的图片时不显示图片
    if (imgList.length > 0) {
      that.setData({
        imgShow: false
      })
    };
  },
 
  //监听评价的输入
  listenerCommentInput: function (e) {
//     console.log(e);
    if (e.detail.value == '' || e.detail.value ==null){
      wx.showToast({
        title: '内容不能为空',
        image: '../../static/images/my/error_tip.png',
        duration: 1000
      });
      return false;
    }
    this.data.comment = e.detail.value;
  },


 //监听匿名
  checkboxChange: function (e) {
    var v = e.detail.value;
    if (v[0] == 1){
       v = 1;
    }else{
      v = 0;
    }
//     console.log(v);
    this.setData({
      isName: v,
    });
  },
 
  //点击左边,整颗星
  selectRight: function (e) {
    var key = e.currentTarget.dataset.key
    if (this.data.key == 1 && e.currentTarget.dataset.key == 1) {
      //只有一颗星的时候,再次点击,变为0颗
      key = 0;
    }
    this.setData({
      key: key
    })
  },

  /**
   * 上传图片
   */
  chooseImg: function (options) {
    var that = this;
    wx.chooseImage({
      count: 9 - imgList.length, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res);
        // // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        uploadImages(that, tempFilePaths);
      }
    })
  },

  /**
   * 删除图片
   */
  delImg: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;//获取要删除图片的index
    var img_url = imgList[index].img_url;//获取要删除的图片路径
    // console.log( img_url);
    wx.request({
      url: base_url + 'index.php?c=wxApp&a=deleteUpLoadImage',
      data: { img_url: img_url },
      method: 'GET',
      success: function (res) {
        if (res.data.errorCode == 0) {//服务器端删除成功
          //删除该图片
          imgList.splice(index, 1);
          //图片删完后不显示图片区
          if (imgList.length == 0) {
            that.setData({
              imgHide: true
            });
          }

          //数量数量小于上限添加图片按钮显示
          if (imgList.length < imgNum) {
            that.setData({
              btnShow: true
            })
          }
          that.setData({
            imgList: imgList
          });
        }
      }
    })
  },

  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  
  //提交数据
  submitForm:function(){
    var that = this;
    console.log(that);
    if (that.data.comment == '') {
      wx.showToast({
        title: '内容不能为空',
        image: '../../static/images/my/error_tip.png',
        duration: 1000
      });
      return false;
    }
    //拼接图片地址
    var img_list = that.data.imgList;
    for (let m = 0; m < img_list.length; m++) {
      img_list[m] = { img_url: './' + img_list[m].img_url }
    }
//     console.log(img_list);
    img_list = JSON.stringify(img_list);
     wx.request({
       url: base_url + 'index.php?c=wxApp&a=comments',
       method:'GET',
       data:{
         'key':that.data.key,
         'img_list':img_list,
         'comment': that.data.comment,
         'isName': that.data.isName,
         'oid': that.data.oid,
         'order_num': that.data.order_num,
         'nick_name': that.data.nick_name,
         'user_id': that.data.user_id,
	   head_img_url: userInfo.head_img_url
       },
       success: function (res){
      //    console.log(res,'res');
         if (res.data.errorCode == 0) {//成功
            wx.showToast({
              title: '评价成功',
              icon: 'success',
              duration: 2000
            });
           wx.navigateBack();
         }
       },
     })
  },
})