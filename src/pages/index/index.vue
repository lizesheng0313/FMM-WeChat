<template>
  <view class="home">
    <view class="p20">
      <view class="header-top"></view>
      <view class="header">
        <view class="title" :style="{ height: `${navHeight}px`, paddingTop: `${statusHeight}px` }">
          <text class="top">肥猫猫商城</text>
          <text class="tip">私密发货</text>
        </view>
        <view class="search" @tap="handleJumpSearch">
          <child-icon value="icon-sousuo" size="18" />
          <view class="search-icon">搜索商品</view>
        </view>
        <view class="swiper">
          <swiper class='test-h' indicator-active-color='#fff' :circular="true" :indicator-dots="true" :autoplay="true">
            <swiper-item v-for="item in swiperList" :key="item.id" @tap="handleJump(item)">
              <image :src="item.url" mode="widthFix"></image>
            </swiper-item>
          </swiper>
        </view>
      </view>
    </view>
    <view class="classifcation p20">
      <view v-for="(item,index) in iconList" class="class-item" @tap="handleSubItemClick(item)">
        <view class="icon" :style="{ background: colorList[index]}">
          <image :src="item.icon" class="icon_image"></image>
        </view>
        <view>{{ item.label }}</view>
      </view>
    </view>
    <view class="line"></view>
    <view class="scroll-view p20">
      <view class="title">热卖推荐</view>
      <scroll-view :scroll-x="true" class="scroll-view-warp">
        <view className='flex-container'>
          <view class="scroll-item" v-for="item in recommendList" @tap="handleJumpGoodsDetails(item.id)">
            <image :src="item.pictureUrl"></image>
            <view class="name text-ellipsis">{{ item.name }}</view>
            <view class="price">¥{{ item.skuPrice.toFixed(2) }}</view>
          </view>
        </view>
      </scroll-view>
    </view>
    <view class="line"></view>
    <view class="scroll-view p20">
      <view class="title">新品推荐</view>
      <scroll-view :scroll-x="true" class="scroll-view-warp">
        <view className='flex-container'>
          <view class="scroll-item" v-for="item in latestList" @tap="handleJumpGoodsDetails(item.id)">
            <image :src="item.pictureUrl"></image>
            <view class="name text-ellipsis">{{ item.name }}</view>
            <view class="price">¥{{ item.skuPrice.toFixed(2) }}</view>
          </view>
        </view>
      </scroll-view>
    </view>
    <scroll-view :scroll-x="true">
      <view class="home_type">
        <view v-for="(item, index) in randomList" :key="item.value" class="home_item"
          :class="{ 'active': currentSelect === index }" @tap="toggleSelect(index, item.value)">
          <view>{{ item.label }}</view>
        </view>
      </view>
    </scroll-view>
    <view class="product_box">
      <product-vue :product-list="classificationList"></product-vue>
    </view>
  </view>
</template>

<script setup>
import Taro, { useReachBottom } from '@tarojs/taro'
import { get } from '../../utils/request'
import childIcon from '../../components/Icon.vue'
import productVue from '../../components/Product.vue'
import { ref, watch, reactive,onMounted } from 'vue'

const sysinfo = Taro.getSystemInfoSync()
const statusHeight = ref(sysinfo.statusBarHeight)
const isiOS = sysinfo.system.indexOf('iOS') > -1
const navHeight = ref(!isiOS ? 46 : 44)
const swiperList = ref('')
const colorList= [
  'linear-gradient(to bottom, #AFD8FD, #7CBCF9)',
  'linear-gradient(to bottom, #FBA4A5, #FA6B72)',
  'linear-gradient(to bottom, #BAF8D5, #8CE4BB)',
  'linear-gradient(to bottom, #AFD8FD, #7CBCF9)',
  'linear-gradient(to bottom, #FDAFC3, #FDB8CC)',
  'linear-gradient(to bottom, #FAD399, #FAA443)',
  'linear-gradient(to bottom, #AFD8FD, #7CBCF9)',
  'linear-gradient(to bottom, #FBA4A5, #FA6B72)',
  'linear-gradient(to bottom, #FBA4A5, #FA6B72)',
  'linear-gradient(to bottom, #AFD8FD, #7CBCF9)',
  'linear-gradient(to bottom, #FAD399, #FAA443)'
]
const iconList = ref([])
const recommendList = ref([]) //推荐
const latestList = ref([]) // 最新
const randomList = ref([])
const currentSelect = ref(0)
const classificationList = ref([])
const currentWatch = ref('')
const page = reactive({
  pageIndex: 1,
  pageSize: 10,
  classification: '',
})
const handleJump = (item) => {
  Taro.navigateTo({
    url: item.path
  })
}
const total = ref(0)
get('/api/home/getClassifcation',{is_show_home:1}).then(res=>{
  iconList.value = res?.data
})
get('/api/home/getBanner').then(res => {
  swiperList.value = res.data.list
})
get('/api/home/getClassifcation').then(res => {
  randomList.value = getRandomItems(res.data.list, res.data.list?.length)
  currentWatch.value = randomList.value[0].id
})

get('/api/home/getHomeGoods', { recommend: 1}).then(res => {
  recommendList.value = res.data.list
})
get('/api/home/getHomeGoods', { latest: 1}).then(res => {
  latestList.value = res.data.list
})

function handleSubItemClick(item) {
  Taro.navigateTo({
    url: '/pages/goodsList/index?classification=' + item.id
  })
}

// 商品分类
const handleJumpClass = () => {
  Taro.switchTab({
    url: '/pages/classification/index'
  })
}

// 商品详情
const handleJumpGoodsDetails = (id) => {
  Taro.navigateTo({
    url: '/pages/goodsDetails/index?id=' + id
  })
}

// 搜索页面
const handleJumpSearch = () => {
  Taro.navigateTo({
    url: '/pages/goodsSearch/index'
  })
}

// 分类查询页面
const handleJumpGoods = () => {
  Taro.navigateTo({
    url: '/pages/goodsList/index'
  })
}

watch(currentWatch, (newValue, oldValue) => {
  page.classification = newValue
  page.pageIndex = 1
  get('/api/home/getClassGoods', { ...page}).then(res => {
    classificationList.value = res.data.list
    total.value = res.data.total
  })
}
);

function getRandomItems(arr, count) {
  const result = [];
  while (result.length < count) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    const randomItem = arr[randomIndex];
    if (!result.includes(randomItem)) {
      result.push(randomItem);
    }
  }
  return result;
}

function toggleSelect(index, value) {
  currentSelect.value = index
  currentWatch.value = value
}

useReachBottom(() => {
  if (classificationList.value?.length < total.value) {
    page.pageIndex += 1
    Taro.showLoading({
      title: '加载中...',
      mask: true
    })
    get('/api/home/getClassGoods', page).then(res => {
      Taro.hideLoading()
      classificationList.value = classificationList.value.concat(res.data.list)
      total.value = res.data.total
    })
  }
})

const onShareAppMessage = () => {
  return {
    title: '肥猫猫情趣商城',
    imageUrl: '',
    path: '/pages/index/index'
  }
}


</script>

<style lang="scss" >
.home {
  background: #fff;
  position: relative;

  .p20 {
    padding: 0 20px;
    box-sizing: border-box;
  }

  .home_type {
    display: flex;

    .home_item {
      background: #F5F5F5;
      height: 75px;
      align-items: center;
      display: flex;
      padding: 0 20px;
      flex-shrink: 0;
      justify-content: center;
      margin-top: 20px;
    }

    .active {
      color: #F06292;
      border-radius: 10px;
    }
  }

  .scroll-view {
    padding-top: 20px;

    .scroll-view-warp {
      margin-top: 20px;
      display: flex;

    }

    .scroll-item {
      width: 160px;
      margin-right: 10px;
      margin-left: 5px;

      .name {
        font-size: 28px;
      }

      .price {
        color: #E8443A;
        margin-top: 10px;
      }

      image {
        width: 160px;
        height: 160px;
        border-radius: 10px;
      }
    }

    .title {
      font-weight: bold;
      font-size: 30px;
      padding-left: 13px;
    }
  }

  .line {
    background: #F5F5F5;
    height: 10px;
    margin-top: 30px;
  }

  .product_box {
    background: #F5F5F5;
    padding-bottom: 30px;
  }

  .header {
    position: relative;
    z-index: 1;

    .title {
      color: #fff;
      display: flex;
      align-items: center;

      .top {
        font-size: 28px;
        margin-right: 15px;
      }

      .tip {
        font-size: 24px;
      }
    }

    .search {
      padding-left: 20px;
      display: flex;
      background: #fff;
      border-radius: 100px;
      height: 60px;
      align-items: center;
      color: #8a8a8a;
      font-size: 26px;

      .search-icon {
        margin-left: 25px;
      }
    }
  }

  .header-top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 350px;
    background: linear-gradient(to bottom, #E8443A, #F06292);
    border-radius: 0 0 100px 100px;
    padding: 0 30px;


  }

  .classifcation {
    display: flex;
    padding-top: 30px;
    justify-content: space-around;
    flex-wrap: wrap;

    .icon {
      height: 90px;
      display: flex;
      width: 90px;
      justify-content: center;
      border-radius: 15px;
      align-items: center;

      .icon_image {
        width: 80px;
        border-radius: 15px;
        height: 80px;
      }
    }

    .class-item {
      flex-basis: 20%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

  .classifcation .class-item:nth-child(n+6) {
    margin-top: 30px;
  }

  .swiper {
    width: 100%;
    height: 350px;
    border-radius: 20px;
    overflow: hidden;
    margin-top: 20px;

    swiper {
      border-radius: 10px;
      height: 100%;
    }

    swiper-item {
      border-radius: 10px;
    }

    image {
      width: 100%;
    }
  }
}
</style>
