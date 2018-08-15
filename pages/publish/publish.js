var CONFIG = require('../../utils/config.js');
var Fun = require('../../utils/common.js')
//index.js
var app = getApp();
var base_url = CONFIG.API_URL.BASE_URL;
var img_url = CONFIG.API_URL.IMG_URL;
var elasticInfo = {};
var pageIndex = 1;
var pageSize = 10;
var allPages = 0;

//上传图片
var uploadImages = function (that, tempFilePaths) {
  var imgList = that.data.imgList;
  for (var i = 0; i < tempFilePaths.length; i++) {
    //上传图片到服务器
    wx.uploadFile({
      url: base_url + 'index.php/front/common/uploadImage', 
      filePath: tempFilePaths[i],
      name: 'file',
      formData: null,
      success: function (res) {
        
        //获取到的结果为字符串形式，转化为对象
        var data = JSON.parse(res.data);
        
        var img_url = data.data.img_url;

        imgList.push({ img_url: img_url });

     

        that.setData({
          imgList: imgList,
        });
        
        
      }
    });
  }
}


Page({
  data: {
    headerBgOpacity: 0,
    home: "active",
    base_url: base_url,
    img_url: img_url,
    hidden: true,

    cateList:[],
    cateSelectIndex:49,
    content:'',
    petname:'',
    petcate:'',
    petage:'',
    petsex:'',
    phone:'',
    wx_number:'',
    address:'',
    imgList: [],//临时存放图片数组
    longitude:'',
    latitude:'',
    currentCity:'',
    userInfo : '',
    address_text:'',
    uploadImgShow:true,
  },
  //定位
  getLocation: function () {
    var that = this;
    wx.getLocation({
      type: 'gcj02',   //<span class="comment" style="margin:0px;padding:0px;border:none;">默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标</span><span style="margin:0px;padding:0px;border:none;"> </span>  
      success: function (res) {
        // success    
      
        var longitude = res.longitude;
        var latitude = res.latitude;
       
      
        that.loadCity(longitude, latitude);
        that.setData({
          longitude: longitude,
          latitude: latitude,
        });
      }
    })
  },
  //经纬度转换城市
  loadCity: function (longitude, latitude) {
    var that = this;

    wx.request({
      url: 'https://restapi.amap.com/v3/geocode/regeo?key=a48915f434617dbf430c9b2d68aa55b7&location=' + longitude + ',' + latitude+'&radius=50',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // success    
       
        var detail = res.data.regeocode.formatted_address;
        var city = res.data.regeocode.addressComponent.city;
        var address_text = detail;
        that.setData({ currentCity: city, address_text: address_text});

      },
      fail: function () {
        
        that.setData({ currentCity: "获取定位失败" });
      },

    })
  }, 
  choseMap(){
    let that = this;
    let longitude = that.data.longitude;
    let latitude = that.data.latitude;
    wx.navigateTo({
      url: '../mapView/mapView?latitude=' + latitude + '&longitude=' + longitude,
    })


  },

  selectCate:function(e){
    var that = this;
    var cid = e.currentTarget.dataset.cid;
    that.setData({
      cateSelectIndex:cid
    });
  },
  // 输入内容
  bindContentTextAreaBlur:function(e){
    var that = this;
    that.setData({
      content : e.detail.value
    });
  },
  // 宠物姓名
  bindPetNameInput:function(e){
    var that = this;
    that.setData({
      petname : e.detail.value
    });

  },

  // 宠物品种
  bindPetCateInput:function(e){
    var that = this;
    that.setData({
      petcate:e.detail.value
    });
  },

  //宠物年龄
  bindPetAgeInput:function(e){
    var that = this;
    that.setData({
      petage:e.detail.value
    });
  },

  // 宠物性别
  bindPetSexInput:function(e){
    var that = this;
    that.setData({
      petsex:e.detail.value
    });
  },
  // 电话
  bindUserPhoneInput:function(e){
    var that = this;
    that.setData({
      phone:e.detail.value
    });
  },
  // 微信
  bindWXInput:function(e){
    var that = this;
    that.setData({
      wx_number:e.detail.value
    });
  },
  // 地址
  bindAddressInput:function(e){
    var that = this;
    that.setData({
      address:e.detail.value
    });
  },
  // 添加图片点击事件
  addimg: function () {
    let that = this;
    let imgsLength = that.data.imgList.length;
    
    if (imgsLength >= 3){
      
      
      return;
    }
     
    wx.chooseImage({
      count: 3 - imgsLength.length,
      success: function (res) {
        
        if (imgsLength + res.tempFilePaths.length > 3){
         
          return;
        } 
        
        uploadImages(that, res.tempFilePaths);
      
      },
      fail: function (err) {
       
      }
    })
    
  },
  // 长按删除图片事件
  deletetempimg: function (e) {
    
    let that = this;
    let index = e.currentTarget.dataset.index;
    let uploadImgs = that.data.imgList;
    let img_url = uploadImgs[index];
    wx.request({
      url: base_url + 'index.php/front/common/deleteUpLoadImage',
      data: img_url,
      method: 'POST',
      success: function (res) {
       
        if (res.data.errorCode == 0) {//服务器端删除成功
          //删除该图片
          uploadImgs.splice(index, 1);
          that.setData({
            imgList: uploadImgs
          });
        }
      }
    })
  },
   


  // 立即发布点击事件
  publish_message:function(){
    var that = this;
    var userInfo = that.data.userInfo;
    if (userInfo.id == 0 || userInfo.id == null || userInfo.id == undefined){
      wx.redirectTo({
        url: '../pages/index/index'
      })
    }
    var label_id = that.data.cateSelectIndex;// 标签id
    if (label_id == '' || label_id == null || label_id == undefined) {
      wx.showToast({
        title: '请选择宠物的标签！',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false;
    }
   
    
    var img_list = JSON.stringify(that.data.imgList);// 发布消息图片的json格式
    var text_content = that.data.content;//发布的消息的内容
    if (text_content == '' || text_content == null || text_content == undefined) {
      wx.showToast({
        title: '请填写发布的内容！',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false;
    }
    var address = that.data.address;//地址
    var address_text = that.data.address_text;// 地址的字符串形式
    var pet_name = that.data.petname; // 宠物名称
    // if (pet_name == '' || pet_name == null || pet_name == undefined) {
    //   wx.showToast({
    //     title: '请填写宠物的昵称！',
    //     icon: 'none',
    //     duration: 1000,
    //     mask: true
    //   })
    //   return false;
    // }
    var pet_cate = that.data.petcate;// 宠物的品种
    // if (pet_cate == '' || pet_cate == null || pet_cate == undefined) {
    //   wx.showToast({
    //     title: '请填写宠物的品种！',
    //     icon: 'none',
    //     duration: 1000,
    //     mask: true
    //   })
    //   return false;
    // }
    var pet_age = that.data.petage;// 宠物的年龄
    // if (pet_age == '' || pet_age == null || pet_age == undefined) {
    //   wx.showToast({
    //     title: '请填写宠物的年龄！',
    //     icon: 'none',
    //     duration: 1000,
    //     mask: true
    //   })
    //   return false;
    // }
    var pet_sex = that.data.petsex;// 宠物性别
    // if (pet_sex == '' || pet_sex == null || pet_sex == undefined) {
    //   wx.showToast({
    //     title: '请填写宠物的性别！',
    //     icon: 'none',
    //     duration: 1000,
    //     mask: true
    //   })
    //   return false;
    // }
    var longitude = that.data.longitude;
    var latitude = that.data.latitude;
    var city = that.data.currentCity;
    var phone = that.data.phone;
    if (phone == '' || phone == null || phone == undefined) {
      wx.showToast({
        title: '请填写联系电话！',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false;
    }
    var wx_number = that.data.wx_number; 
    if (wx_number == '' || wx_number == null || wx_number == undefined) {
      wx.showToast({
        title: '请填写微信号码！',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false;
    }
    var messageInfo = {
      'user_id': userInfo.id,
      'label_id': label_id,
      'img_list': img_list,
      'text_content': text_content,
      'address_text': address_text,
      'pet_name': pet_name,
      'pet_cate': pet_cate,
      'pet_age': pet_age,
      'pet_sex': pet_sex,
      'longitude': longitude,
      'latitude': latitude,
      'city': city,
      'phone': phone,
      'wx_number': wx_number,
    };
    wx.request({
      url: base_url + 'index.php/front/message/addMessage',
      data: messageInfo,
      method: 'POST',
      success: function (res) {
        

        if (res.data.errorCode == 0) {//
          // 发布消息成功跳转消息成功页
          wx.navigateTo({
            url: '../publishSuccess/publishSuccess'
          })
        } else if (res.data.errorCode == 2){// 用户被拉黑
          wx.showToast({
            title: '您已被管理员拉黑，不能发布任何信息。',
            icon: 'none',
            duration: 1000,
            mask: true
          })

        }
      }
    })

    
    

  },
 
  onShow: function () {
    var that = this;
    //设置底部导航信息：
    let nav_active = {
      publish: 'active',
      circle: '',
      center: ''
    };
    let userInfo = that.data.userInfo;
    let user_id = userInfo.id;
    app.getUserNoReadNews(user_id, that);
    that.setData({ nav_active: nav_active });

   



  },
  
  onLoad: function (options) {
    var that = this;
    var userInfo = wx.getStorageSync("userInfo");
    
    if (userInfo.id == 0 || userInfo.id == 1 || userInfo.id == null || userInfo.id == undefined) {
      wx.redirectTo({
        url: '../pages/index/index'
      })
    }
    that.setData({
      userInfo: userInfo
    });  
    that.getLocation();
    
    //获取所有分类
    wx.request({
      url: base_url + 'index.php/front/label/getAllLables',
      data: {},
      method: 'GET',
      success: function (res) {
        let data = res.data.data;
        
        that.setData({ cateList: data[0], hidden: false });
       
      }
    }),
    
    //获取页面公共数据
    Fun.getAppElastic(that, base_url, that.commonSet);


  },

  //测试方法：回调
  commonSet: function (elasticInfo) {
    var that = this;
    //1. 设置页头
    // wx.setNavigationBarTitle({
    //   title: elasticInfo.pageTitle,
    //   success: function(res) {
    //     // success
    //   }
    // })
    //2. 版权信息设置
    // that.setData({
    //   copyrightInfo: elasticInfo.copyright
    // });
  },

  login: function () {
    if (wx.getStorageSync('thirdRD_session')) return;
    //获取用户信息
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code;
        
        wx.request({
          
          url: base_url + 'index.php/front/Wxapp/wx_login',
          data: {
            js_code: code
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          success: function (res) {
           
            var data = res.data;
           
            wx.setStorageSync('thirdRD_session', data);
            wx.getUserInfo({
              success: function (res) {
                // success
                var encryptedData = res.encryptedData;
                var iv = res.iv;  //加密算法的初始向量
                var thridRDSession = wx.getStorageSync('thirdRD_session');

                wx.request({
                  url: base_url + 'index.php/front/wxApp/decryptUserInfo',
                  data: {
                    thridRDSession: thridRDSession,
                    encryptedData: encryptedData,
                    iv: iv
                  },
                  method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                  header: {
                    'content-type': 'application/json'
                  }, // 设置请求的 header
                  success: function (res) {

                    if (userInfo != "" || userInfo != null) {
                      var ws = res.data;
                      var json = ws.replace(/^[\s\uFEFF\xa0\u3000]+|[\uFEFF\xa0\u3000\s]+$/g, "");

                      var userInfo = JSON.parse(json);

                      wx.setStorage({
                        key: "userInfo",
                        data: userInfo
                      });
                      that.getCartGoodsCount();
                    }

                    // success
                  },
                  fail: function () {
                    // fail
                  },
                  complete: function () {
                    // complete
                  }
                })

              },
              fail: function () {
                // fail
              },
              complete: function () {
                // complete
              }
            })
            // success
          },
          fail: function () {
            // fail
          },
          complete: function () {
            // complete
          }
        })
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },


	/**
	 * 转发
	*/
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
     
    }
    return {
      title: elasticInfo.share.title,
      path: elasticInfo.share.path,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },










  /**
   * 下拉加载更多标签
   */
  onReachBottom: function () {
   
  },

 




})
