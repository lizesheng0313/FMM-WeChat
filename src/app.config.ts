/*
 * @Author: lizesheng
 * @Date: 2023-03-07 12:01:55
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-04-25 16:29:46
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /shop/src/app.config.ts
 */
export default {
  pages: [
    "pages/index/index",
    "pages/classification/index",
    "pages/myIndex/index",
    "pages/goodsDetails/index",
    "pages/goodsList/index",
    "pages/goodsSearch/index",
    "pages/order/index",
    "pages/address/index",
    "pages/addressManage/index",
    "pages/orderList/index",
    "pages/orderDetails/index",
    "pages/returnList/index",
    "pages/returnGoods/index",
    "pages/returnDetails/index",
    "pages/logistics/index",
    "pages/protocol/index",
    "pages/policy/index",
  ],
  requiredPrivateInfos: ["chooseAddress"],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTextStyle: "black",
    onReachBottomDistance: 50,
    enableShareAppMessage: true,
  },
  tabBar: {
    color: "#8a8a8a",
    selectedColor: "#E8443A",
    backgroundColor: "#fff",
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
        iconPath: "./assets/images/index.png",
        selectedIconPath: "./assets/images/index_select.png",
      },
      {
        pagePath: "pages/classification/index",
        text: "分类",
        iconPath: "./assets/images/coterie.png",
        selectedIconPath: "./assets/images/coterie_select.png",
      },
      {
        pagePath: "pages/myIndex/index",
        text: "我的",
        iconPath: "./assets/images/my.png",
        selectedIconPath: "./assets/images/my_select.png",
      },
    ],
  },
};
