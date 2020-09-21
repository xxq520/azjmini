// 请求域名
// const url = "https://azjxcx.520shq.com";
const url = "https://nfxts.520shq.com";
// 请求后台的url不包括请求参数 若需查询请求参数 到相应的页面查找
module.exports = {
    url : url,
    /*webview 地址*/
    // 爱之家小程序首页webview地址
    indexUrl : url + `/localQuickPurchase/distributionVA/index`,
    // 秒杀商品详情webview地址
    seckillDetail : url + `/localQuickPurchase/distributionVA/seckill/sgDetail`,
    // 普通商品详情webview地址
    goodsDetail : url + `/localQuickPurchase/distributionVA/goodsDetail/`,

    /*请求数据api地址*/

    // 获取直播列表数据
    getLiveLIst : url + `/localQuickPurchase/small/pay/getLiveRooms`,
    // 更改直播状态接口
    changeLiveStatus : url + `/localQuickPurchase/small/pay/update/status`,
    // 获取直播回放视频数据
    getLiveBack : url + `/localQuickPurchase/small/pay/getLiveReplay`,
    // 判断购买的商品类型
    goodsDetailType : url + `/localQuickPurchase/dGoodsAction/loveHouseGodosDetail`,
};