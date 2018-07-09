/**
 * 我的订单列表页
 * @author micheal
 * @since 2017-01-18
 */
var CONFIG = require('../../../utils/config.js');
var app = getApp();
var base_url = CONFIG.API_URL.BASE_URL;
var userInfo = '';
//页面初始化数据
var page = 1;
var pageSize = 6;
var allPages = 0;
// var get_info = "正在加载中..";//加载提示 正在加载中 下拉加载更多 没有更多了
var state = '';   //订单状态
var tem_id; //待处理订单的id
var optionData = '';

// 获取数据
var GetList = function(that) {
    wx.request({
        url: base_url + 'index.php?c=wxApp&a=pagingOrder',
        data: {
            pageIndex: page,
            pageSize: pageSize,
            state: '',
            account: userInfo.account
        },

        success: function(res) {
            //   console.log(res, 'res');
            var dataList = res.data.data.orderList;
            //   console.log(dataList, 'order_state');
            allPages = res.data.data.pageInfo.all_pages;
            var list = that.data.list;
            for (var i = 0; i < dataList.length; i++) {
                dataList[i].add_time = dataList[i].add_time.substring(0, 10);
                var type = dataList[i].pay_method;
                if (type == 0 || type == 1) {
                    var order_state = dataList[i].state;

                    switch (order_state) {//得到不同订单状对应的 操作和 状态文字
                        case '0':
                            dataList[i]['state_text'] = "待付款";
                            dataList[i]['option'] = 'cancel_order';
                            dataList[i]['options'] = 'pay_order';
                            dataList[i]['btn_hidden'] = true;
                            dataList[i]['option_texts'] = '立即支付';
                            dataList[i]['option_text'] = '取消订单';
                            break;
                        case '1':
                            dataList[i]['state_text'] = "待发货";
                            dataList[i]['option'] = 'confirm_order';
                            dataList[i]['option_text'] = '确认收货';
                            break;
                        case '2':
                            dataList[i]['state_text'] = "待收货";
                            dataList[i]['option'] = 'confirm_order';
                            dataList[i]['option_text'] = '确认收货';
                            break;
                        case '3':
                            dataList[i]['state_text'] = "已收货";
                            dataList[i]['option'] = 'success_order';
                            dataList[i]['option_text'] = '完成交易';
                            break;
                        case '4':
                            dataList[i]['state_text'] = "交易关闭";
                            dataList[i]['option'] = 'delete_order';
                            dataList[i]['option_text'] = '删除订单';
                            break;
                        case '5':
                            // dataList[i]['btn_hidden'] = true;
                            dataList[i]['state_text'] = "交易完成";
                            dataList[i]['option'] = 'delete_order';
                            dataList[i]['option_text'] = '删除订单';
                            // dataList[i]['options'] = 'send_comment';
                            // dataList[i]['option_texts'] = '立即评价';
                            break;
                        case '6':
                            dataList[i]['state_text'] = "退款中";
                            break;
                        case '7':
                            dataList[i]['state_text'] = "退款完成";
                            dataList[i]['option'] = 'delete_order';
                            dataList[i]['option_text'] = '删除订单';
                            break;
                        case '8':
                            dataList[i]['state_text'] = "已评价";
                            dataList[i]['option'] = 'delete_order';
                            dataList[i]['option_text'] = '删除订单';
                            break;
                        default:
                            dataList[i]['state_text'] = "异常订单";
                            dataList[i]['option'] = 'delete_order';
                            dataList[i]['option_text'] = '删除订单';
                    }
                } else {
                    var order_state = dataList[i].state;
                    switch (order_state) {
                        case '0':
                            dataList[i]['state_text'] = "待付款";
                            dataList[i]['option'] = 'cancel_order';
                            dataList[i]['options'] = 'pay_order';
                            dataList[i]['btn_hidden'] = true;
                            dataList[i]['option_texts'] = '立即支付';
                            dataList[i]['option_text'] = '取消订单';
                            break;
                        case '1':
                            dataList[i]['state_text'] = "待发货";
                            dataList[i]['option'] = 'confirm_order';
                            dataList[i]['option_text'] = '确认收货';
                            break;
                        case '2':
                            dataList[i]['state_text'] = "已发货";
                            dataList[i]['option'] = 'confirm_order';
                            dataList[i]['option_text'] = '确认收货';
                            break;
                        case '3':
                            dataList[i]['state_text'] = "已收货";
                            dataList[i]['option'] = 'success_order';
                            dataList[i]['option_text'] = '完成交易';
                            break;
                        case '4':
                            dataList[i]['state_text'] = "交易关闭";
                            dataList[i]['option'] = 'delete_order';
                            dataList[i]['option_text'] = '删除订单';
                            break;
                        case '5':
                            // dataList[i]['btn_hidden'] = true;
                            dataList[i]['state_text'] = "交易完成";
                            dataList[i]['option'] = 'delete_order';
                            dataList[i]['option_text'] = '删除订单';
                            // dataList[i]['options'] = 'send_comment';
                            // dataList[i]['option_texts'] = '立即评价';
                            break;
                        case '8':
                            dataList[i]['state_text'] = "已评价";
                            dataList[i]['option'] = 'delete_order';
                            dataList[i]['option_text'] = '删除订单';
                            break;
                        default:
                            dataList[i]['state_text'] = "异常订单";
                            dataList[i]['option'] = 'delete_order';
                            dataList[i]['option_text'] = '删除订单';

                    }

                }
                list.push(dataList[i]);
            }
            // console.log('list:', list);
            that.setData({list: list,});
            page++;
        }
    });
}

var checkLogin = function(that) {
    if (that.data.is_login == '0') { // 没有登录就去登录
        wx.navigateTo({
            url: '../../login/login'
        });
    }
}

Page({
    data: {
        headerBgOpacity: 0,
        base_url: base_url,
        list: [],
        currentTab: 99,
        is_navigate: false
    },

    onLoad: function(options) {
        var that = this;
        userInfo = wx.getStorageSync('userInfo');

        optionData = options;
        state = optionData.currentTab;
        that.setData({currentTab: state});
        state = state == 99 ? '' : state;
    },

    //重置分页
    onUnload: function(data) {
        page = 1;
        pageSize = 6;
        allPages = 0;
        this.setData({
            list: [],
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        var that = this;
        //设置底部导航信息：
        let cartGoodsCount = wx.getStorageSync('cartGoodsCount');
        let nav_active = {
            home: '',
            circle: '',
            center: 'active',
            img:cartGoodsCount.img
        };
        userInfo = wx.getStorageSync('userInfo');
        that.setData({
            nav_active:nav_active,
            is_login: userInfo.type,
            list: []
        });

        page = 1;
        allPages = 0;
        checkLogin(that);
        if(userInfo.type != '0'){ //已经登录
            GetList(that);
        }
    },

    /**
     * 触底加载
     */
    onReachBottom: function(options) {
        var that = this;
        if (page > allPages) {
            return false;
        } else {
            GetList(that);
        }
    },


    //点击导航
    swichNav: function(e, options) {
        var that = this;
        state = e.currentTarget.dataset.current;
        //设置页面显示样式 分页数据初始化
        that.setData({currentTab: state, list: []});
        state = state == 99 ? '' : state;
        page = 1;
        GetList(that);
    },

    //删除订单
    delete_order: function(event) {
        var oid = event.currentTarget.dataset.id;  //待处理订单id
        var index = event.currentTarget.dataset.index;  //待处理订单id
        var dataList = this.data.list;
        var that = this;
        wx.showModal({
            title: '提示',
            content: '确认删除吗?',
            success: function(res) {
                if (res.confirm) {
                    wx.request({
                        url: base_url + 'index.php?c=wxApp&a=deleteOrder',
                        data: {id: oid},
                        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                        // header: {}, // 设置请求的 header
                        success: function(res) {
                            wx.showToast({
                                title: '删除成功',
                                icon: 'success',
                                duration: 2000
                            });
                            dataList.splice(index, 1);
                            if (dataList.length == 0) {
                                that.setData({
                                    list: []
                                });
                            } else {
                                that.setData({
                                    list: dataList
                                });
                            }
                        },
                        fail: function() {
                            // fail
                        },
                        complete: function() {
                            // complete
                        }
                    })

                } else if (res.cancel) {
                    // console.log('用户点击取消')
                }
            }
        })


    },
    //取消删除订单
    // cancel_delete_order: function (event) {
    //   this.setData({
    //     model_hidden: true
    //   });
    // },
    //确认删除订单
    // confrim_delete_order: function (event) {
    //   var that = this;
    //   wx.request({
    //     url: base_url + 'index.php?c=wxApp&a=deleteOrder',
    //     data: { id: tem_id },
    //     method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //     // header: {}, // 设置请求的 header
    //     success: function (res) {
    //       that.setData({
    //         model_hidden: true,  //隐藏确认框
    //         toast_hidden: false, //显示提示框
    //         toast_info: '操作成功',
    //         toast_open: 'toast_open'
    //       });
    //     },
    //     fail: function () {
    //       // fail
    //     },
    //     complete: function () {
    //       // complete
    //     }
    //   })
    // },


    //取消订单
    cancel_order: function(event) {
        var that = this;
        tem_id = event.currentTarget.dataset.id;  //待处理订单id
        setOrderState(that, 4);
    },
    //立即支付
    pay_order: function(event) {
        var oid = event.currentTarget.dataset.id;
        wx.navigateTo({url: "./../../order/paymentOrder/paymentOrder?oid=" + oid});
    },
    //申请退款
    refund_order: function(event) {
        var that = this;
        tem_id = event.currentTarget.dataset.id;  //待处理订单id
        setOrderState(that, 6);
    },
    //确认收货
    confirm_order: function(event) {
        var that = this;
        tem_id = event.currentTarget.dataset.id;  //待处理订单id
        setOrderState(that, 3);
    },
    //交易完成
    success_order: function(event) {
        var that = this;
        tem_id = event.currentTarget.dataset.id;  //待处理订单id
        setOrderState(that, 5);
    },

    //立即评价
    send_comment: function(event) {
        var oid = event.currentTarget.dataset.id;
        wx.navigateTo({url: "../../comment/comment?oid=" + oid});
    },
    // //操作成功之后
    // toast_open: function (event) {
    //   var that = this;
    //   is_more = true;
    //   page = 1;
    //   that.setData({
    //     toast_hidden: true,
    //     list: [],
    //     scrollTop: 0
    //   });
    //   GetList(that);
    // },
    // 跳转到订单详情页
    // orderDetail: function (data) {
    //   wx.navigateTo({ url: './../../order/orderDetail/orderDetail?id=' + data.currentTarget.dataset.id });
    // },
    // 跳转到商品详情页
    // goodsDetail: function (data) {
    //   wx.navigateTo({ url: './../../goods/goodsDetail/goodsDetail?id=' + data.currentTarget.dataset.id });
    // }

    myCoupon: function() {
        wx.navigateTo({
            url: '../../coupon/myCoupon/myCoupon'
        });
    },

    makePhoneCall: function(e) {
        var that = this;
        wx.request({
            url: base_url + 'index.php?c=wxApp&a=getServerPhone',
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
        // console.log('type:', userInfo.type);
        userInfo.type = 0;
        // console.log('userInfo:', userInfo);
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
                        wx.navigateTo({url: '../../login/login'});
                    },
                })
            }
        })
    },
    goodsDetail:function (data) {
        let gid = data.currentTarget.dataset.gid;
        wx.navigateTo({
            url:'/pages/goods/goodsDetail/goodsDetail?gid='+gid,
        })
    }

})

/**
 * 修改订单状态
 */
function setOrderState(that, status, options) {
    wx.request({
        url: base_url + 'index.php?c=wxApp&a=setOrderState',
        data: {id: tem_id, state: status},
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function(res) {
            page = 1;
            that.setData({
                list: [],
                tem_id: tem_id,
                status: status,
                res: res
            });
            GetList(that);
        },
        fail: function() {
            // fail
        },
        complete: function() {
            // complete
        }
    })

}
