// pages/order/confirmOrder/confirmOrder.js
var CONFIG = require('../../../utils/config.js');
var app = getApp();
var base_url = CONFIG.API_URL.BASE_URL;
var userInfo = '';
var myData = '';
var bTop = 'true'; //是否可以下拉加载
var optionsData = ''; //传递的参数
var exitDown = 1; //是否存在下架商品 1不存在 0存在
var addrInfo = 1; //地址信息是否存在 0不存在 1存在
var sub = false;
//加载页面 获取数据
var loadPage = function(that, options) {
    if (optionsData) {
        myData = options;
        myData.id = userInfo.id;
        wx.request({
            url: base_url + 'index.php?c=wxApp&a=getConfrimOderData',
            data: myData,
            method: 'GET',
            success: function(res) {
                //获取到默认地址
                var addressList = res.data.addressList;
                if (addressList.length > 0) {
                    for (var i = 0; i < addressList.length; i++) {
                        if (addressList[i].is_default == 1) {
                            that.setData({address: addressList[i]});
                            break;
                        }
                    }
                } else {

                }
                //获取运费 总金额
                if (res.data.orderFee) {
                    that.setData({
                        orderFee: res.data.orderFee,
                        totalPrice: (Number(res.data.orderFee) + Number(res.data.sum)).toFixed(2)
                    });
                } else {
                    that.setData({totalPrice: (Number(res.data.sum)).toFixed(2)});
                }

                //获取优惠券信息 可用
                if (res.data.coupon.length > 0) {
                    var payCoupon = [];
                    for (var i = 0; i < res.data.coupon.length; i++) {
                        if (Number(res.data.sum) >= res.data.coupon[i].condition_value) {
                            payCoupon.push(res.data.coupon[i]);
                        }
                    }
                    //加入不使用优惠券
                    // payCoupon.push({ name: '不使用优惠券', value: 0, coupon_id: 0 });
                    that.setData({coupon: payCoupon});
                }

                //获取商品信息
                var goodsList = res.data.data;

                that.setData({
                    base_url: base_url,
                    goodsList: res.data.data,
                    realPrice: res.data.coupon.length > 0 ? (res.data.sum - Number(res.data.coupon[that.data.selectCoupon].value)).toFixed(2) : res.data.sum,
                    coupon_name: res.data.coupon.length > 0 ? '-￥' + Number(res.data.coupon[that.data.selectCoupon].value).toFixed(2) : '暂无可用优惠券',
                    sum: res.data.sum.toFixed(2)
                });
                console.log('res:', res);
                console.log('res.data.totalPrice:', res.data.totalPrice);
                console.log(':', res.data.coupon.length > 0);
                console.log('that.data.realPrice:', that.data.realPrice);
            }
        })
    }
};

Page({
    data: {
        index: 0,
        tipHidden: true,
        maskHidden: true,
        selectCoupon: 0,
        isRead: true,
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        optionsData = options;
        // loadPage(that,options);
        //来自购物车，设置购物车data
        if (optionsData.cgids) {
            that.setData({cgids: optionsData.cgids});
        }
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        var that = this;
        userInfo = wx.getStorageSync('userInfo');
        that.setData({
            maskHidden: true,
            selectCoupon: 0,
            is_login: userInfo.type
        });
        
        loadPage(that, optionsData);
    },

    /**
     * 页面隐藏
     */
    onHide: function(){
        console.log('隐藏了');
        this.setData({tipHidden: true});
        
    },

    /**
     * 刷新页面
     */
    refresh: function(e) {
        var that = this;
        wx.request({
            url: base_url + 'index.php?c=wxApp&a=getConfrimOderData',
            data: myData,
            method: 'GET',
            success: function(res) {
                that.setData({
                    base_url: base_url,
                    goodsList: res.data.data,
                    sum: res.data.sum,
                    addressList: res.data.addressList,
                });
            }
        })
    },

    /**
     * 提交订单
     */
    submitOrder: function(e) {
        var that = this;
        var index = that.data.selectCoupon;
        var coupon = that.data.coupon;
        var couponId = 0;

        // 是否阅读协议
        if (!that.data.isRead) {
            wx.showToast({
                title: '请接受协议及须知',
                image: '../../../static/images/my/error_tip.png',
                duration: 1000
            });
            return false;
        }

        console.log('that.data.coupon:', that.data.coupon);
        if (that.data.coupon && that.data.coupon.length > 0) {
            if (index != -1) {
                couponId = coupon[index].coupon_id;
            }
        }

        if (that.data.coupon) {
            var couponId = couponId;
        }

        //判断用户是否注册
        wx.request({
            url: base_url + 'index.php?c=wxApp&a=getUserInfo',
            data: {
                id: userInfo.id,
            },
            method: 'GET',
            success: function(res) {
                var data = res.data.data;
                if (data.type == 1) {
                    //定义要提交的数据
                    var subData = {};
                    //用户信息
                    subData.user_id = userInfo.id;
                    subData.account = userInfo.account;
                    subData.nick_name = userInfo.nick_name;
                    subData.head_img_url = userInfo.head_img_url;
                    subData.couponId = couponId ? couponId : 0;
                    // console.log(couponId, 'couponId');
                    //地址
                    var addr = that.data.address;
                    if (typeof(addr) != 'undefined') {
                        var address = that.data.address;
                        subData.addressText = address.call_name + '--' + address.phone + '--' + address.wechat_number + '--' + address.address.city + address.address.detail;
                        subData.addressJson = JSON.stringify({
                            "call_name": address.call_name,
                            "phone": address.phone,
                            "wechat_number": address.wechat_number,
                            "address": (address.address.city + address.address.detail)
                        });
                    } else {
                        wx.showToast({
                            title: '请完善收货地址',
                            image: '../../../static/images/my/error_tip.png',
                            duration: 1000
                        })
                        return false;
                    }
                    //留言信息
                    if (that.data.message) {
                        subData.message = that.data.message;
                    }
                    //gids ,gpids, counts
                    var subGids = [];
                    var subGpids = [];
                    var subCounts = [];
                    for (var i = 0; i < that.data.goodsList.length; i++) {
                        if (that.data.goodsList[i].updown == 1) {
                            subGids.push(that.data.goodsList[i].id);
                            subGpids.push(that.data.goodsList[i].property.id);
                            subCounts.push(that.data.goodsList[i].goods_count);
                        }
                    }
                    if (subGids.length == 0) {
                        wx.showToast({
                            title: '商品已下架',
                            image: '../../../static/images/my/error_tip.png',
                            duration: 1000
                        })
                    } else {
                        subData.gids = subGids.join(',');
                        subData.gpids = subGpids.join(',');
                        subData.counts = subCounts.join(',');
                    }
                    //来自购物车
                    if (that.data.cgids) {
                        subData.cgids = that.data.cgids;
                    }

                    wx.request({
                        url: base_url + 'index.php?c=wxApp&a=addOrder',
                        data: subData,
                        method: 'GET',
                        success: function(res) {
                            var oid = res.data.data.addOrderId;
                            if (res.data.errorCode == 0) {
                                wx.navigateTo({
                                    url: '../paymentOrder/paymentOrder?oid=' + oid,
                                });
                            } else {
                                wx.showToast({
                                    title: 'uu',
                                    image: '../../../static/images/my/error_tip.png',
                                    duration: '1000'
                                })
                            }

                        }
                    });
                } else {
                    that.setData({tipHidden: false});
                }
            }
        })
    },

    addressList: function(e) {//地址列表
        wx.navigateTo({
            url: '../../userCenter/addressList/addressList'
        })
    },
    goCart: function(e) {//去购物车
        wx.reLaunch({
            url: '../../cart/cart'
        })
    },

    /**
     * 选择优惠券
     */
    getcoupon: function(e) {
        var that = this;
        that.setData({
            index: e.detail.value,
            realPrice: (that.data.totalPrice - Number(that.data.coupon[e.detail.value].value)).toFixed(2)
        })
        console.log(e.detail.value)
    },

    /**
     * 选择地址
     */
    selectAddress: function() {
        wx.navigateTo({
            url: '../../userCenter/addressList/addressList',
        })
    },

    /**
     * 添加地址
     */
    addAddress: function () {
      wx.navigateTo({
          url:'../../userCenter/addAddress/addAddress',
      });
      return false;
    },

    /**
     * 获取留言信息
     */
    messageCont: function(e) {
        this.setData({message: e.detail.value});
    },

    /**
     * 关闭弹框
     */
    offTip: function() {
        this.setData({tipHidden: true})
    },
    /**
     * 注册
     */
    goRegister: function() {
        wx.navigateTo({
            url: '../../login/login',
        })
    },

    /**
     * 关闭选择一优惠券弹层
     */
    offMask: function() {
        this.setData({maskHidden: true});
    },

    /**
     * 打开优惠券弹框
     */
    useCoupon: function() {
        var that = this;
        that.setData({maskHidden: false})
    },

    /**
     * 选择优惠券
     * @param e
     * @param data
     */
    checkCoupon: function(e, data) {
        var that = this;
        var index = e.currentTarget.dataset.index;//获取当前index
        var coupon_name;
        var realPrice;
        console.log('e:', e);
        console.log('that.data:', that.data);
        console.log('coupon:', that.data.coupon);
        if (index != '-1') {
            coupon_name = '-￥' + that.data.coupon[index].value;
            realPrice = (that.data.totalPrice - Number(that.data.coupon[index].value)).toFixed(2)
        } else {
            coupon_name = '不使用优惠券';
            realPrice = that.data.totalPrice;
        }
        that.setData({
            index: e.detail.value,
            realPrice: realPrice,
            selectCoupon: index,
            coupon_name: coupon_name,
        });
    },

    readProtocol: function(e) {
        var that = this;
        var is_read = e.currentTarget.dataset.index;
        that.setData({
            isRead: !is_read
        })
    },

    gotoProtocol:function(e) {
        var that = this;
        wx.navigateTo({
            url:'../../protocol/protocol',
        });
    },

    makePhoneCall: function(e) {
        var that = this;
        wx.request({
            url: base_url + 'index.php?c=wxApp&a=getServerPhone', //仅为示例，并非真实的接口地址
            data: {},
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function(res) {
                wx.makePhoneCall({
                    phoneNumber: res.data.data.item_value,
                    success: function() {
                    }
                })
            },
        })
    },

    logout: function() {
        var that = this;
        var userInfo = wx.getStorageSync('userInfo');
        console.log('type:', userInfo.type);
        userInfo.type = 0;
        console.log('userInfo:', userInfo);
        wx.setStorage({
            key: 'userInfo',
            data: userInfo,
            success: function() {
                wx.request({
                    url: base_url + 'index.php?c=wxApp&a=logout',
                    data: {account:userInfo.account},
                    header: {
                        'content-type': 'application/json' // 默认值
                    },
                    success: function(res) {
                        that.setData({is_login: 0});
                        // wx.navigateTo({url: '../../login/login'});
                    },
                })
            }
        })
    }

})


