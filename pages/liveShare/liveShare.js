// 分享页面
Page({
    // 页面的初始数据
    data: {
        // 二维码弹窗是否显示
        ewmshow: false
    },
    // 生命周期函数--监听页面加载
    onLoad: function (options) {
        if (options.share) {
            this.setData({
                // 分享的标题
                title: options.title,
                // 分享的图片
                pic: options.share,
                room: options.room
            });
        }
    },
    onShow: function () {},
    // 点击二维码显示
    showEwm() {
        //点击切换显示隐藏二维码弹窗遮罩层
        this.setData({
            ewmshow: !this.data.ewmshow
        })
    },
    // 点击二维码保存按钮事件
    saveEwm() {
        var pic = this.data.pic;
        var that = this;
    },
    //当用户点击了分享给好友的时候需要返回的数据
    onShareAppMessage: function () {
        return {
            title: "给你分享了直播间，"+this.data.title,
            // 拼接跳转的小程序页面路径加上分享时的h5页面路径作为webview的src地址
            path: `/pages/liveList/liveList?room=${(this.data.room)}`,
            imageUrl: this.data.pic
        }
    }
});