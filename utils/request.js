/**
 * url: 请求地址
 * params: 请求参数
 * toast作用： 请求接口时， 显示loadding， 默认"显示"
 */
// 获取应用实例
const app = getApp();
// request path
const apisUrl = require("./apisUrl");
// request domain name
var url = apisUrl.url;
// requret Header Parameter
var header = {
    // requrest content-type
    'content-type': 'application/json; charset=utf-8',
};
// get 请求封装
function getReq(getUrl,params, toast = true) {
    // 在缓存中获取 token wx.getStorageSync同步获取
    if (toast) {
        wx.showLoading({
            title: '加载中',
        })
    }
    // 返回一个promise对象
    return new Promise((resolve, reject)=>{
        wx.request({
            url: url + getUrl,
            method: 'get',
            header: header,
            data:params,
            success: function (responseData) {
                if (toast) {
                    wx.hideLoading();
                }
                resolve(responseData);
            },
            fail: function () {
                if (toast) {
                    wx.hideLoading();
                }
            }
        })
    })
}
module.exports = {
    getReq: getReq
};