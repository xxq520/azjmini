// 直播列表
// 功能模块
const apisUrl = require("../../utils/apisUrl.js");
let livePlayer = requirePlugin('live-player-plugin')
// 首次获取立马返回直播状态，往后间隔1分钟或更慢的频率去轮询获取直播状态
const roomId = 15 // 房间 id
Page({
    data: {
        // 直播列表数据
        room: [],
        // 首次加载传递的参数
        options: {},
        // 页面是否已经加载过
        isLoad: false,
        // 是否允许加载更多页面数据
        isLoadMore: true,
        // 从第几拉取直播间列表数据
        startNum: 1,
        // 一次拉取多少直播间列表数据
        limitNum: 3
    },
    onLoad: function(options) {
        // 判断是否是app中跳转过来的
        // options?options.room = 8:'';
        if (options.room) {
            wx.navigateTo({
                url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${options.room}&custom_params=true`,
            })
            return
        }
        this.setData({
            options: options
        })
    },
    // 请求主播列表数据获取主播列表数据
    getLiveData() {
        var that = this;
        wx.request({
            url: apisUrl.getLiveLIst,
            header:{
            },
            method: "POST",
            data: {
                "start": that.data.startNum, // 起始拉取房间，start = 0 表示从第 1 个房间开始拉取
                "limit": that.data.limitNum // 每次拉取的个数上限，不要设置过大，建议 100 以内
            },
            success: function(res) {
                if (res.data.code === 200) {
                    // 历史主播列表数据
                    var room = res.data.data.list;
                    // 当前请求处理数据完成后的数据
                    var newRoom = [];
                    // 历史拉取的主播列表数据
                    var oldRoom = that.data.room;
                    var loadIndex=0;
                    for (let i = oldRoom.length; i < oldRoom.length+room.length; i++) {
                        // 判断是否是第一次加载数据，而不是加载更多
                        if ((oldRoom.length + room.length)<=that.data.limitNum) {
                            var index =i;
                        }else{
                            var index = loadIndex;
                        }
                        // index为当前请求的单次请求数据下标
                        // i为页面上请求的所有数据下标
                        // 循环验证当前直播列表中的状态是否是最新的
                        livePlayer.getLiveStatus({
                            room_id: room[index].roomId
                            })
                        .then(liveResponse => {
                            // 直播api返回过来的直播状态 此接口调用间隔时间为一分钟
                            var liveStatus = liveResponse.liveStatus
                            if (liveStatus> 103) {
                                return
                            }
                            // 判断后台返回得直播状态数据是否和直播组件api中返回的状态是否一致
                            // 如果不一致则更改数据库中的直播状态数据
                            console.log(room[index].liveStatus, liveResponse.liveStatus,888)
                            // if (room[index].liveStatus == liveResponse.liveStatus) {
                           try{
                               if (room[i].liveStatus != liveResponse.liveStatus && liveResponse) {
                                   // 替换后台返回的
                                   room[index].liveStatus = liveStatus;
                                   that.changeLiveStatus(that.data.room[i].roomId, liveResponse.liveStatus)
                                   //改变data对应i的某个属性值
                                   var temp_str = 'room[' + i + '].liveStatus';
                                   console.log(temp_str, liveStatus, 77)
                                   that.setData({
                                       [temp_str]: liveStatus
                                   });
                               }
                           }catch(err){
                           }
                        })
                        // 格式化时间戳
                        room[index].startTime = "直播时间:" + that.formDate(room[index].startTime, 1) +"-"+ that.formDate(room[index].endTime, 1)+"  "+that.formDate(room[index].startTime) +"-"+ that.formDate(room[index].endTime)
                        newRoom.push(room[index])
                        // 不是首次加载直播列表数据则用loadIndex
                        loadIndex++
                    }
                    // 存储当前请求的数据
                    that.setData({
                        room: that.data.room.concat(newRoom),
                        isLoadMore: newRoom.length<that.data.limitNum?false:true,
                        startNum: that.data.startNum+1                      
                    })
                } else {
                    //主播列表数据
                    wx.showToast({
                        icon: "none",
                        title: '加载直播列表失败',
                    })
                }
                wx.hideNavigationBarLoading(); //完成停止加载
                wx.stopPullDownRefresh() //停止下拉刷新
            }
        })
    },
    // 进入直播间 
    goLive(e) {
        console.log(e.currentTarget.dataset.item,55)
        var item = e.currentTarget.dataset.item;
        // 如果是未开始 并且有分享海报的情况下跳转至分享海报页面
        if (item.liveStatus == 102 && item.sharePosters){
                wx.navigateTo({
                    url: `/pages/liveShare/liveShare?share=${item.sharePosters}&title=${item.name}&room=${item.roomId}`,
                })
        // 如果直播间的状态是直播中或者已结束的话，则跳转至直播间页面
        } else if ((item.liveStatus == 101 && item.sharePosters) || item.liveStatus==103) {
            wx.navigateTo({
                url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${item.roomId}&custom_params=${item.roomId}`,
            })
        }else {
            wx.showToast({
                title: '直播间正在审核，请稍后再试',
                icon: 'none',
                duration: 2000
            })
        }
    },
    // 更改数据库中直播状态
    changeLiveStatus (roomId, liveStatus) {
        wx.request ({
            url: apisUrl.changeLiveStatus+`?roomId=${roomId}&liveStatus=${liveStatus}`,
            method: 'POST',
            data : {
            },
            success(res) {
                console.log("成功", res)
            }
        })
    },
    //格式化时间
    formDate(data,type) {
        var date = new Date(data * 1000);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        if(type==1){
            return m+"/"+d
        }
        return h + ':' + minute
    },

    // 生命周期函数--监听页面初次渲染完成
    onReady: function() {},
    // 生命周期函数--监听页面显示
    onShow: function() {
        this.getLiveData()
    },
    // 生命周期函数--监听页面隐藏
    onHide: function() {},
    // 生命周期函数--监听页面卸载
    onUnload: function() {},
    // 页面相关事件处理函数--监听用户下拉动作
    onPullDownRefresh: function() {
        var that = this;
        this.setData({
            startNum:1,
            room:[]
        })
        wx.showNavigationBarLoading(); //在标题栏中显示加载
        //模拟加载
        setTimeout(function() {
            that.onLoad(that.options);
            that.getLiveData()
        }, 1000);
    },
    // 页面上拉触底事件的处理函数
    onReachBottom: function() {
        // 加载更多直播列表数据
        if (this.data.isLoadMore) {
            this.getLiveData()    
        }
    },
    // 用户点击右上角分享
    onShareAppMessage: function() {}
});