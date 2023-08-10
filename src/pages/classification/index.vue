<template>
  <view class="category">
    <view class="search">
      <child-icon value="icon-sousuo" size="20" class="icon" />
      <input bindconfirm="onSearch" :value="handleSearch" @input="handleSearchInput" class="search-icon"
        placeholder="请输入相关关键词" placeholder-class="placeholder-class" @confirm="handleSearch" confirm-type="search" />
    </view>
    <view class="category-wrapper">
      <view class="category-left">
        <view v-for="(item, index) in leftList" :key="index"
          :class="['category-item', { active: currentIndex === index }]" @tap="handleItemClick(item, index)">
          {{ item.label }}
        </view>
      </view>

      <scroll-view class="sub-category" scroll-y>
        <view v-for="(item, index) in rightList" :key="index" class="sub_first" :id="'a' + leftList[index].value">
          <view class="category_title">
            <view class="line"></view>
            <view class="title">{{ leftList[index].label }}</view>
            <view class="line"></view>
          </view>
          <view class="sub_box">
            <view v-for="(it, i) in item" @tap="handleSubItemClick(it)" class="sub-category-item">
              <image class="sub-category-image" :src="it?.picture"></image>
              <view class="item-header">{{ it.label }}</view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import Taro, { useLoad, usePageScroll } from '@tarojs/taro'
import { ref } from 'vue';
import { get, post } from '../../utils/request'
import childIcon from '../../components/Icon.vue'


const leftList = ref([]);
const rightList = ref([]);
const currentIndex = ref(0);
const searchValue = ref('');
const targetRects = ref()
const app = Taro.getAccountInfoSync()
useLoad(() => {
  getClassification()
})

async function getClassification() {
  try {
    const { data } = await get('/api/goods/getClassiFication',{
      eid:app?.miniProgram?.appId,
    });
    leftList.value = data.leftList;
    rightList.value = data.rightList;
    currentIndex.value = 0;
    setTimeout(() => {
      Taro.createSelectorQuery()
        .selectAll('.sub_first')
        .boundingClientRect((rects) => {
          targetRects.value = rects
        })
        .exec()
    }, 10)
  } catch (err) {

    console.log(err);
  }
}

usePageScroll((event) => {
  if (targetRects.value) {
    for (let i = targetRects.value.length - 1; i >= 0; i--) {
      const rect = targetRects.value[i]
      if (event.scrollTop + 50 >= rect.top) {
        currentIndex.value = i
        break;
      }
    }
  }
})

function handleItemClick(item, index) {
  currentIndex.value = index;
  Taro.pageScrollTo({
    selector: '#a' + item.value,
    duration: 300
  })
}

function handleSubItemClick(item) {
  Taro.navigateTo({
    url: '/pages/goodsList/index?classification=' + item.value
  })
}

function handleSearchInput(event) {
  searchValue.value = event.target.value;
}

function handleSearch() {
  Taro.navigateTo({
    url: '/pages/goodsList/index?keyword=' + searchValue.value
  })
}

const onShareAppMessage = () => {
  return {
    title: '肥猫猫情趣商城',
    imageUrl: '',
    path: '/pages/index/index'
  }
}


</script>

<style lang="scss">
.category {
  height: 100%;

  .search {
    position: fixed;
    top: 0;
    display: flex;
    align-items: center;
    right: 0;
    padding: 0 30px;
    margin-bottom: 20px;
    left: 0;
    z-index: 2;

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

.category-search {
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: #f5f5f5;
}

.category_title {
  display: flex;
  justify-content: center;
  align-items: center;

  .title {
    margin: 0 20px;
    font-weight: bold;
  }

  .line {
    width: 90px;
    background: #eee;
    height: 2px;
  }
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



.category-left {
  top: 80px;
  width: 200px;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  background-color: #f6f6f6;
  overflow-y: auto;
  min-height: calc(100vh - 80px);
  position: fixed;

  .category-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 90px;
    color: #333;
    cursor: pointer;
    border-left: 2px solid #f6f6f6;
    border-bottom: 1px solid #e6e6e6;
  }

  .category-item.active {
    color: #E8443A;
    font-weight: bold;
    background-color: #fff;
    border-left: 2px solid #E8443A;
    border-bottom: 1px solid #fff;
  }
}




.sub-category {
  margin-top: 100px;
  margin-left: 200px;

  .sub_first {
    padding-top: 100px;
  }

  .sub_first:first-child {
    padding-top: 10px;
  }

  .sub_box {
    display: flex;
    flex-wrap: wrap;
  }

  .sub-category-item {
    margin-top: 30px;
    width: calc(33.33% - 10px);
    margin-right: 10px;
    margin-bottom: 10px;
    box-sizing: border-box;
    text-align: center;
  }

  .sub-category-image {
    width: 120px;
    height: 120px;
  }

  .sub-category-name {
    font-size: 28rpx;
    color: #333;
  }
}
</style>