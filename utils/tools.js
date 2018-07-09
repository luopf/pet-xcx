var CONFIG = require('./config.js');
var base_url = CONFIG.API_URL.BASE_URL;
var tools = {
	fetchHttpCilent: function (params) {
		var _this = this;
		return new Promise((resolve, reject) => {
			wx.request({
				url: params.API_URL,
				data: Object.assign({}, params.data),
				header: {
					'Content-Type': 'application/json'
				},
				success: resolve,
				fail: reject
			});
		});
	},
	result: function (params) {
		var _this = this;
		return _this.fetchHttpCilent(params).then(res => res);
	},
	//返回顶部
	backTop: function () {
		wx.pageScrollTo({
			scrollTop: 0
		})
	},
	//一键拨号
	makePhoneCall: function (phoneNumber) {
		wx.makePhoneCall({
			phoneNumber: phoneNumber
		})
	},
	//操作成功提示
	showSuccessToast: function (title = "恭喜操作成功！") {
		wx.showToast({
			title: title,
			icon: 'success',
			duration: 1500
		}),
			setTimeout(function () {
				wx.hideToast();
			}, 2000)
	},
	//操作失败提示
	showFailToast: function (title = "对不起操作失败！") {
		wx.showToast({
			title: title,
			image: '../../static/images/common/fails.png',
			duration: 1500
		}),
			setTimeout(function () {
				wx.hideToast();
			}, 2000)
	},
	/**
	 * request请求
	 */
	httpClient(url,data,callback) {
		wx.request({
			url: base_url + url,
			data: data,
			header: {
				"Content-Type": "application/json"
			},
			method: "GET",
			dataType: 'json',
			success: function ( res ) {
				callback( null, res.data )
			},
			fail: function ( error ) {
				callback( error )
			}
		})
	},
	/**
	 * 获取坐标
	 */
	getLocation(call ) {
		wx.getLocation({
			type: 'gcj02',
			success: function(res) {
				call(res);
			},
		})
	},

	
// /**
//  * 重新获取授权
//  */
// getAuthor(author) {
//     wx.getSetting({
//         success(res) {
//             if(!res.authSetting['scope.userLocation']) {
//                 wx.openSetting({
//                     success: (res) => {
//                         console.log(res)
//                         if(!res.authSetting['scope.userLocation']) {
//                             wx.showModal({
//                                 title: '温馨提醒',
//                                 content: '需要获取您的地理位置才能使用小程序',
//                                 cancelText: '不使用',
//                                 confirmText: '获取位置',
//                                 success: function(res) {
//                                     if(res.confirm) {
//                                         //getAuthor();
// 										console.log('确认授权啦');
										
//                                     } else if(res.cancel) {
//                                         wx.showToast({
//                                             title: '您可点击左下角 定位按钮 重新获取位置',
//                                             icon: 'success',
//                                             duration: 3000
//                                         })
//                                     }
//                                 }
//                             })
//                         }                    
//                     }
//                 })
//             }
//         }
//     })

// }
}
module.exports = tools;