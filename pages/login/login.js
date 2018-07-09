var CONFIG = require('../../utils/config.js');
// var WxParse = require('../../../wxParse/wxParse.js');
var app = getApp();
var base_url = CONFIG.API_URL.BASE_URL;
var userInfo = '';
var canClick = true;//是否能获取验证码
Page({
    data: {
        base_url: base_url,
        getNum: "获取验证码",
    },

    onLoad: function() {
        var that = this;
        userInfo = wx.getStorageSync('userInfo');
        that.setData({user_id: userInfo.id})
    },


    /**
     * 获取input输入值 手机号
     */
    getPhone: function(e) {
        let that = this;
        let value = e.detail.value;
        that.setData({
            phone: value
        })
    },

    /**
     * 获取input输入值 手机号
     */
    getWechatNumber: function(e) {
        let that = this;
        let value = e.detail.value;
        console.log('value:', value);
        that.setData({
            wechat_number: value
        })
    },

    /**
     * 获取input输入值 验证码
     */
    getCode: function(e) {
        let that = this;
        let value = e.detail.value;
        that.setData({
            code: value
        })
    },
    /**
     * 获取input输入值 密码
     */
    getPass: function(e) {
        let that = this;
        let value = e.detail.value;
        that.setData({
            password: value
        })
    },

    /**
     * 获取验证码
     */
    sendPcode: function(e) {
        let that = this;
        let phone = that.data.phone;
        if (phone == null || phone == '') {
            wx.showToast({
                title: '手机号不能为空',
                icon: 'loading',
                duration: 2000
            });
            return false;
        }
        if (canClick) {
            wx.request({
                url: base_url + 'index.php?c=wxApp&a=sendPhoneVerifyNumber',
                method: "GET",
                data: {
                    phone: that.data.phone,
                },
                success: function(res) {
                    console.log('res:', res);
                    if (res.data.errorCode == 0) {
                        var codeValue = res.data.data;
                        that.setData({
                            pcode: codeValue
                        });
                        canClick = false;
                        var countNum = 30;//设置倒计时
                        var timer = setInterval(function() {
                            countNum--;
                            that.setData({
                                getNum: countNum + 's后重发'
                            });
                            //倒计时结束后显示重新发送
                            if (countNum < 0) {
                                clearInterval(timer);
                                canClick = true;
                                that.setData({
                                    getNum: "重新发送"
                                });
                            }
                        }, 1000);
                    } else {
                        wx.showToast({
                            title: '验证码获取失败',
                            icon: 'loading',
                            duration: 2000
                        });
                    }
                }
            });
        }
    },

    //提交注册
    register: function() {
        var that = this;
        var phone = that.data.phone;
        var code = that.data.code;
        var password = that.data.password;
        var pcode = that.data.pcode;

        if (phone == null || phone == '') {
            wx.showToast({
                title: '手机号不能为空',
                icon: 'loading',
                duration: 2000
            });
            return false;
        }

        if (code == null || code == '') {
            wx.showToast({
                title: '验证码不能为空',
                icon: 'loading',
                duration: 2000
            });
            return false;
        }

        if (pcode != code) {
            wx.showToast({
                title: code + '验证码错误' + pcode,
                icon: 'loading',
                duration: 2000
            });
            return false;
        }

        //注册
        wx.request({
            url: base_url + 'index.php?c=wxApp&a=register',
            method: "GET",
            data: {
                phone: that.data.phone,
                code: that.data.code,
                password: that.data.password,
                user_id: that.data.user_id,
            },
            success: function(res) {
                if (res.data.errorCode == 0) {
                    wx.showToast({
                        title: '登录成功',
                        icon: 'success',
                        duration: 2000
                    });
                    var info = userInfo;
                    info.type = 1;
                    wx.setStorage({
                        key: 'userInfo',
                        data: info,
                        success: function () {
                            wx.navigateBack();
                        }
                    })

                    return false;

                } else if (res.data.errorCode == 2) {
                    wx.showToast({
                        title: res.data.data,
                        icon: 'loading',
                        duration: 2000
                    });
                    return false;
                }
            }
        })
    }


});
