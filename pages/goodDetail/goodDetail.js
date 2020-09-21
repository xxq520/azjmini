// 商品详情页面
// 功能模块文件
const urlPath = require("../../utils/apisUrl");
Page({
    data: {
        // 商品详情初始化展示页面url路径
        url: "",
    },
    onLoad: function (options) {
        var url = ``;
        // 直播间跳转至此页面的可以拿到的参数
        /**
         *判断商品是秒杀商品还是普通商品  分别展示不同的页面
         *1.秒杀商品详情    0.普通商品详情
         *goodsId：商品的code码
         *seq： 用户的seq
         */
        var that = this;
        var getGoodType = new Promise((resolve,reject)=>{
            wx.request({
                url: urlPath.goodsDetailType,
                header: {
                    "Content-Type": " application/x-www-form-urlencoded; charset=UTF-8"
                },
                data: {
                    goodsId: options.goodsId
                },
                method: "post",
                success: function (res) {
                    console.log(res)
                    // 判断接口是否请求成功
                    if (res.data.code) {
                        resolve(res.data)
                    } 
                }
            })
        })
        getGoodType.then(res=>{
            // 如果是秒杀商品
            if (res.data.goodsInfo.isActivityGoods==1){
                url = urlPath.seckillDetail + `?goodsId=${options.goodsId}&distributorSeq=0&shareSeq=0`
            } else {
                url = urlPath.goodsDetail + `${options.goodsId}/0/0`;
            } 
            // 初始化页面路径
            that.setData({
                url: url
            })
        }).catch(err=>{
            // 如果直播间中的商品，参数是缺少或者不完整的情况，则提示错误给用户。
            that.showError()
        })
    },
    // 如果商品数据或直播间传递过来的参数有异常 则自动返回到上一页
    showError() {
        wx.showModal({
            title: '提示',
            content: '商品详情加载失败',
            showCancel: false,
            success(res) {
                wx.navigateBack({
                    delta: 1
                })
            }
        })
    },
    onReady: function () {
    },
    onShow: function () {
    },
    onHide: function () {
    },
    onUnload: function () {
    },
    onPullDownRefresh: function () {
    },
    onReachBottom: function () {
    },
    onShareAppMessage: function () {
    }
});