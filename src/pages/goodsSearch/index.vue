<!--
 * @Author: lizesheng
 * @Date: 2023-03-25 14:51:26
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-04-14 10:07:40
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
  </view>
</template>

<script setup>
import Taro, { useReachBottom, useLoad } from '@tarojs/taro'
import { get } from '../../utils/request'
import { ref, reactive } from 'vue'
import searchListView from '../../components/searchList.vue'
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

useLoad(() => {
  if (e.keyword) {
    searchValue.value = e.keyword
    handleSearch()
  }
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

  .search-list {
    position: relative;
    min-height: 90vh;
    padding: 0 20px;

    .search-item {
      margin-top: 20px;
      border-bottom: 1px solid #eee;
      padding-bottom: 20px;
    }

    .name {
      height: 80px;
    }

    .volume {
      margin-top: 15px;
      font-size: 24px;
      color: #777;
    }

    .price {
      color: #E8443A;
      font-size: 32px;
    }

    image {
      width: 180px;
      border-radius: 10px;
      height: 180px;
      margin-right: 20px;
    }

    .nothing {
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -40%);
    }

    .nothing-text {
      font-size: 24px;
      color: #777;
      margin-top: 10px;
      position: relative;
      left: 25px;
    }
  }
}
</style>
