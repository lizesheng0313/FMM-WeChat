<!--
 * @Author: lizesheng
 * @Date: 2023-03-25 14:43:40
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-04-26 17:12:52
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
      <view class="flexBetWeenCenter flex_button">
        <view class="price"><text class="symbol">￥</text>{{ goodsDetils?.sku[0]?.skuPrice?.toFixed(2) }}<text class="q"
            v-if="goodsDetils?.sku?.length > 1">起</text></view>
        <button open-type="share" class="share_button">
          <child-icon value="icon-fenxiang1" size="21" color="#777" />
        </button>
      </view>
      <view class="name">{{ goodsDetils?.name }}</view>
      <view class="stock">
        <view>原价:￥{{ goodsDetils?.sku[0]?.skuOriginPrice }}</view>
        <view>库存:{{ goodsDetils?.sku[0]?.skuStock }}</view>
        <view>销量:{{ goodsDetils?.volume }}人购买</view>
      </view>
    </view>
    <view class="line"></view>
    <view class="select-box" @tap="handleShowPopupPlease">
      <view class="grey select_name">{{ goodsDetils?.sku?.length === 1 ? '已' : '请' }}选择: </view>
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
      <child-icon @tap="handleJumpHome" value="icon-shouye1" size="19" class="icon" />
      <button class="service footer-icon" open-type="contact" :show-message-card="true"
        :send-message-title="goodsDetils?.name" :send-message-img="goodsDetils?.goods_picture">
        <child-icon value="icon-kefu" size="18" />
      </button>
      <view class="button_buy" @tap="handleShowPopup">立即购买</view>
    </view>
    <view class="mask" v-show="isShowPopup"></view>
    <view class="popup" v-show="isShowPopup">
      <view>
        <view @tap="() => {
            isShowPopup = false
          }"> <child-icon class="close" value="icon-guanbi1" size="20"></child-icon></view>
        <view class="flex">
          <image class="sku_image" :src="currentSelect?.goods_picture"></image>
          <view class="sku_info">
            <view class="price"><text class="symbol">￥</text>{{ currentSelect?.skuPrice?.toFixed(2) }}</view>
            <view class="stock grey">库存{{ currentSelect?.skuStock }}件</view>
          </view>
        </view>
        <view class="spec_box">
          <view v-for="(item, rowIndex) in goodsDetils?.specification">
            <view class="tag">{{ item.name }}</view>
            <view class="flex tag_children">
              <view v-for="(it, colIndex) in item.tag">
                <view class="tag_select" :class="{ active: activeArray[rowIndex] === colIndex }"
                  @tap="handleSelectSpec(item, it, rowIndex, colIndex)">
                  {{ it }}
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="flexBetWeenCenter total_setting">
          <view class="total_txt">数量</view>
          <view class="flexCenter border_number">
            <child-icon class="btn" value="icon-jianhao" size="18" @tap="handleMinus" />
            <view class="total">{{ state.totalNumber }}</view>
            <child-icon class="btn" size="19" value="icon-jiahao1" @tap="handlePlus" />
          </view>
        </view>
        <view class="btn_buy" @tap="handleJumpOrder">确定购买</view>
      </view>
    </view>
    <view class="login" v-show="isLogin">
      <view class="mask" v-show="isLogin"></view>
      <view class="login-page">
        <view class="login-btn">登陆提示</view>
        <view class="tips">您当前未登陆，请您确认授权登录后查看。</view>
        <child-icon class="close" @tap="handleCloseLogin" value="icon-guanbi1" size="20"></child-icon>
        <view class="open-vip" @tap="handleLogin">确定</view>
        <view class="agreement-text">
          点击登录即表示您已同意
          <text class="agreement-link" @tap="handleAgreement">《用户协议》</text>
          <text class="agreement-link" @tap="handlePrivacy">《隐私政策》</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup>
import { useRouter } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import { ref, reactive } from 'vue'
import { get, post } from '../../utils/request'
import childIcon from '../../components/Icon.vue'
import navTitle from '../../components/navTitle.vue'
let goodsInfo = {}
const router = useRouter()
const goodsDetils = ref()
const isShowPopup = ref(false)
const currentSelect = ref({})
const activeArray = ref([0, 0])
const isLogin = ref(false)
const state = reactive({
  totalNumber: 1
})
const skuId = ref('')
get('/api/goods/getDetails', {
  id: router.params.id
}).then(res => {
  const items = res.data.specification.split('|');
  const result = [];
  for (let i = 0; i < items.length; i += 2) {
    const name = items[i];
    const tagStr = items[i + 1];
    const tags = tagStr ? tagStr.split('!') : [];
    result.push({
      name,
      tag: tags,
    });
  }
  res.data.specification = result
  goodsDetils.value = res.data
  goodsInfo = res.data
  currentSelect.value = goodsDetils.value?.sku[0]
})
const handleCloseLogin = () => {
  isLogin.value = false
}
const handleJumpOrder = () => {
  if (Taro.getStorageSync('is_sure') !== '1') {
    isShowPopup.value = false
    isLogin.value = true
    return
  }
  const info = {
    goodsId: goodsDetils.value.id,
    goodsInfo: {
      ...currentSelect.value
    },
    freight: goodsDetils.value.freight,
    specification: goodsDetils.value.specification,
    name: goodsDetils.value.name,
    totalNumber: state.totalNumber
  }
  Taro.setStorageSync('goodsInfo', JSON.stringify(info))
  Taro.navigateTo({
    url: '/pages/order/index'
  })
  isShowPopup.value = false
}

const handleLogin = () => {
  Taro.showLoading({
    title: '登录中'
  })
  post('/api/program/user/update', { is_sure: '1' }).then(res => {
    Taro.setStorageSync('is_sure', '1')
    isLogin.value = false
    handleJumpOrder()
  })
}

const handleAgreement = () => {
  Taro.navigateTo({
    url: '/pages/protocol/index'
  })
}

const handlePrivacy = () => {
  Taro.navigateTo({
    url: '/pages/policy/index'
  })
}

const onShareAppMessage = () => {
  return {
    title: goodsInfo.name,
    imageUrl: goodsInfo.sku && goodsInfo.sku[0]?.goods_picture,
    path: '/pages/goodsDetails/index' + goodsInfo.id
  }
}

const handleShowPopupPlease = () => {
  isShowPopup.value = true
}

const handleShowPopup = () => {
  if (goodsDetils.value?.sku.length === 1) {
    handleJumpOrder()
    return
  }
  isShowPopup.value = true
}

const handleSelectSpec = (item, it, rowIndex, colIndex) => {
  activeArray.value[rowIndex] = colIndex
  let skuId = ''
  if (goodsDetils.value.specification.length === 1) {
    skuId = goodsDetils.value.specification[rowIndex]?.tag[colIndex]
  }
  else {
    activeArray.value.forEach((item, index) => {
      skuId += goodsDetils.value.specification[index]?.tag[item] + ",";
    })
    skuId = skuId.slice(0, -1);
  }
  currentSelect.value = goodsDetils.value.sku.filter(item => item.skuId === skuId)[0]
}


function handleMinus() {
  if (state.totalNumber > 1) {
    state.totalNumber--
  }
}

const handleJumpHome = () => {
  Taro.switchTab({
    url: '/pages/index/index'
  })
}

function handlePlus() {
  if (state.totalNumber + 1 > currentSelect.value.skuStock) {
    Taro.showToast({
      title: '库存不足',
      icon: 'none'
    })
    return
  }
  state.totalNumber++
}

</script>
<style lang="scss">
.goods_details {
  padding-bottom: 140px;

  .share_button {
    position: absolute;
    right: 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0;
    background: transparent;
    margin: 0;
    border: none;
    outline: none;
  }

  button::after {
    border: none;
  }

  .login {
    top: 0;
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    width: 100vw;
    height: 100vh;

    .close {
      position: absolute;
      right: 20px;
      top: 24px;
    }

    .login-page {
      width: 620px;
      height: 404px;
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: center;
      background: #fff;
      left: 50%;
      background: #ffffff;
      border-radius: 10px;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 4;

      .login-btn {
        font-size: 32px;
        margin-top: 24px;
        font-weight: bold;
      }

      .tips {
        margin-top: 24px;
        margin-bottom: 72px;
        color: #777;
      }

      .open-vip {
        width: 480px;
        box-shadow: 0 8px 14px 0 rgba(67, 128, 255, 0.40);
        height: 90px;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 28px 20px 28px;
        font-size: 32px;
        border-radius: 20px;
        background: #E8443A;
      }

      .agreement-text {
        font-size: 24px;
        color: #777;
      }

      .agreement-link {
        color: #a7bbe2;
      }
    }
  }

  .popup {
    position: fixed;
    height: 900px;
    right: 0;
    left: 0;
    background: #fff;
    border-radius: 30px 30px 0 0;
    z-index: 2;
    padding-top: 30px;
    animation: myfirst 0.3s ease-in forwards;

    .flexBetWeenCenter {
      margin-top: 20px;
      padding: 0 20px;
    }

    .total_txt {
      font-weight: bold;
    }

    .border_number {
      height: 60px;
      display: flex;
      align-items: center;
      border-radius: 10px;
      border: 2px solid #eee;
    }

    .btn {
      border-right: 2px solid #eee;
      border-radius: 0 10px 10px 0;
      width: 60px;
      height: 60px;
      border-right: none;
      border-left: 2px solid #eee;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #F9F9F9;
    }

    .btn:first-child {
      border-left: none;
      border-right: 2px solid #eee;
      border-radius: 10px 0 0 10px;
    }

    .total {
      margin: 0 10px;
      width: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn_buy {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: #E8443A;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      height: 80px;
      margin: 20px 30px 30px 30px;
      border-radius: 100px;
    }



    .total_setting {
      padding-top: 20px;
      padding-bottom: 20px;
    }

    .tag {
      margin-top: 30px;
      margin-bottom: 10px;
      font-weight: bold;
    }

    .tag_children {
      flex-wrap: wrap;
    }

    .spec_box {
      padding-top: 20px;
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
      background: #E8443A;
      color: #fff;
      border: 1px solid #E8443A;
    }

    .close {
      position: absolute;
      right: 30px;
      top: 20px;
    }

    .stock {
      color: #b5b4b4;
      font-size: 24px;
    }

    .sku_image {
      width: 160px;
      height: 160px;
      border-radius: 10px;
      flex-shrink: 0;
      border: 1px solid #eee;
      margin-top: 20px;
      margin-left: 20px;
    }

    .sku_info {
      padding: 20px 50px 0px 20px;

      .symbol {
        font-size: 28px;
        margin-right: 6px;
      }

      .price {
        font-size: 40px;
        color: #E8443A;
      }
    }
  }

  .select-box {
    padding: 10px 20px;
    display: flex;
    position: relative;
    align-items: flex-start;

    .select_name {
      padding-top: 20px;
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
      display: flex;
      align-items: center;
      background: #faf6f6;
      height: 50px;
      padding: 5px 20px;
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
    height: 140px;
    background: #fff;
    opacity: 0.9;

    .button_buy {
      flex: 1;
      background: #E8443A;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 100px;
      height: 90px;
    }

    .footer_title {
      color: #232323;
      font-size: 26px;
    }

    .footer-icon {
      height: 80px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
    }

    button::after {
      border: none;
    }

    .service {
      position: relative;
      display: flex;
      margin-left: 20px;
      margin-right: 20px;
      background: #fff;
      outline: none;
      border: none;
      top: -2px;
    }

    .service_icon {
      position: relative;
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
      font-size: 45px;
      color: #E8443A;
    }

    .symbol {
      font-size: 24px;
      margin-right: 6px;
    }

    .q {
      font-size: 24px;
      margin-left: 10px;
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

@keyframes myfirst {
  from {
    bottom: -100px;
  }

  to {
    bottom: 0px;
  }
}


// EA4B83 渐变起色
// EA453F 渐变终色

// EB4C82 渐变起色
// F14339 渐变终色

// EF504E 字符色
</style>

