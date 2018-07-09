//购物车模型
// 主要处理用户购买逻辑，同步数据到本地存储
function CartModel(){

}
CartModel.prototype = {
    constructor:CartModel,

    init:function(){},

    //添加购物车车
    add:function(e){
      console.log(e);
    },
    
    //减少购物车
    sub:function(){},

    //购物车删除
    remove:function(){},

    //购物车清空
    empty:function(){},

    //批量添加到购物车车
    batchAdd:function(){},

    //是否可以添加到购物车
    canAdd:function(){},

    //storage key
    KEY:'model-cart-buy-counter',

    //保存到微信存储，异步进行
    setLocal:function(data){
        wx.setStorage({
          key: this.KEY,
          data: data,
          success: function(res){
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

    //从微信取数据，异步进行
    getLocal:function(){
        wx.getStorage({
          key: this.KEY,
          success: function(res){
            // success
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
module.exports = new CartModel();