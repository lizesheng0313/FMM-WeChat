<!--
 * @Author: lizesheng
 * @Date: 2023-03-25 14:51:26
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-04-15 09:44:16
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /shop/src/pages/goodsSearch/index.vue
-->
<template>
  <view class="goods-search">
    <view class="search">
      <child-icon value="icon-sousuo" size="20" class="icon" />
      <input bindconfirm="onSearch" :value="handleSearch" @input="handleChange" class="search-icon" placeholder="请输入相关关键词"
        placeholder-class="placeholder-class" @confirm="handleSearch" confirm-type="search" />
      <view @tap="handleSearch">搜索</view>
    </view>
    <searchListView :searchList="searchList"></searchListView>
    <view class="recommend" v-show="searchList.length === 0">
      <view class="box">
        <view class="flexCenter line_box">
          <view class="line"></view>
          <view class="title">热门推荐</view>
          <view class="line"></view>
        </view>
      </view>
      <productList :productList="recommendList" :borderShow="true"></productList>
    </view>
  </view>
</template>

<script setup>
import Taro, { useReachBottom, useLoad } from '@tarojs/taro'
import { get } from '../../utils/request'
import { ref, reactive } from 'vue'
import searchListView from '../../components/searchList.vue'
import childIcon from '../../components/Icon.vue'
import productList from '../../components/Product.vue'
const searchValue = ref('')
const page = reactive({
  pageIndex: 1,
  pageSize: 10
})
const isLoad = ref('false')
const total = ref(0)
const handleChange = (e) => {
  searchValue.value = e.target.value;
}
const recommendList = ref([])
useLoad((e) => {
  if (e.keyword) {
    searchValue.value = e.keyword
    handleSearch()
  }
  get('/api/home/getHomeGoods', { recommend: 1 }).then(res => {
    recommendList.value = res.data.list
  })
})
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
    isLoad.value = true
    page.pageIndex = 1
    Taro.hideLoading()
    searchList.value = res.data.list
    total.value = res.data.total
  })
}

// 下拉加载事件
useReachBottom(() => {
  if (searchList.value?.length < total.value) {
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
})


</script>
<style lang="scss">
.goods-search {
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
      margin-right: 30px;
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

  .recommend {
    margin-top: 550px;

    .box {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .line_box {
      margin-bottom: 50px;
    }

    .line {
      width: 100px;
      height: 3px;
      background: #000;
    }

    .title {
      margin: 0 40px;
    }
  }
}
</style>
