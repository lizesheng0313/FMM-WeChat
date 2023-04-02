<!--
 * @Author: lizesheng
 * @Date: 2023-03-25 14:51:26
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-04-02 17:02:49
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /shop/src/pages/orderList/index.vue
-->
<template>
  <view class="order_list">

  </view>
</view></template>

<script setup>
import Taro from '@tarojs/taro'
import { get } from '../../utils/request'
import { ref, reactive } from 'vue'
import childIcon from '../../components/Icon.vue'
const searchValue = ref('')
const page = reactive({
  pageIndex: 1,
  pageSize: 10
})
const total = ref(0)
const handleChange = (e) => {
  searchValue.value = e.target.value;
}
// 商品详情
const handleJumpGoodsDetails = (id) => {
  Taro.navigateTo({
    url: '/pages/goodsDetails/index?id=' + id
  })
}

const searchList = ref([])
const handleSearch = () => {
  Taro.showLoading({
    title: '搜索中...',
    mask: true
  })
  get('/api/searchGoods', {
    keyword: searchValue.value,
    pageIndex: page.pageIndex,
    pageSize: page.pageSize
  }).then(res => {
    page.pageIndex = 1
    Taro.hideLoading()
    searchList.value = res.data.list
    total.value = res.data.total
  })
}

// 下拉加载事件
function onPullDownRefresh() {
  if (searchList.value?.length < total) {
    Taro.showLoading({
      title: '搜索中...',
      mask: true
    })
    get('/api/searchGoods', {
      keyword: searchValue.value,
      pageIndex: page.pageIndex,
      pageSize: page.pageSize
    }).then(res => {
      page.pageIndex += 1
      Taro.hideLoading()
      searchList.value = searchList.value.concat(res.data.list)
      total.value = res.data.total
    })
  }
}


</script>
<style lang="scss">
.order_list {}
</style>
