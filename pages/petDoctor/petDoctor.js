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
var user_id = 1;


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
        // console.log( that.data.imgList.length );
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
    petcateinput:'',// 宠物品种
    petbitthday:'2018-5-15',//宠物生日
    sexIndex:-1,// 性别索引
    sexArray:['公','母',],//性别数组
    bearIndex:-1,//绝育索引
    bearArray:['是','否'],//绝育数组
    petlastimmune:'2018-5-15',// 宠物上次绝育时间
    petlastrepellant:'2018-5-15', // 宠物上次驱虫时间
    phoneinput:'',//联系电话
    wxnumberinput:'',//微信号码
    checkboxArray: [{value:'正常'}, {value:'异常'}],// 单选框数组
    checkboxindex:0,// 单选按钮索引
    petcontent:'',
    imgList:[],//临时存放图片数组
    userInfo:''
    
  },
  

// 宠物品种输入框
  bindPetCateInput:function(e){
    var that = this;
    that.setData({
      petcateinput: e.detail.value
    });
  },
  
//宠物生日
  bindBirthdayDateChange:function(e){
    var that = this;
    that.setData({
      petbitthday: e.detail.value
    });
  },
// 宠物性别
  bindSexChange:function(e){
    var that = this;
    that.setData({
      sexIndex:e.detail.value
    });
  },
 // 宠物是否绝育
  bindBearChange:function(e){
    var that = this;
    that.setData({
      bearIndex:e.detail.value
    });
  },
  // 宠物上次免疫时间
  bindLastImmuneChange:function(e){
    var that = this;
    that.setData({
      petlastimmune : e.detail.value
    });
  },
  // 宠物上次驱虫时间
  bindLastRepellantChange:function(e){
    var that = this;
    that.setData({
      petlastrepellant : e.detail.value
    });
  },
  // 联系方式
  bindPhoneInput:function(e){
    var that = this;
    that.setData({
      phoneinput:e.detail.value
    });
    
  },
  // 微信联系方式
  bindWxNumberInput: function (e) {
    var that = this;
    that.setData({
      wxnumberinput: e.detail.value
    });

  },
  // 单选按钮切换时间
  choose:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    that.setData({
      checkboxindex: index
    });
    console.log(index);
  },
// 病情内容输入框失去焦点时间
  bindContentTextAreaBlur:function(e){
    var that = this;
    var petContent = e.detail.value;
    that.setData({
      petcontent: petContent
    });
  },


  addimg: function () {
    let that = this;
    let imgsLength = that.data.imgList.length;

    if (imgsLength >= 3) return;
    wx.chooseImage({
      count: 3 - imgsLength.length,
      success: function (res) {

        if (imgsLength + res.tempFilePaths.length > 3) return;

        uploadImages(that, res.tempFilePaths);

      },
      fail: function (err) {
        console.error(err);
      }
    })

  },
  // 长按删除图片事件
  deletetempimg: function (e) {

    let that = this;
    let index = e.currentTarget.dataset.index;
    let uploadImgs = that.data.imgList;
    let img_url = uploadImgs[index];
    console.log(img_url);
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
 //提交点击按钮事件
  submit_detail:function(){
      var that = this;
      var cate_name = that.data.petcateinput;// 宠物品种
      if (cate_name == '' || cate_name == null || cate_name == undefined){
        wx.showToast({
          title: '请填宠物品种！',
          icon: 'none',
          duration: 1000,
          mask: true
        })
        return false;
      }
      var birthday = that.data.petbitthday;// 宠物生日
      if (birthday == '' || birthday == null || birthday == undefined) {
        wx.showToast({
          title: '请选择宠物的生日！',
          icon: 'none',
          duration: 1000,
          mask: true
        })
        return false;
      }
      var sex = that.data.sexIndex;//宠物性别
      if (sex == '' || sex == null || sex == undefined) {
        wx.showToast({
          title: '请选择宠物的性别！',
          icon: 'none',
          duration: 1000,
          mask: true
        })
        return false;
      }
      var sterilisate = that.data.bearIndex;// 是否绝育
      if (sex == '' || sex == null || sex == undefined) {
        wx.showToast({
          title: '请选择宠物是否绝育！',
          icon: 'none',
          duration: 1000,
          mask: true
        })
        return false;
      }
      var last_immunedate = that.data.petlastimmune;//上次免疫时间
      if (last_immunedate == '' || last_immunedate == null || last_immunedate == undefined) {
        wx.showToast({
          title: '请选择宠物的上次免疫时间！',
          icon: 'none',
          duration: 1000,
          mask: true
        })
        return false;
      }
      var last_repellantdate = that.data.petlastrepellant;//上次驱虫时间
      if (last_repellantdate == '' || last_repellantdate == null || last_immunedate == undefined) {
        wx.showToast({
          title: '请选择宠物的上次驱虫时间！',
          icon: 'none',
          duration: 1000,
          mask: true
        })
        return false;
      }
      var phone = that.data.phoneinput;//联系方式
      if (phone == '' || phone == null || phone == undefined) {
        wx.showToast({
          title: '请填写联系方式！',
          icon: 'none',
          duration: 1000,
          mask: true
        })
        return false;
      }
      var wx_number = that.data.wxnumberinput;
      if (wx_number == '' || wx_number == null || wx_number == undefined) {
        wx.showToast({
          title: '请填写微信联系方式！',
          icon: 'none',
          duration: 1000,
          mask: true
        })
        return false;
      }
      var eat = that.data.checkboxindex;// 精神，食欲及吃喝拉撒的情况
      if (eat == '' || eat == null || eat == undefined) {
        wx.showToast({
          title: '请选择宠物的异常情况！',
          icon: 'none',
          duration: 1000,
          mask: true
        })
        return false;
      }
      var content = that.data.petcontent;//具体的病情内容
      var userInfo = that.data.userInfo;
      var user_id = userInfo.id;// 用户id
      var account = userInfo.account;// 用户的账号
      var user_name = userInfo.nick_name;// 用户名
      var img_list = JSON.stringify(that.data.imgList);// 上传的图片

      var diseaseInfo = {
        'user_id': user_id,
        'account': account,
        'user_name': user_name,
        'cate_name': cate_name,
        'birthday': birthday,
        'sex': sex,
        'sterilisate': sterilisate,
        'last_immunedate': last_immunedate,
        'last_repellantdate': last_repellantdate,
        'phone': phone,
        'wx_number': wx_number,
        'eat': eat,
        'content':content,
        'img_list': img_list,
      };


      wx.request({
        url: base_url + 'index.php/front/doctor/addDisease',
        data: diseaseInfo,
        method: 'POST',
        success: function (res) {
          if (res.data.errorCode == 0) {//添加病例成功
            wx.navigateTo({
              url: '../petDoctorSuccess/petDoctorSuccess'
            })
           
          }
        }
      })

     
  },

  onShow: function () {
    var that = this;
  },
  onLoad:function(){
    var that = this;
    var userInfo = wx.getStorageSync("userInfo");
    console.log(userInfo);
    that.setData({
      userInfo:userInfo
    });
  },


 







  /**
   * 下拉加载更多标签
   */
  onReachBottom: function () {
    var that = this;
    
  },

  




})
