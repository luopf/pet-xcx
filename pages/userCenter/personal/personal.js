var CONFIG = require('../../../utils/config.js');
var tcity = require("../../../utils/citys.js");
var base_url = CONFIG.API_URL.BASE_URL;
var app = getApp();
var userInfo = '';
var userData = "";
Page({
  // 数据
  data: {
	// 我的列表数据
	modalHidden: true,
	base_url: base_url,
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

  onLoad: function (options) {
    var that = this;
    userInfo = wx.getStorageSync('userInfo');
    var id = userInfo.id;
    var account = userInfo.account;
    wx.showLoading({
	    title: '加载中...',
	    mask: true
    })
    wx.request({
      url: base_url + 'index.php?c=wxApp&a=getUserInfo',
      data: {
        id: id
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
		wx.hideLoading()
		// console.log( res )
	userData = res.data;
	if (userData.data.address == null || userData.data.address ==''){
	var address="选择地区";
	}else{
	var address = userData.address;
	}
	var addr = userData.data.address == null ? '' : userData.data.address.split(' ');
	that.setData({
		userData: userData.data,
		userInfo: userInfo,
		nickName : userData.data.nick_name,
		phone : userData.data.phone,
		sex : userData.data.sex,
		detail : userData.data.detail,
		// address : userData.data.address,
		// province: addr[0],
		// city: addr[1],
		// county: addr[2],
		// region: address
	});
      }
    });

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
    });
//     console.log( that.data.provinces )
  },
 
  //获取nickName
  nickName: function(e){
    var that = this;
    that.setData({
      nickName: e.detail.value
    })
  },
  //获取性别
  sex: function (e) {
    var that = this;
    that.setData({
      sex: e.detail.value
    })
  },
  //获取phone
  phone: function(e){
    var that = this;
    that.setData({
      phone: e.detail.value
    })
  },

  //获取我的地址
  detail: function (e) {
    var that = this;
    that.setData({
      detail: e.detail.value
    })
  },

  //保存个人信息
  saveInfo: function(e){ 
    var that = this;
    
    userInfo = wx.getStorageSync('userInfo');
    var id = userInfo.id;
    var nickName = that.data.nickName;
    var phone = that.data.phone;
    var sex = that.data.sex;
    var detail = that.data.detail;
    var address = that.data.province + ' ' + that.data.city + ' ' + that.data.county;
//     var area="";
//     for (let m = 0; m < address.length; m++) {
//       if (m == address.length-1){
//         area += address[m];
//       }else{
//         area += address[m] + ' ';
//       }
//     }
    wx.request({
      url: base_url +'index.php?c=wxApp&a=updateUserInfo',
      data: {
        'id': id,
        'nickName': nickName,
        'phone': phone,
        'sex': sex,
	  'address': address,
        'detail': detail
      },

      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        var data = res.data.errorCode;
        console.log(res.data)
        if(data == '0'){
        
          wx.showToast({
            title: '保存成功！',
            icon: 'success',
            duration: 1500
          });
          setTimeout(function(){
            wx.reLaunch({
              url: '../userCenter/userCenter',
            })
          },1500);
        }
      }
    })
  },

/**
 * 选择省市区
 */
bindChange: function (e) {
	//console.log(e);
	var val = e.detail.value;
	var t = this.data.values;
	var cityData = this.data.cityData;

	if (val[0] != t[0]) {
		// console.log('province no ');
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
			// address: this.data.provinces[val[0]] + ' ' + cityData[val[0]].sub[0].name + ' ' + cityData[val[0]].sub[0].sub[0].name
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
		// console.log('county no');
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
open: function () {
	this.setData({
		condition: !this.data.condition
	})
},
  
})