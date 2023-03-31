/*
 * @Author: lizesheng
 * @Date: 2023-03-07 12:01:55
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-03-30 16:15:05
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
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTextStyle: "black",
  },
  tabBar: {
    color: "#8a8a8a",
    selectedColor: "#E50F86",
    backgroundColor: "#fff",
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
        iconPath: "./static/images/index.png",
        selectedIconPath: "./static/images/index_select.png",
      },
      {
        pagePath: "pages/classification/index",
        text: "分类",
        iconPath: "./static/images/coterie.png",
        selectedIconPath: "./static/images/coterie_select.png",
      },
      {
        pagePath: "pages/myIndex/index",
        text: "我的",
        iconPath: "./static/images/my.png",
        selectedIconPath: "./static/images/my_select.png",
      },
    ],
  },
};
