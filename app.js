
App({
    onLaunch: function () {
        // 判断小程序版本是否有更新
        const updateManager = wx.getUpdateManager()
        updateManager.onUpdateReady(function () {
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success(res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()
                    }
                }
            })
        })
    },
    globalData: {
        userInfo: null
    }
});