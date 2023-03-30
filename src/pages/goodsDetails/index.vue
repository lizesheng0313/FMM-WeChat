<!--
 * @Author: lizesheng
 * @Date: 2023-03-25 14:43:40
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-03-30 09:35:56
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /shop/src/pages/goodsDetails/index.vue
-->
<template>
  <view class="goods_details">
    <view class="swiper">
      <swiper class='swiper' :autoplay="true" indicator-active-color='#fff' :circular="true" :indicator-dots="true">
        <swiper-item v-for="item in goodsDetils?.pictureList" :key="item.id">
          <image :src="item" mode="widthFix"></image>
        </swiper-item>
      </swiper>
    </view>
    <view class="info">
      <view class="price"><text class="symbol">￥</text>{{ goodsDetils?.sku[0]?.skuPrice?.toFixed(2) }}<text
          class="q">起</text></view>
      <view class="name">{{ goodsDetils?.name }}</view>
      <view class="stock">
        <view>原价:￥{{ goodsDetils?.sku[0]?.skuOriginPrice }}</view>
        <view>库存:{{ goodsDetils?.sku[0]?.skuStock }}</view>
        <view>销量:{{ goodsDetils?.volume }}人购买</view>
      </view>
    </view>
    <view class="line"></view>
    <view class="select-box" @tap="handleShowPopup">
      <view class="grey select_name">已选择: </view>
      <view>
        <view class="current_name">{{ currentSelect?.name }}</view>
        <view class="flexCenter">
          <view class="select_itme">
            <view v-for="item in goodsDetils?.sku">
              <image :src="item.goods_picture" class="select_image" />
            </view>
          </view>
          <view class="spec">共{{ goodsDetils?.sku?.length }}种规格可选</view>
        </view>
      </view>
      <child-icon class="right_arrow grey" value="icon-youjiantou" size="14"></child-icon>
    </view>
    <view class="line"></view>
    <view>
      <view class="title">产品介绍</view>
      <rich-text style="font-size:0" :nodes="goodsDetils?.introduction"></rich-text>
    </view>
    <view class="footer">
      <view class="footer-icon">
        <child-icon value="icon-shouye1" size="18" class="icon" />
        <view class="footer_title">首页</view>
      </view>
      <view class="service footer-icon">
        <child-icon value="icon-kefu" size="17" class="icon service_icon" />
        <view class="footer_title">客服</view>
      </view>
      <view class="button_buy" @tap="handleShowPopup">立即购买</view>
    </view>
    <page-container :show="isShowPopup" :round="true" :overlay="true" position="bottom" class="popup"
      @clickoverlay="handleOverly">
      <view>
        <view @tap="() => {
          isShowPopup = false
        }"> <child-icon class="close" value="icon-guanbi1" size="18"></child-icon></view>
        <view class="flexCenter">
          <image class="sku_image" :src="currentSelect?.goods_picture"></image>
          <view class="sku_info">
            <view class="text-ellipsis1">{{ goodsDetils?.name }}</view>
            <view class="price"><text class="symbol">￥</text>{{ currentSelect?.skuPrice }}</view>
            <view class="stock">库存：{{ currentSelect?.skuStock }}</view>
          </view>
        </view>
        <view class="spec_box">
          <view v-for="(item, rowIndex) in goodsDetils?.specification">
            <view class="tag">{{ item.name }}</view>
            <view class="flex tag_children">
              <view v-for="(it, colIndex) in item.tag">
                <view class="tag_select" :class="{ active: activeArray[rowIndex] === colIndex }"
                  @tap="handleSelectSpec(it, rowIndex, colIndex)">
                  {{ it }}
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="flexBetWeenCenter">
          <view>数量</view>
          <view class="flexCenter">
            <view class="btn" @tap="handleMinus">-</view>
            <view class="total">{{ state.totalNumber }}</view>
            <view class="btn" @tap="handlePlus">+</view>
          </view>
        </view>
        <view class="btn_buy" @tap="handleJumpOrder">确定购买</view>
      </view>
    </page-container>
  </view>
</template>
<script setup>
import { useRouter } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import { ref, reactive } from 'vue'
import { get, post } from '../../utils/request'
import childIcon from '../../components/Icon.vue'
import popup from '../../components/Popup.vue'
const router = useRouter()
const goodsDetils = ref()
const isShowPopup = ref(true)
const currentSelect = ref({})
const activeArray = ref([0, 0])
const state = reactive({
  totalNumber: 1
})
get('/api/goods/getDetails', {
  id: router.params.id
}).then(res => {
  res.data.specification = JSON.parse(res?.data?.specification) || []
  goodsDetils.value = res.data
  currentSelect.value = goodsDetils.value?.sku[0]
})

const handleJumpOrder = () => {

}

Taro.showShareMenu({
  withShareTicket: true
})
// 设置分享信息
Taro.updateShareMenu({
  title: goodsDetils?.name,
  imageUrl: goodsDetils?.sku && goodsDetils?.sku[0]?.goods_picture,
  path: '/pages/goodsDetails/index' + goodsDetils?.id
})

const handleShowPopup = () => {
  isShowPopup.value = true
}

const handleSelectSpec = (item, rowIndex, colIndex) => {
  activeArray.value[rowIndex] = colIndex
  if (rowIndex === 0) {
    currentSelect.value = goodsDetils.value?.sku.filter(it => it.name0.includes(item) && it.goods_picture)[0]
  }
}

const handleOverly = (event) => {
  isShowPopup.value = true
  event.stopPropagation()
}

function handleMinus() {
  if (state.totalNumber > 1) {
    state.totalNumber--
  }
}

function handlePlus() {
  state.totalNumber++
}

</script>
<style lang="scss">
.goods_details {

  .popup {
    position: relative;

    .flexBetWeenCenter {
      margin-top: 20px;
      padding: 0 30px;
    }

    .total {
      margin: 0 10px;
    }

    .btn_buy {
      background: #E50F86;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      height: 60px;
      margin: 20px 30px 30px 30px;
      border-radius: 100px;
    }

    .btn {
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border: 1px solid #ccc;
      margin: 0 10px;
    }

    .tag {
      margin-bottom: 10px;
      color: #979797;
    }

    .tag_children {
      flex-wrap: wrap;
    }

    .spec_box {
      padding-top: 40px;
      padding-left: 20px;
    }

    .tag_select {
      padding: 10px 25px;
      border-radius: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f1f1f1;
      color: #333;
      flex-shrink: 0;
      margin-top: 15px;
      margin-right: 30px;
    }

    .active {
      background: #F06292;
      color: #fff;
      border: 1px solid #E50F86;
    }

    .close {
      position: absolute;
      right: 20px;
      top: 20px;
    }

    .stock {
      color: #b5b4b4;
      font-size: 24px;
    }

    .symbol {
      font-size: 24px;
      margin-right: 6px;
    }

    .price {
      font-size: 30px;
      color: #E50F86;
    }

    .sku_image {
      width: 130px;
      height: 130px;
      border-radius: 10px;
      flex-shrink: 0;
      margin-top: 20px;
      margin-left: 20px;
    }

    .sku_info {
      padding: 20px 50px 0px 20px;
    }
  }

  .select-box {
    padding: 10px 20px;
    display: flex;
    position: relative;

    .select_name {
      margin-right: 30px;
    }

    .right_arrow {
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
    }

    .select_image {
      width: 80px;
      height: 80px;
      margin-right: 10px;
    }

    .select_itme {
      display: flex;
      flex-wrap: wrap;
      width: 280px;
    }

    .current_name {
      padding-left: 10px;
    }

    .spec {
      background: #faf6f6;
      height: 50px;
      padding: 10px 10px;
      margin-left: 10px;
      border-radius: 15px;
      color: #777;
      font-size: 24px;
    }
  }

  .footer {
    padding: 0 20px;
    position: fixed;
    bottom: 0;
    left: 0;
    align-items: center;
    display: flex;
    right: 0;
    height: 90px;
    background: #fff;

    .button_buy {
      flex: 1;
      background: #E50F86;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 100px;
      height: 70px;
    }

    .footer_title {
      color: #b5b4b4;
      font-size: 24px;
    }

    .footer-icon {
      height: 80px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
    }

    .service {
      position: relative;
      margin-left: 10px;
      margin-right: 20px;
    }

    .service_icon {
      position: relative;
      top: 4px;
    }
  }

  .swiper {
    width: 100%;
    height: 700px;

    image {
      width: 100%;
      height: 100%;
      display: block;
    }
  }

  .line {
    background: #F5F5F5;
    height: 20px;
  }

  .info {
    padding: 0 30px;
    margin-bottom: 20px;

    .price {
      margin-top: 20px;
      font-size: 36px;
      color: #E50F86;
    }

    .symbol {
      font-size: 24px;
      margin-right: 6px;
    }

    .q {
      font-size: 24px;
    }

    .name {
      margin-top: 20px;
      font-size: 32px;
    }

    .stock {
      font-size: 24px;
      margin-top: 15px;
      display: flex;
      justify-content: space-between;
      color: #b5b4b4;
    }
  }

  .title {
    height: 80px;
    font-size: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  img {
    font-size: 0;
    line-height: 0;
    display: block;
  }
}
</style>