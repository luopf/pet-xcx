var Fun = {
    test : function(){
        console.log('引入公共函数成功');
    },

    tipTmpModel:{
        tipHidden:true,
        cancel_call: 'offTip',
        tipTitle:'提示',
        tipContent:'确认提交吗？',
        confirm_call:'confirmTip',
        cancel_call:'offTip',
        cancel_btn:'取消',
        confirm_btn:'确定',
    },

    _pagingSelection:{
      pageIndex: 1,
      pageSize:6
    },

    _pagingInfo:{
      url:''
    },
    canPaging: true,
    /**
     *获取授权 
     */
    curlLogin: function(that,base_url,decorator,args){
        let userInfo = wx.getStorageSync('userInfo');
        if(userInfo != undefined && userInfo != '' && userInfo != null){
            console.log('已授权，不重复获取...',userInfo);
            return false;
        }
        wx.login({
            success: function (res) {
              var code = res.code;
              wx.request({
                url: base_url + 'index.php?c=wxAppStore&a=wx_login',
                data: {
                  js_code: code
                },
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                // header: {}, // 设置请求的 header
                success: function (res) {
                  var data = res.data;
                  console.log(data);
                  wx.setStorageSync('thirdRD_session', data);
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
                            wx.setStorageSync("userInfo", userInfo);
                            console.log('获取成功啦',wx.getStorageSync('userInfo'));
                          }
        
                          // success
                        },
                        fail: function () {
                          // fail
                        },
                        complete: function () {
                          // complete :展示首次登陆送积分信息
                          let userInfo = wx.getStorageSync("userInfo");
                          console.log('+++++++++++++++',userInfo);
                          decorator(args);
                        }
                      })
                    },
                    fail: function () {
                      // fail
                    },
                    complete: function () {
                      // complete
                      
                    }
                  })
                  // success
                },
                fail: function () {
                  // fail
                },
                complete: function () {
                  // complete
                }
              })
              // success
            },
            fail: function () {
              // fail
            },
            complete: function () {
              // complete
            }
          })
    },
    
    //-------------------模态框--------------------

    /**
     * 纯粹的关闭弹框
     */
    showTip: function (e,tipConfig) {
        let that = e;
        let _tipTmpModel = this.tipTmpModel;
        Object.assign(_tipTmpModel,tipConfig);
        _tipTmpModel.tipHidden = false;
        that.setData({ tipTmpModel: _tipTmpModel });
        _tipTmpModel.tipHidden = true;
    },

    /**
     * 关闭弹框
     */
    offTip: function (e,tipConfig) {
        let that = e;
        let _tipTmpModel = that.data.tipTmpModel;
        Object.assign(_tipTmpModel,tipConfig);
        _tipTmpModel.tipHidden = true;
        that.setData({ tipTmpModel: _tipTmpModel });
        console.log('-------执行关闭弹框---------',_tipTmpModel);
        
    },

    /**
     * 确认操作:前去充值押金
     */
    confirmTip: function (e, url) {
        let _url = url || '';
        this.offTip(e);
        if(url) wx.navigateTo({url:url});
    },

    /**
     * 前去押金升级页面
     */
    goDeposit: function(e){
        wx.navigateTo({url: '../../userCenter/deposit/deposit'});
    },


    /**
     * 分页方法
     * @param append 数据追加模式：默认情况不是追加，首次分页加载，onreachbottom时
     */
    CurlPaging: function ( that, url, cData, append,defSelection) {
        console.log('----------------------',this.canPaging);
      
        //1. 是否可下拉
        if(that.data.canPaging == false) return false;
        that.setData({
          templateData:{loadingBall:1},
          canPaging:false
        })
        
        this._pagingInfo.url = url;
        let pagingSelection = {};
        //数据追加模式
        let _append = (append === false) ? false : true;
        let _pagingSelection = this._pagingSelection; //本地分页条件
        pagingSelection = Object.assign(pagingSelection,_pagingSelection, cData);
        if(_append){  //是追加：
            pagingSelection.pageIndex = that.data.pageIndex;
            // return false;
        }else{
            that.setData({templateData:{loadingBall:1}})
        }
        // console.log(_append, '数据追加方式');
        // console.log(cData, '新添加的分页条件');
        // console.log(pagingSelection, '实际使用的分页条件');
        wx.request({
          url: url,
          data: pagingSelection,
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          success: function(res){
              var data = res.data.data;
              console.log('返回值',data);
              
              // success
              var list = _append ? that.data.list : [];
              var dataList = data.dataList;
              if(dataList.length == 0) {
                  that.setData({ tipHidden: false });
              }
              for (var i = 0; i < dataList.length; i++) {
                list.push(dataList[i]);
              }
              //设置常用参数
              let _pageIndex = parseInt(pagingSelection.pageIndex)+1;
              let _allPages = data.pageInfo.all_pages; //设置总页面数
              // pagingSelection.pageIndex = parseInt(pagingSelection.pageIndex)+1;
              // console.log('最新的分页条件', pagingSelection);
              
              that.setData({
                list: list,
                pageIndex: _pageIndex,
                allPages: _allPages,
              });
              // console.log('list-------------',list);
          },
          fail: function() {
            // fail
            console.log(res.data.data, 'faile');
          },
          complete: function() {
            // console.log('complete-------------------');
            //设置可以分页
            that.setData({
              templateData:{loadingBall:0},
              canPaging : true
            });
          }
        })
    },

    /**
     * 下拉加载方法与分页方法相结合
     */
    CurlReachBottom : function (that, cData){
      let pageIndex = that.data.pageIndex || 0;
      let allPages = that.data.allPages || 0;
      if( pageIndex > allPages) {
        if (allPages > 0) {
          that.setData({
            templateData:{loadingBall:0}
          })
        }	
      }else {
        let url = this._pagingInfo.url;
        Fun.CurlPaging(that,url, cData);
      }
    },

    /**
     * 获取页面数据
     * @param nameList 键值数组 []
     * @param cData 缓存和页面外的分页参数 []
     */
    getSelection: function(that, nameList, cData){
      let retInfo = {};
      //初始化：目标数据
      for (let index = 0; index < nameList.length; index++) {
        //从缓存,page数据,页面：中获取数据
        let _key = nameList[index];
        let _data = that.data;
        let _tmpData = _data[_key];
        
        if(_tmpData != undefined && _tmpData != '' && _tmpData != null){
            retInfo[_key] = _tmpData;
        }else{
            _tmpData = wx.getStorageSync(_key);
            //从缓存中获取数据
            if(_tmpData != undefined && _tmpData != '' && _tmpData != null){
              retInfo[_key] = _tmpData;
            }
        }
      }
      //组合数据
      let curlData = Object.assign(retInfo, cData);
      // console.log('返回的分页参数', curlData);
      return curlData;
    },

    /**
     * 获取页面weappElastic数据
     */
    getAppElastic: function(that, base_url,callback){
        //1. 检查缓存是否存在
        let elasticInfo = wx.getStorageSync('elasticInfo');
        if(elasticInfo){
            console.log('公共信息存在',elasticInfo);
            callback(elasticInfo);
            return elasticInfo;
        }else{
          console.log('动态获取公共信息', elasticInfo);
          wx.request({
            url: base_url +'index.php?c=wxAppElastic&a=getCommonInfo',
            data: {},
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res){
              console.log('--------页面公共信息----------', res.data.data);
              let elasticInfo = res.data.data;
              wx.setStorage({
                key: 'elasticInfo',
                data: elasticInfo,
                success: function(res){
                },
                fail: function() {
                  console.log('公共信息缓存fail');
                },
                complete: function() {
                  console.log('公共信息缓存complete');
                }
              })
              callback(elasticInfo);
            },
            fail: function() {
              // fail
            },
            complete: function() {
              // complete
             
            }
          })
        }

    
    }

}
module.exports = Fun;