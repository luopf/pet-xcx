//定义登录方法
var CONFIG = require('./config.js');
var base_url = CONFIG.API_URL.BASE_URL;
var wxLogin = {
	_login: function(did,callback) {
		// 调用接口获取登录凭证（code）进而换取用户登录态信息，包括用户的唯一标识（openid） 及本次登录的 
		// 会话密钥（session_key）等。用户数据的加解密通讯需要依赖会话密钥完成。

		// 注：调用 login 会引起登录态的刷新，之前的 sessionKey 可能会失效。
		wx.login({
			success: function(res) {
				if(res.code) {
					var code = res.code;
					wx.request({
						url: base_url + 'index.php?c=wxApp&a=wx_login',
						data: {js_code: code},
						method: 'GET', 
						success: function (res) {
							var data = res.data;
							console.log(data);
							//后台传回thirdRD_session存入storage,用于后续通信使用
							wx.setStorageSync('thirdRD_session', data);
							// 此前有调用过 wx.login 且登录态尚未过期，此时返回的数据会包含 encryptedData, iv 等敏感信息
							wx.getUserInfo({
								success: function (res) {
									// success
									var encryptedData = res.encryptedData;
									var iv = res.iv;  //加密算法的初始向量
									var thridRDSession = wx.getStorageSync('thirdRD_session');
									wx.request({
										url: base_url + 'index.php?c=wxApp&a=decryptUserInfo&thridRDSession=' + thridRDSession + "&encryptedData=" + encryptedData + "&iv=" + iv,
										data: {
											thridRDSession: thridRDSession,
											encryptedData: encryptedData,
											iv: iv,
                      did:did
										},
										method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
										header: {
											'content-type': 'application/json'
										}, // 设置请求的 header
										success: function (res) {
											
											if (userInfo != "" || userInfo != null) {
												var ws = res.data;
												var json = ws.replace(/^[\s\uFEFF\xa0\u3000]+|[\uFEFF\xa0\u3000\s]+$/g, "");
												var userInfo = JSON.parse(json);
                                                                        console.log(userInfo,'userInfo');
												callback ? callback(userInfo) : '';
												wx.setStorage({
													key: "userInfo",
													data: userInfo
												})
											}
											// success
										}	
									})
								},
							});
						},
						fail: function () {
							// fail
						},
						complete: function () {
							// complete
						}
					});
				} else {
					console.log('获取用户登录态失败！' + res.errMsg)
				}
			}
		});
	},
  //测试
  _testUser:function(){
    var userInfo = [];
    userInfo['id'] = 1;
    userInfo['nick_name'] = '罗鹏飞';
    return userInfo;
  }

};
module.exports = wxLogin;