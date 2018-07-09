// pages/userCenter/addAddress/addAddress.js  
var tcity = require("../../../utils/citys.js");
var CONFIG = require('../../../utils/config.js');
var base_url = CONFIG.API_URL.BASE_URL;
var app = getApp();
var userInfo = '';
var pageType; //pageType = 1 编辑地址  0 新增地址

Page({
    // 数据
    data: {
        // 我的列表数据
        provinces: [],
        province: "",
        citys: [],
        city: "",
        countys: [],
        county: '',
        value: [0, 0, 0],
        values: [0, 0, 0],
        condition: false
    },
    onLoad: function(options) {
        userInfo = wx.getStorageSync('userInfo');
        wx.showLoading({
            title: '加载中...',
            mask: true
        })
        var that = this;
        if (options.id) {//有值传入为编辑地址
            pageType = 1;

            wx.request({
                url: base_url + 'index.php?c=wxApp&a=getAddressById',
                data: options,
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                success: function(res) {
                    wx.hideLoading()
                    // console.log( res )
                    var data = res.data;
                    var city = data.address.city;
                    city = city.split(' ');
                    that.setData({
                        name: data.call_name,
                        phone: data.phone,
                        post: data.post,
                        province: city[0],
                        city: city[1],
                        county: city[2],
                        detail: data.address.detail,
                        wechat_number: data.wechat_number,
                        id: data.id
                    });
                }
            })
        } else {//没值传入为新增地址
            pageType = 0;
        }
        //省市区选择
        tcity.init(that);
        var cityData = that.data.cityData;
        const provinces = [];
        const citys = [];
        const countys = [];

        for (let i = 0; i < cityData.length; i++) {
            provinces.push(cityData[i].name);
        }

        for (let i = 0; i < cityData[0].sub.length; i++) {
            citys.push(cityData[0].sub[i].name)
        }

        for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
            countys.push(cityData[0].sub[0].sub[i].name)
        }

        that.setData({
            'provinces': provinces,
            'citys': citys,
            'countys': countys,
            'province': that.data.province ? that.data.province : cityData[0].name,
            'city': that.data.city ? that.data.city : cityData[0].sub[0].name,
            'county': that.data.county ? that.data.county : cityData[0].sub[0].sub[0].name,
        })
        wx.hideLoading()
        // console.log(that.data.province, that.data.city, that.data.county)
    },
    //监听姓名的输入
    listenerNameInput: function(e) {
        this.data.name = e.detail.value;
    },
    listenerWechatNumberInput:function(e) {
        this.data.wechat_number = e.detail.value;
    },
    //监听邮编的输入
    listenerPostInput: function(e) {
        this.data.post = e.detail.value;
    },
    //监听手机号的输入
    listenerPhoneInput: function(e) {
        this.data.phone = e.detail.value;
    },
//监听省市区的输入
    bindRegionChange: function(e) {
        this.setData({
            region: e.detail.value
        })
    },
    //监听手机号的输入
    listenerDetailInput: function(e) {
        this.data.detail = e.detail.value;
    },

    saveAddress: function(e) {
        var that = this;
        var phone = that.data.phone;
        var name = that.data.name;
        var detail = that.data.detail;
        var wechat_number = that.data.wechat_number;
        if (phone == null || phone == '') {
            wx.showToast({
                title: '手机号不能为空',
                image: '../../../static/images/my/error_tip.png',
                duration: 1000
            });
            return false;
        }
        if (wechat_number == null || wechat_number == '') {
            wx.showToast({
                title: '微信号不能为空',
                image: '../../../static/images/my/error_tip.png',
                duration: 1000
            });
            return false;
        }
        if (name == null || name == '') {
            wx.showToast({
                title: '收货人不能为空',
                image: '../../../static/images/my/error_tip.png',
                duration: 1000
            });
            return false;
        }
        if (detail == null || detail == '') {
            wx.showToast({
                title: '地址不能为空',
                image: '../../../static/images/my/error_tip.png',
                duration: 1000
            });
            return false;
        }
        if (!(/^[0-9]*$/.test(phone))) {
            wx.showToast({
                title: '手机号必须为数字',
                image: '../../../static/images/my/error_tip.png',
                duration: 1000
            });
            return false;
        }
        var id = e.currentTarget.dataset.id;
        var address = that.data.province + ' ' + that.data.city + ' ' + that.data.county;
//     var area = "";
//     for (let m = 0; m < address.length; m++) {
//       if (m == address.length - 1) {
//         area += address[m];
//       } else {
//         area += address[m] + ' ';
//       }
//     }
        var myData = {
            user_id: userInfo.id,
            phone: that.data.phone,
            post: that.data.post,
            call_name: that.data.name,
            addr: address,
            detail: that.data.detail,
            wechat_number: that.data.wechat_number,
            id: id
        };

        console.log('myData:', myData);

        if (pageType) {//编辑地址
            // myData.id = that.data.id;
            var url = base_url + 'index.php?c=wxApp&a=updateAddress';
        } else {//新增地址
            var url = base_url + 'index.php?c=wxApp&a=insertAddress';
        }
        // console.log(url);
        wx.request({
            url: url,
            data: myData,
            method: 'GET',
            success: function(res) {
                wx.showToast({
                    title: '保存成功',
                    icon: 'success',
                    duration: 1500,
                });
                setTimeout(function() {
                    wx.navigateBack(1);
                }, 1500)
            }
        })
    },

    /**
     * 选择省市区
     */
    bindChange: function(e) {
        //console.log(e);
        var val = e.detail.value
        var t = this.data.values;
        var cityData = this.data.cityData;

        if (val[0] != t[0]) {
            console.log('province no ');
            const citys = [];
            const countys = [];

            for (let i = 0; i < cityData[val[0]].sub.length; i++) {
                citys.push(cityData[val[0]].sub[i].name)
            }
            for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
                countys.push(cityData[val[0]].sub[0].sub[i].name)
            }

            this.setData({
                province: this.data.provinces[val[0]],
                city: cityData[val[0]].sub[0].name,
                citys: citys,
                county: cityData[val[0]].sub[0].sub[0].name,
                countys: countys,
                values: val,
                value: [val[0], 0, 0],
            })
            return;
        }
        if (val[1] != t[1]) {
            console.log('city no');
            const countys = [];

            for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
                countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
            }

            this.setData({
                city: this.data.citys[val[1]],
                county: cityData[val[0]].sub[val[1]].sub[0].name,
                countys: countys,
                values: val,
                value: [val[0], val[1], 0]
            })
            return;
        }
        if (val[2] != t[2]) {
            console.log('county no');
            this.setData({
                county: this.data.countys[val[2]],
                values: val
            })
            return;
        }
    },

    /**
     * 关闭弹框
     */
    open: function() {
        this.setData({
            condition: !this.data.condition
        })
    },
})