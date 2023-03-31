<!--
 * @Author: lizesheng
 * @Date: 2023-03-25 14:51:26
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-03-25 20:36:08
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
    <view class="search-list">
      <view @tap="handleJumpGoodsDetails(item.id)" v-for="(item, index) in searchList" class="flex-container search-item">
        <image :src="item.pictureUrl"></image>
        <view>
          <view class="name text-ellipsis">{{ item.name }}</view>
          <view class="price"><text class="symbol">¥</text>{{ item.price.toFixed(2) }}</view>
          <view class="volume"><text class='tips'>已售</text>{{ item.volume }}</view>
        </view>
      </view>
      <view v-if="searchList?.length === 0" class="nothing">
        <child-icon value="icon-wushuju" size="60" />
        <view class="nothing-text">暂无数据</view>
      </view>
    </view>
  </view>
</template>

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
      color: #E50F86;
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
