var CONFIG = require('../../utils/config.js');
var base_url = CONFIG.API_URL.BASE_URL;
var app = getApp()
Page({
  data: {
    motto: 'Hello WeApp',
    userInfo: {},
    base_url: base_url,
    token:'',

  },
  formSubmit:function(e){
    let fromid = e.detail.formId;
  
    wx.request({
      url: base_url +'index.php/admin/Test/sendTempleMess',
      data: {form_id: fromid},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {

        console.log(res,'成功');

      },
      fail: function (error) {

        console.log(error,'失败');
      },

    })

  },
  onLoad:function(){

  },
  onShow:function(){},
  
  
  
})
