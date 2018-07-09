var app = getApp()
Page({
    data: {
        motto: 'Hello WeApp',
        userInfo: {},
        phoneWarning: "",
    },
    onButtonTap: function() {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    listenerPhoneInput: function (e) {
       this.data.phone = e.detail.value;
       if (this.data.phone.length > 11 ) {
           this.setData({phoneWarning:'手机号码输入有误'});
       } else {
           this.setData({phoneWarning:''});
       }
    },
    getSmsCode:function(e) {

    },
    onLoad: function () {
        var that = this;
        //登录
        wx.login({
            success: function () {
                wx.getUserInfo({
                    success: function (res) {
                        that.setData({userInfo: res.userInfo})
                        that.update()
                    }
                })
            },
            fail: function (res) {
                console.log(res)
            }
        });
    }
})
