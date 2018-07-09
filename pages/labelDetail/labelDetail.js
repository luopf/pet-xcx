// page/one/index.js
var CONFIG = require('../../utils/config.js');
var Fun = require('../../utils/common.js');
var base_url = CONFIG.API_URL.BASE_URL;
//页面初始化数据
var is_more = true;  //数据还能不能加载了了  
var get_info = "正在加载中..";//加载提示 正在加载中 下拉加载更多 没有更多了
var lid = "";   //分类id
var pageIndex = 1;
var pageSize = 6;
Page({
    data: {
        open: false,
        mark: 0,
        newmark: 0,
        startmark: 0,
        endmark: 0,
        windowWidth: wx.getSystemInfoSync().windowWidth,
        staus: 1,
        translate: '',
        base_url: base_url,
        list: [],
        pageIndex: 1,
        pageSize: 6,
        templateData: {loadingBall: 1}
    },

    onLoad: function(options) {
        var that = this;
        that.login();
        let pageTitle = options.pageTitle || '专题详情';
        wx.setNavigationBarTitle({title: pageTitle}); //设置导航标题
        lid = options.lid;
        let cData = {id: lid};
        Fun.CurlPaging(that, base_url + '/index.php?c=wxApp&a=pagingLabelGoods', cData, false);
        wx.request({
            url: base_url + '/index.php?c=wxApp&a=labelDetail',
            data: {id: lid},
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res) {
                let labelInfo = res.data.data;
                // success
                that.setData({
                    label_img: labelInfo.image,
                    desc: labelInfo.detail
                });
            },
            fail: function() {
                // fail
            },
            complete: function() {
                // complete
            }
        })
    },

    onShow: function(options) {
        //   在页面展示之后先获取一次数据
        var that = this;
        pageIndex = 1;   //没次进入页面的时候 因为有缓存 要重新赋值

        that.setData({
            title: '商品分类'
        });
    },

    onReachBottom: function() {
        var that = this;
        let cData = {id: lid};
        Fun.CurlReachBottom(that, cData);
    },


    // 跳转到商品详情页
    goodsDetail: function(data) {
        wx.navigateTo({url: '../goods/goodsDetail/goodsDetail?gid=' + data.currentTarget.dataset.id});
    },

    //选择分类加载
    tap_goodsCategory: function(e) {
        cid = e.currentTarget.dataset.id;
        var rank_name = e.currentTarget.dataset.rank;
        var that = this;
        page = 0;   //没次进入页面的时候 因为有缓存 要重新赋值
        pagingCateGoods(that);
        that.setData({
            title: rank_name
        });
    },
    onShareAppMessage: function(res) {
        let that = this;
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: that.data.goodsInfo.name,
            path: 'pages/goods/goodsDetail/goodsDetail?gid=' + that.data.goodsInfo.id,
            success: function(res) {
                // 转发成功
            },
            fail: function(res) {
                // 转发失败
            }
        }
    },
    login: function() {
        // if(wx.getStorageSync('thirdRD_session')) return;
        //获取用户信息
        var that = this;
        wx.login({
            success: function(res) {
                var code = res.code;
                wx.request({
                    url: base_url + 'index.php?c=wxApp&a=wx_login',
                    data: {
                        js_code: code
                    },
                    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                    // header: {}, // 设置请求的 header
                    success: function(res) {

                        var data = res.data;
                        console.log(data);
                        wx.setStorageSync('thirdRD_session', data);
                        wx.getUserInfo({
                            success: function(res) {
                                // success
                                var encryptedData = res.encryptedData;
                                var iv = res.iv;  //加密算法的初始向量
                                var thridRDSession = wx.getStorageSync('thirdRD_session');

                                wx.request({
                                    url: base_url + 'index.php?c=wxApp&a=decryptUserInfo&thridRDSession=' + thridRDSession + "&encryptedData=" + encryptedData + "&iv=" + iv,
                                    data: {
                                        thridRDSession: thridRDSession,
                                        encryptedData: encryptedData,
                                        iv: iv
                                    },
                                    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                                    header: {
                                        'content-type': 'application/json'
                                    }, // 设置请求的 header
                                    success: function(res) {

                                        if (userInfo != "" || userInfo != null) {
                                            var ws = res.data;
                                            var json = ws.replace(/^[\s\uFEFF\xa0\u3000]+|[\uFEFF\xa0\u3000\s]+$/g, "");

                                            var userInfo = JSON.parse(json);

                                            wx.setStorage({
                                                key: "userInfo",
                                                data: userInfo
                                            });
                                            // that.getCartGoodsCount();
                                        }

                                        // success
                                    },
                                    fail: function() {
                                        // fail
                                    },
                                    complete: function() {
                                        // complete
                                    }
                                })

                            },
                            fail: function() {
                                // fail
                            },
                            complete: function() {
                                // complete
                            }
                        })
                        // success
                    },
                    fail: function() {
                        // fail
                    },
                    complete: function() {
                        // complete
                    }
                })
                // success
            },
            fail: function() {
                // fail
            },
            complete: function() {
                // complete
            }
        })
    },
});