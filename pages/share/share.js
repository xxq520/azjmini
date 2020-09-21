// 分享页面
Page({
    // 页面的初始数据
    data: {
        // 二维码弹窗是否显示
        ewmshow: false
    },
    // 生命周期函数--监听页面加载
    onLoad: function (options) {
        var ewm = decodeURIComponent(options.ewm);
        // 如果二维码链接是以下链接则不展示二维码
        let ewmList = ['https://azjxcx.520shq.com', 'http://fxyhjts.520shq.com', 'http://nfxts.520shq.com', 'https://fxyhjts.520shq.com', 'undefined'];
        let isEwm = ewmList.some(item => {
            return ewm === item;
        });
        this.setData({
            // webview需要访问的路径
            url: decodeURIComponent(options.url),
            // 分享的标题
            title: decodeURIComponent(options.title),
            // 分享的图片
            pic: decodeURIComponent(options.pic),
            // 分享的二维码图片路径
            ewm: isEwm ? '' : ewm
        });
    },
    onShow: function () {},
    // 点击复制二维码链接
    cloneUrl: function () {
        var that = this;
        wx.setClipboardData({
            data: that.data.url,
            success: function (res) {
                wx.showToast({
                    title: '复制链接成功',
                    duration: 2000
                });
                // 防止弹出内容已复制弹窗提醒
                wx.getClipboardData({
                    success: function () {
                    }
                })
            }
        })
    },
    // 点击二维码显示
    showEwm() {
        //点击切换显示隐藏二维码弹窗遮罩层
        this.setData({
            ewmshow: !this.data.ewmshow
        })
    },
    // 点击二维码保存按钮事件
    saveEwm() {
        var pic = this.data.ewm;
        var that = this;
        // 首先下载图片
        wx.downloadFile({
            url: pic,
            success: function (res) {
                that.savedFilePath(res);
            }
        })
    },
    // 保存图片到手机
    savePicture(res) {
        if (res.statusCode === 200) {
            // 保存下载的图片到用户手机
            wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success() {
                    wx.showToast({
                        title: '保存二维码成功！',
                    });
                    // 关闭显示二维码的弹窗
                    that.showEwm()
                },
                fail() {
                    wx.showToast({
                        icon: 'none',
                        title: '保存二维码失败！',
                    });
                    that.showEwm()
                }
            })
        }
    },
    //当用户点击了分享给好友的时候需要返回的数据
    onShareAppMessage: function () {
        return {
            title: this.data.title,
            // 拼接跳转的小程序页面路径加上分享时的h5页面路径作为webview的src地址
            path: `/pages/index/index?url=${encodeURIComponent(this.data.url)}`,
            imageUrl: this.data.pic
        }
    }
});