<!--
 * @Author: lizesheng
 * @Date: 2023-03-25 14:51:26
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-04-22 10:58:57
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /shop/src/pages/goodsList/index.vue
-->
<template>
  <view class="goods-search">
    <view class="search">
      <child-icon value="icon-sousuo" size="20" class="icon" />
      <input bindconfirm="onSearch" :value="handleSearch" @input="handleChange" class="search-icon" placeholder="请输入相关关键词"
        placeholder-class="placeholder-class" @confirm="handleSearch" confirm-type="search" />
    </view>
    <product :productList="searchList" :borderShow="true"></product>
    <view v-if="searchList?.length === 0" class="nothing">
      <child-icon value="icon-wushuju" size="60" />
      <view class="nothing-text">暂无数据</view>
    </view>
  </view>
</template>

<script setup>
import Taro, { useReachBottom, useLoad } from '@tarojs/taro'
import { get } from '../../utils/request'
import { ref, reactive } from 'vue'
import childIcon from '../../components/Icon.vue'
import product from '../../components/Product.vue'
const classification = ref('')
const page = reactive({
  pageIndex: 1,
  pageSize: 10,
  classification: '',
  keyword: ''
})
const total = ref(0)

const handleChange = (e) => {
  page.keyword = e.target.value;
}

useLoad((e) => {
  if (e.keyword) {
    page.keyword = e.keyword
    handleSearch()
  }
  else if (e.classification) {
    page.classification = e.classification
    handleSearchGoods()
  }
})


const handleSearchGoods = () => {
  get('/api/home/getClassGoods', page).then(res => {
    searchList.value = res.data.list
    total.value = res.data.total
  })
}

const searchList = ref([])
const handleSearch = () => {
  delete page.classification
  Taro.showLoading({
    title: '搜索中...',
    mask: true
  })
  get('/api/searchGoods', page).then(res => {
    page.pageIndex = 1
    Taro.hideLoading()
    searchList.value = res.data.list
    total.value = res.data.total

  })
}

// 下拉加载事件
useReachBottom(() => {
  if (searchList.value?.length < total.value) {
    page.pageIndex += 1
    Taro.showLoading({
      title: '加载中...',
      mask: true
    })
    const url = page.classification ? '/api/home/getClassGoods' : '/api/searchGoods'
    get(url, page).then(res => {
      Taro.hideLoading()
      searchList.value = searchList.value.concat(res.data.list)
      total.value = res.data.total
    })
  }
})


</script>
<style lang="scss">
.goods-search {
  position: relative;

  .nothing {
    position: absolute;
    top: 180px;
    left: 50%;
    transform: translateX(-50%);
  }

  .nothing-text {
    font-size: 24px;
    color: #777;
    margin-top: 10px;
    position: relative;
    left: 25px;
  }

  .search {
    display: flex;
    align-items: center;
    position: relative;
    padding: 0 30px;
    margin-bottom: 20px;

    input {
      flex-grow: 1;
      background: #F5F5F5;
      border-radius: 100px;
      height: 60px;
      padding-left: 70px;
    }

    .placeholder-class {
      padding-left: 70px;
      font-size: 28px;
    }

    .icon {
      position: absolute;
      left: 50px;
    }
  }
}
</style>
