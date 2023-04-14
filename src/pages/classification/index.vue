<template>
  <view class="category">
    <view class="category-search">
      <input class="search-input" placeholder="请输入搜索关键词" @input="handleSearchInput" />
      <view class="search-btn" @tap="handleSearch">搜索</view>
    </view>

    <view class="category-wrapper">
      <view class="category-list">
        <view v-for="(item, index) in leftList" :key="index"
          :class="['category-item', { active: currentIndex === index }]" @tap="handleItemClick(index)">
          {{ item.name }}
        </view>
      </view>

      <scroll-view class="sub-category" scroll-y>
        <view v-for="(item, index) in rightList" :key="index" class="sub-category-item" :id="item.id">
          <view class="item-header">{{ item.name }}</view>
          <view class="item-list">
            <view v-for="(subItem, subIndex) in item.subList" :key="subIndex" class="item"
              @tap="handleSubItemClick(subItem)">
              {{ subItem.name }}
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Taro from '@tarojs/taro';
import { get, post } from '../../utils/request'

const leftList = ref([]);
const rightList = ref([]);
const currentIndex = ref(0);
const searchValue = ref('');

onMounted(() => {
  getClassification(1);
});

async function getClassification(typeId) {
  try {
    const { data } = await get('/api/goods/getClassiFication', { typeId });
    leftList.value = data.list;
    currentIndex.value = 0;
    rightList.value = data.list[0].subList;
  } catch (err) {
    console.log(err);
  }
}

function handleItemClick(index) {
  currentIndex.value = index;
  rightList.value = leftList.value[index].subList;
}

function handleSubItemClick(item) {
  // TODO: 处理子分类点击事件，例如跳转到对应的商品列表页
}

function handleSearchInput(event) {
  searchValue.value = event.target.value;
}

function handleSearch() {
  Taro.navigateTo({
    url: '/pages/goodsSearch/index?keyword=' + searchValue.value
  })
}

</script>

<style scoped>
.category {
  height: 100%;
}

.category-search {
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: #f5f5f5;
}

.search-input {
  flex: 1;
  height: 30px;
  padding: 0 10px;
  border: none;
  border-radius: 15px;
  background-color: #fff;
  font-size: 14px;
}

.search-btn {
  margin-left: 10px;
  width: 60px;
  height: 30px;
  border: none;
  border-radius: 15px;
  background-color: #007aff;
  color: #fff;
  font-size: 14px;
}

.category-wrapper {
  display: flex;
  height: calc(100% - 70px);
}

.category-list {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.category-left {
  width: 30%;
  height: calc(100vh - 120rpx);
  background-color: #f6f6f6;
  overflow-y: auto;
  position: fixed;
  left: 0;
  top: 120rpx;
}

.category-right {
  width: 70%;
  height: calc(100vh - 120rpx);
  background-color: #fff;
  overflow-y: auto;
  padding: 20rpx;
  margin-left: 30%;
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100rpx;
  font-size: 28rpx;
  color: #333;
  cursor: pointer;
  border-bottom: 1px solid #e6e6e6;
}

.category-item.active {
  color: #f00;
  font-weight: bold;
  background-color: #fff;
  border-left: 2px solid #f00;
  border-bottom: none;
}

.sub-category-list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20rpx;
}

.sub-category-item {
  width: calc(33.33% - 20rpx);
  margin-right: 20rpx;
  margin-bottom: 20rpx;
  box-sizing: border-box;
  text-align: center;
}

.sub-category-image {
  width: 100%;
  height: 200rpx;
  margin-bottom: 10rpx;
}


.sub-category-name {
  font-size: 28rpx;
  color: #333;
}

.sub-category-list {
  display: flex;
  flex-wrap: wrap;
  padding: 10rpx;
  background-color: #f5f5f5;
}

.sub-category-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc((100% - 30rpx) / 3);
  height: 100rpx;
  margin-right: 10rpx;
  margin-bottom: 10rpx;
  background-color: #fff;
  border-radius: 8rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  color: #666;
  font-size: 28rpx;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.sub-category-item.active {
  color: #f00;
}

.sub-category-item:last-child {
  margin-right: 0;
}

.search-bar {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background-color: #fff;
}

.search-input {
  flex: 1;
  height: 60rpx;
  line-height: 60rpx;
  padding: 0 20rpx;
  border: none;
  background-color: #f5f5f5;
  border-radius: 30rpx;
  color: #666;
  font-size: 28rpx;
  outline: none;
}

.search-button {
  width: 120rpx;
  height: 60rpx;
  margin-left: 20rpx;
  border: none;
  background-color: #f00;
  border-radius: 30rpx;
  color: #fff;
  font-size: 28rpx;
}
</style>