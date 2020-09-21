// 支付页面
// 引入功能模块
const apisUrl = require("../../utils/apisUrl.js");
const openid = 'o4MaV5Ph7kRjzZNmjCJoSOY_pIVE';
Page({
    data: {
        payData:{}
    },
    // 生命周期函数--监听页面加载
    onLoad: function(options) {
        // 获取网页跳转小程序传入的数据
        if (options) {
            this.pay(decodeURIComponent(options.data))
        } 
    },
    // 唤起支付 
    pay(payParams) {
        var that = this;
        payParams = JSON.parse(payParams)
        console.log(payParams)
        wx.requestPayment({
            'timeStamp': payParams.timeStamp,
            'nonceStr': payParams.nonceStr,
            'package': payParams.packAge,
            'signType': payParams.signType,
            'paySign': payParams.paySign,
            success: function(paySuccess) {
                // 支付成功 Toast弹窗提示
                if (paySuccess.errMsg === "requestPayment:ok") {
                    that.showToast('支付成功')
                    // 跳转至我的订单页面
                } else {
                    wx.showToast({
                        title: '支付失败',
                        icon: "none"
                    })
                }
            },
            fail: () => {
                wx.showToast({
                    title: '支付取消',
                    icon: "none"
                })
            },complete(){
                wx.reLaunch({
                    url: `/pages/index/index?url=${apisUrl.url}/localQuickPurchase/distributionVA/order/index`,
                })
            }
        })
    },
    // 弹窗提示
    showToast(title) {
        wx.showToast({
            title
        })
    },
    // 生命周期函数--监听页面初次渲染完成
    onReady: function() {},
    // 生命周期函数--监听页面显示
    onShow: function() {},
    // 生命周期函数--监听页面隐藏
    onHide: function() {},
    // 生命周期函数--监听页面卸载
    onUnload: function() {},
    // 页面相关事件处理函数--监听用户下拉动作
    onPullDownRefresh: function() {},
    // 页面上拉触底事件的处理函数
    onReachBottom: function() {},
    // 用户点击右上角分享
    onShareAppMessage: function() {}
});