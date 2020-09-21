// 首页
// 获取应用实例
const app = getApp();
const apisUrl = require("../../utils/apisUrl");
Page({
    data: {
        // 默认webview展示的页面
        url: apisUrl.indexUrl
    },
    onLoad: function (options) {
        // 判断是否是扫描二维码
        if(options.scene){
            let params = {} // id type
            let str = decodeURIComponent(options.scene);
            let arr = str.split("&");
            for(var i=0; i<arr.length; i++){
                params[ arr[i].split('=')[0] ] = arr[ i ].split('=')[ 1 ]
            }
            // type为9则是扫描二维码进入 
            wx.navigateTo({
                url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${params.id}&custom_params=true&type=${params.type||9}`,
            })
        }
        // 如果是分享进入的则 打开分享中的页面路径
        if (options.url) {
            this.setData({
                url: decodeURIComponent(options.url)
            })
        };
    }
});
