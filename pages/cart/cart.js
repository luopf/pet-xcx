// 购物车页面
var CONFIG = require('../../utils/config.js');
var app = getApp();
var base_url = CONFIG.API_URL.BASE_URL;
var userInfo = "";
userInfo = '';
//获取从购物车删除商品下标
var test=function(t,arr){
      var f = 0;
      for (var j = 0; j < arr.length; j++){
            if(t == arr[j]){
              f = 1;
              break;
            }
      }
      return f;
}

Page({
  data: {
    base_url: base_url,
    con: true,
    selectAll: true,
    editEnd:1,
    editEndText:'编辑',
    btnTexts: 1,
    // nav_active: {
    //   home: '',
    //   circle: 'active',
    //   center: ''
    // },
  },
  onLoad: function () {
    var that = this;
    // console.log(userInfo.account)
    userInfo = wx.getStorageSync('userInfo');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function ( ) {
    var that = this;
    //设置底部导航信息：
    let cartGoodsCount = wx.getStorageSync('cartGoodsCount');
    let nav_active = {
      home: '',
      circle: 'active',
      center: '',
      img:cartGoodsCount.img
    };
    that.setData({nav_active:nav_active});
    console.log('nav_active:', nav_active);

    wx.request({
      url: base_url + 'index.php?c=wxApp&a=cartList',
      data: { account: userInfo.account },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        var dataList = res.data.data.dataList;
        console.log('dataList', dataList);
        var sum = 0; //购物车总价 不包含下架商品
        var total_num = 0;//购物车总数
        if (dataList.length) {
          for (var i = 0; i < dataList.length; i++) { //计算总价 判断上下架
            dataList[i].updown = dataList[i].updown == 1 ? true : false;
            dataList[i].checked = dataList[i].updown ? true : false;
            sum += dataList[i].updown ? parseFloat(dataList[i].price * dataList[i].goods_count) : 0;
            total_num += (dataList[i].updown == 1 ? parseInt(dataList[i].goods_count) : 0);
            //截取商品名前20位
            dataList[i].goods_name = dataList[i].goods_name.length > 20 ? dataList[i].goods_name.substr(0, 25) + '...' : dataList[i].goods_name;
            //拼接属性值
            if (dataList[i].property) {
              dataList[i].property_text = '';
              for (var m = 0; m < dataList[i].property.length; m++) {
                dataList[i].property_text = dataList[i].property_text + dataList[i].property[m].name + ':' + dataList[i].property[m].value + ' ';
              }
            }
          }
          var con = true;
        } else {
          var con = false;
        }
        sum = parseFloat(sum).toFixed(2);
        // console.log(sum,'sum');
        that.setData({
          dataList: dataList,
          sum: sum,
          con: con,
          total_num: total_num
        });
        // console.log(that.data.sum)
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },

  //删除按钮
  deleteCartGoods: function (data) {
    var that = this;
    var dataList = that.data.dataList;
    var ids = '';
    var arr = [];
    var dataNew = [];
    for (var i = 0; i < dataList.length; i++) {
      ids += dataList[i].checked ? dataList[i].id + ',' : '';
      if (dataList[i].checked){
        arr.push(i);
      }
    }

    for (var i = 0; i < dataList.length; i++) {
      if(test(i,arr) == 0){
        dataNew.push(dataList[i]);
      }
    }
    // console.log(dataNew, 'dataNew')
    if (!ids) return false;
    ids = ids.substring(0, ids.length - 1);
    //提示框
    wx.showModal({
      title: '确认删除？',
      content: '',
      success: function(res){
        
        if(res.confirm){
          wx.request({
            url: base_url + 'index.php?c=wxApp&a=deleteCartGoods',
            data: {
              ids: ids,
              account: userInfo.account
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            success: function (res) {
              that.setData({
                dataList: dataNew,
              });
              that.getTotalPrice()
            },
            fail: function () {
              // fail
            },
            complete: function () {
              // complete
                changeCartGoodsCount(that);

            }
          })
        }else{
          return false;
        }
        
      }
    })
    
  },
  //下单
  confirmOrder: function (data) {
    var gids = '';//商品id
    var gpids = '';//多规格id
    var counts = '';//商品数量
    var cgids = ''; //购物车商品id
    var dataList = this.data.dataList;

    for (var i = 0; i < dataList.length; i++) {
        if(dataList[i].updown == 1){
          gids += dataList[i].checked ? dataList[i].gid + ',' : '';
          cgids += dataList[i].checked ? dataList[i].id + ',' : '';
          counts += dataList[i].checked ? dataList[i].goods_count + ',' : '';
          gpids += dataList[i].checked ? (dataList[i].gpid ? dataList[i].gpid + ',' : '0' + ',' ) : '';
        }
    }
    if (!gids){
      wx.showModal({
        title: '提示',
        content: '请选择商品',
        showCancel: false,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
      return false;
    } 
    gids = gids.substring(0, gids.length - 1);
    cgids = cgids.substring(0, cgids.length - 1);
    gpids = gpids.substring(0, gpids.length - 1);
    counts = counts.substring(0, counts.length - 1);
    wx.navigateTo({ url: '../order/confirmOrder/confirmOrder?gids=' + gids + '&gpids=' + gpids + '&counts=' + counts + '&cgids=' + cgids });
  },

  //全选Moonlight
    selectAll: function (e,data) {
    var that = this;
    var selectAll = that.data.selectAll;//获取当前的全选状态
    //改变状态
    if ( selectAll == true ) {
      that.setData({ selectAll: false })
    }else {
      that.setData({ selectAll: true })
    }
    var dataList = that.data.dataList;//获取购物车列表

    for (var i = 0; i < dataList.length;i++){
      if (dataList[i].updown == 1) {
        dataList[i].checked = that.data.selectAll;
      }

      if (that.data.btnTexts) { // 如果是编辑状态
        if (dataList[i].updown == 1) {
          dataList[i].checked = that.data.selectAll;
        }
      } else {
        dataList[i].checked = that.data.selectAll;
      }
    }
    that.setData({ dataList: dataList }) ;
    that.getTotalPrice()
  },

  //选择Moonlight
  check: function (e,data) {
    var that = this;
    var index = e.currentTarget.dataset.index;//获取当前index
    var dataList = that.data.dataList;//获取购物车列表
    var selected = dataList[index].checked;  //获取当前选中状态
    // 改变状态
    if (that.data.btnTexts) {
        if (dataList[index].updown == 1) {
            if (selected == true){
                dataList[index].checked = false;
            }else{
                dataList[index].checked = true;
            }
        }
    } else {
        if (selected == true){
            dataList[index].checked = false;
        }else{
            dataList[index].checked = true;
        }
    }
    
    that.setData({ dataList: dataList });//重新设置购物车列表
    that.getTotalPrice();
    //判断是否被全选或者全为空
    for(var m = 0; m < dataList.length; m++) {
      if (that.data.btnTexts) {
          if (dataList[m].updown == 0) {
            continue;
          } else {
            if (dataList[m].checked == true){
              that.setData({ selectAll: true});
            } else {
              that.setData({ selectAll: false });
              return false;
            }
          }
      } else {
          if (dataList[m].checked == true){
              that.setData({ selectAll: true});
          } else {
              that.setData({ selectAll: false });
              return false;
          }
      }
    }
    
    
  },

  //加购物车
  add: function (e,data) {
    var that = this;
    var index = e.currentTarget.dataset.num;
    var id = e.currentTarget.dataset.id;
    var count = parseInt(e.currentTarget.dataset.count) + 1;
    wx.request({
      url: base_url +'index.php?c=wxApp&a=incrCartCount',
      data: {
        id: id,
        goods_count:count
      },
      method: 'GET',
      success: function(res) {
        var dataList = that.data.dataList;
        console.log(dataList, 'dataList');
        dataList[index].goods_count = count;
        that.setData({ dataList: dataList });
        that.getTotalPrice()
      },
      complete: function () {
        changeCartGoodsCount(that);
      }
    })
   
  },
  //减购物车
  reduce: function(e,data) {
    var that = this;
    var index = e.currentTarget.dataset.num;
    var id = e.currentTarget.dataset.id;
    var dataList = that.data.dataList;
    var count = parseInt(e.currentTarget.dataset.count) - 1;

    wx.request({
      url: base_url + 'index.php?c=wxApp&a=descCartCount',
      data: {
        id: id,
        goods_count: count
      },
      method: 'GET',
      success: function (res) {
        if (count > 0){
          dataList[index].goods_count = count;
        }else{//购物车只有1个，删除此条数据
           dataList.splice(index,1);
        }
        if (dataList.length){
          var con = true;
        } else {
          var con = false;
        }
        that.setData({ dataList: dataList, con: con, });
        that.getTotalPrice()
      },
      complete: function () {
          changeCartGoodsCount(that);
      }
    })
  },

  //计算总价
  getTotalPrice: function (e,data) {
    var that = this;
    var dataList = that.data.dataList;
    var total = 0;
    var total_num = 0;
    for (var n = 0; n < dataList.length; n++) {
      if (dataList[n].checked && dataList[n].updown == 1) {
        total += dataList[n].goods_count * dataList[n].price;
        total_num += parseInt(dataList[n].goods_count);
      }
    }
    that.setData({
      sum: total.toFixed(2),
      total_num: total_num
      // dataList: dataList
    })
  },

    //编辑 完成 切换
    changeTab: function(e) {
        var ee = e.currentTarget.dataset.editend;
        if (ee == 0) {
            this.setData({
                editEnd: 1,
                editEndText: '编辑',
                btnTexts: 1
            });
        } else if (ee == 1) {
            this.setData({
                editEnd: 0,
                editEndText: '完成',
                btnTexts: 0
            });
        }

        var that  = this;
        var dataList = this.data.dataList;//获取购物车列表

        for (var i = 0; i < dataList.length; i++) {
            if (dataList[i].updown == 0) {
                dataList[i].checked = true;
            }
        }
        that.setData({ dataList: dataList });//重新设置购物车列表
      },
    gotoDetail: function (data) {
        let gid = data.currentTarget.dataset.gid;
        wx.navigateTo({
            url:'/pages/goods/goodsDetail/goodsDetail?gid='+gid,
        })
    }
});

function changeCartGoodsCount(that) {
    wx.request({
        url: base_url + 'index.php?c=wxApp&a=getCartGoodsCount',
        data: {account:userInfo.account},
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function(res){
            // success
            var cartGoodsCount = res.data.data;
            that.setData({cartGoodsCount:cartGoodsCount});
            wx.setStorage({
                key:"cartGoodsCount",
                data:cartGoodsCount
            });
            console.log('cartGoodsCount:', cartGoodsCount);
        },
        fail: function() {
            // fail
        },
        complete: function() {
            // complete
            //设置底部导航信息：
            let cartGoodsCount = wx.getStorageSync('cartGoodsCount');
            console.log('cartGoodsCount:', cartGoodsCount);
            let nav_active = {
              home: '',
              circle: 'active',
              center: '',
              img:cartGoodsCount.img
            };
            that.setData({nav_active:nav_active});
            console.log('nav_active.img:', nav_active.img);
        }
    })
}
