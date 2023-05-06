/*
 * @Author: lizesheng
 * @Date: 2023-03-07 12:01:55
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-05-06 14:18:23
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
    "pages/returnGoods/index",
    "pages/logistics/index",
    "pages/protocol/index",
    "pages/policy/index",
  ],
  subPackages: [
    {
      root: "pagesA",
      pages: [
        "returnDetails/index",
        "returnList/index",
        "orderList/index",
        "orderDetails/index",
      ],
      plugins: {
        logisticsPlugin: {
          version: "2.2.28",
          provider: "wx9ad912bf20548d92",
        },
      },
    },
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
