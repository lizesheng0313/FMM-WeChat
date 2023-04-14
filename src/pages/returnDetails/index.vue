<!--
 * @Author: lizesheng
 * @Date: 2023-03-25 14:51:26
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-04-14 14:00:23
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /shop/src/pages/returnDetails/index.vue
-->
<template>
  <view class="return-details">
    <view class="header">
      <navTitle rightColor="#fff" :title="goodsDetails.status === '2' ? RETURNSTATUS[goodsDetails.status] : '退货详情'"
        color="#fff"></navTitle>
    </view>
    <view class="content">
      <view class="status">{{ goodsDetails.status === '2' ? '请将商品邮寄到以下地址' :
        RETURNSTATUS[goodsDetails.status], '请点击退货物流输入退货单号' }}
        <view v-if="goodsDetails.status === '2'" class="return_address">
          <view class="flexBetWeenCenter">
            <view class="flexCenter">
              <view>退货地址：</view>
              {{ goodsDetails?.return_address }}
              <view class="phone">{{ goodsDetails?.return_address_phone }}</view>
            </view>
            <view class="copy_address"
              @tap="() => { handleCopyTextToClipboard(goodsDetails?.return_address + goodsDetails?.return_address_phone) }">
              复制</view>
          </view>
        </view>
      </view>
      <view class="goods_info" @tap="handleJumpGoodsDetails">
        <image :src="goodsDetails.goods_picture"></image>
        <view>
          <view class="name">{{ goodsDetails?.goods_name }}</view>
          <view class="sku">数量：{{ goodsDetails?.quantity }}{{ goodsDetails?.sku_string }}</view>
          <view class="price"><text class="symbol">￥</text>{{ goodsDetails?.total_price?.toFixed(2) }}</view>
        </view>
      </view>
      <view class="order_info">
        <view class="time" v-if="goodsDetails.status === '4'"><text class="title">退货快递：</text>{{
          goodsDetails?.rlogistics_companyStr }}</view>
        <view class="time" v-if="goodsDetails.status === '4'"><text class="title">退货物流：</text>{{
          goodsDetails?.rlogistics_no }}</view>
        <view class="time" v-if="goodsDetails.status === '3'"><text class="title">拒绝原因：</text>{{
          goodsDetails.refuse_reason }}</view>
        <view class="time"><text class="title">退货原因：</text>{{ goodsDetails.reason }}</view>
        <view class="time" v-if="goodsDetails?.memo"><text class="title">退货描述：</text>{{ goodsDetails.memo }}</view>
        <view class="time" v-if="goodsDetails?.picture_list?.length > 0"><text class="title">退货凭证：</text>
          <view class="flexCenter">
            <view v-for="item in goodsDetails.picture_list" @tap="() => { handlePreviewImage(item) }">
              <image :src="item" class="certificate"></image>
            </view>
          </view>
        </view>
      </view>
      <view class="order_info">
        <view class="flexBetWeenCenter">
          <view>
            <text class="title">订单编号：</text>
            {{ goodsDetails?.order_id }}
          </view>
          <view class="copy" @tap="() => { handleCopyTextToClipboard(goodsDetails?.order_id) }">复制</view>
        </view>
        <view class="time"><text class="title">下单时间：</text>{{ getCurrentDate(goodsDetails?.create_time) }}</view>
        <view class="time"><text class="title">支付时间：</text>{{ getCurrentDate(goodsDetails?.payment_time) }}</view>
        <view class="time"><text class="title">退货/退款申请：</text>{{ getCurrentDate(goodsDetails?.apply_time) }}</view>
        <view class="time" v-if="goodsDetails?.refund_time"><text class="title">退款时间：</text>{{
          getCurrentDate(goodsDetails?.refund_time) }}</view>
      </view>
      <view class="order_price">
        <view class="flexBetWeenCenter">运费：<text>{{ goodsDetails?.freight || '免运费' }}</text>
        </view>
        <view class="flexBetWeenCenter total">金额总计：<text class="total_price"><text class="symbol">￥</text>{{
          (goodsDetails?.total_price +
            (goodsDetails?.freight ||
              0)).toFixed(2) }}</text>
        </view>
        <view v-if="goodsDetails?.pay_status === 1">实付款：{{ goodsDetails?.act_pay.toFixed(2) }}</view>
        <button class="flexCenterAll service" open-type="contact" :show-message-card="true"
          :send-message-title="goodsDetails?.name" :send-message-img="goodsDetails?.goods_picture">
          <child-icon size="20" value="icon-kefu1"></child-icon>
          <view class="text">联系客服</view>
        </button>
      </view>
    </view>
    <view class="footer">
      <view class="btn_grey" @tap="handleReturnGoods" v-if="goodsDetails?.status == '2'">退货物流</view>
      <view class="btn_grey" @tap="handleChecklogistics">查看物流</view>
      <view class="btn_red_border" @tap="handleRepurchase">再次购买</view>
    </view>
    <view class="mask" v-show="showPopup"></view>
    <view class="popup" v-if="showPopup">
      <view @tap="() => {
        showPopup = false
      }"> <child-icon class="close" value="icon-guanbi1" size="20"></child-icon></view>
      <view class="return_logistics">
        <view class="flexCenter">
          <view class="label">物流服务：</view>
          <radio-group @change="handleChangelogist" class="flexCenter radio_group">
            <view v-for="item in logisticsCompanies" class="item_radio">
              <radio :value="item.value" class="radio" color="#E8443A"></radio>
              <view>{{ item.label }}</view>
            </view>
          </radio-group>
        </view>
        <view class="flexCenter">
          <view class="label">物流单号：</view>
          <input class="input" placeholder="请输入退货物流单号" @input="handlelogNo">
        </view>
        <view class="footer_submit" @tap="handleSubmitReturnLogistic">提交</view>
      </view>
    </view>
  </view>
</template>

<script setup>

import Taro from '@tarojs/taro'
import { useLoad } from '@tarojs/taro'
import { get, post } from '../../utils/request'
import { ref, reactive } from 'vue'
import childIcon from '../../components/Icon.vue'
import navTitle from '../../components/navTitle.vue'
import { RETURNSTATUS } from '../returnList/constant'
import { getCurrentDate } from '../../utils/utils'
import { logisticsCompanies } from '../logistics/constant'
import { withCtx } from 'vue'
const goodsDetails = ref('')
const logistAddress = ref({
  id: '',
  rlogistics_company: '',
  rlogistics_no: ''
})
const showPopup = ref(false)

useLoad((e) => {
  logistAddress.value.id = e.id
  fetchDetails()
})

const fetchDetails = () => {
  get('/api/order/getReturnDetails', {
    id: logistAddress.value.id
  }).then(res => {
    goodsDetails.value = res.data
    if (res.data.rlogistics_company) {
      goodsDetails.value.rlogistics_companyStr = logisticsCompanies.filter(item => item.value === res.data.rlogistics_company)[0]?.label
    }
  })
}

const handleChangelogist = (e) => {
  logistAddress.value.rlogistics_company = e.mpEvent.detail.value
}

const handlelogNo = (e) => {
  logistAddress.value.rlogistics_no = e.target.value
}

const handleSubmitReturnLogistic = () => {
  if (!logistAddress.value.rlogistics_no || !logistAddress.value.rlogistics_company) return Taro.showToast({ title: '请输入物流信息' })
  Taro.showLoading({
    title: '提交中'
  })
  post('/api/order/postReturnLogistic', {
    ...logistAddress.value
  }).then(res => {
    fetchDetails()
    showPopup.value = false
  })
}

const handleCopyTextToClipboard = (value) => {
  Taro.setClipboardData({ data: value })
    .then(() => {
      Taro.showToast({
        title: '复制成功',
        icon: 'none',
        duration: 1000
      })
    })
}
const handleJumpGoodsDetails = () => {
  Taro.navigateTo({
    url: '/pages/goodsDetails/index?id=' + goodsDetails.value.goods_id
  })
}

const handleReturnGoods = () => {
  showPopup.value = true
}

const handlePreviewImage = (item) => {
  Taro.previewImage({
    urls: goodsDetails.value?.picture_list,
    current: item,
  })
}

// 回购
const handleRepurchase = () => {
  Taro.showLoading({ title: '回购中' })
  get('/api/goods/getDetails', {
    id: goodsDetails.value.goods_id
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
    const info = {
      goodsId: goodsDetails.value.goods_id,
      goodsInfo: {
        ...res.data?.sku[0]
      },
      specification: result,
      name: goodsDetails.value.name,
      totalNumber: 1
    }
    Taro.setStorageSync('goodsInfo', JSON.stringify(info))
    Taro.navigateTo({
      url: '/pages/order/index'
    })
  })
}

const handleChecklogistics = () => {
  const log_info = {
    logistics_no: goodsDetails.value.logistics_no,
    goods_picture: goodsDetails.value.goods_picture,
    logistics_company: goodsDetails.value.logistics_company,
    address_detail: `${goodsDetails?.value?.province}${goodsDetails?.value?.city}${goodsDetails?.value?.streetName}${goodsDetails?.value?.address_detail}`
  }
  Taro.navigateTo({
    url: '/pages/logistics/index?log_info=' + JSON.stringify(log_info)
  })
}

</script>
<style lang="scss">
@keyframes myfirst {
  from {
    bottom: -100px;
  }

  to {
    bottom: 0px;
  }
}

.return-details {
  background: #F0F1F3;
  padding-bottom: 150px;



  .popup {
    position: fixed;
    right: 0;
    left: 0;
    min-height: 400px;
    background: #fff;
    border-radius: 30px 30px 0 0;
    z-index: 2;
    padding: 40px 20px 40px 20px;
    animation: myfirst 0.3s ease-in forwards;

    .label {
      flex-shrink: 0;
    }

    .radio_group {
      flex-wrap: wrap;
      margin-left: 20px;
      margin-bottom: 40px;
    }

    .item_radio {
      margin-right: 10px;
      margin-left: 10px;
      margin-bottom: 20px;
      align-items: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex-basis: 25%;
    }

    .input {
      margin-left: 20px;
    }

    .footer_submit {
      margin: 30px 20px 0 20px;
      height: 80px;
      background: #E8443A;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 100px;
    }

    .close {
      position: absolute;
      right: 30px;
      top: 20px;
    }

    .radio {
      transform: scale(0.8);
    }
  }

  .copy_address {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #fff;
    box-sizing: border-box;
    margin-right: 10px;
    padding: 5px 20px;
    font-size: 22px;
    border-radius: 100px;
  }

  .header {
    height: 300px;
    background: linear-gradient(to bottom, #E8443A, #F06292);
  }

  .content {
    margin-top: -170px;
    padding: 0 20px;
  }

  .service {
    border: 2px solid #e6e6e6;
    font-weight: bold;
    height: 55px;
    background: #fff;
    width: 150px;
    box-sizing: content-box;
    padding: 0 10px;
    border-right: 4px solid #e6e6e6;
    outline: none;

    .text {
      margin-left: 5px;
      font-size: 22px;
      font-weight: 400;
    }
  }

  .order_price {
    margin-top: 20px;
    background: #fff;
    border-radius: 10px;
    padding: 20px;

    .total {
      margin-top: 30px;
    }

    .total_price {
      font-weight: bold;
    }

    text {
      color: #000;
    }
  }

  .order_info {
    margin-top: 20px;
    background: #fff;
    border-radius: 10px;
    padding: 20px;

    .title {
      color: #333;
    }

    .time {
      margin-top: 10px;
    }

    .copy {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #A8A8A8;
      box-sizing: border-box;
      margin-right: 10px;
      padding: 5px 20px;
      font-size: 22px;
      border-radius: 100px;
    }
  }

  .status {
    color: #fff;
    font-size: 32px;
    position: relative;
    padding-left: 20px;
  }

  .return_address {
    font-size: 28px;
    margin-top: 10px;
    margin-bottom: 30px;
  }

  .goods_info {
    border-radius: 10px;
    display: flex;
    background: #fff;
    padding: 20px;
    margin-top: 40px;

    image {
      width: 150px;
      height: 150px;
      flex-shrink: 0;
      border-radius: 10px;
      margin-right: 20px;
    }

    .name {
      margin-bottom: 20px;
    }

    .sku {
      color: #A8A8A8;
      font-size: 26px;
    }

    .price {
      margin-top: 10px;
      color: #E8443A;
      font-weight: bold;
      font-size: 30px;
    }

    .symbol {
      margin-right: 2px;
      font-size: 24px;
    }
  }




  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background: #fff;
    padding-right: 20px;
    height: 80px;
    font-size: 24px;

    .btn_red {
      background: #E8443A;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 152px;
      box-sizing: border-box;
      height: 55px;
      margin-right: 10px;
      border-radius: 100px;
    }

    .btn_grey {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #A8A8A8;
      width: 150px;
      box-sizing: border-box;
      height: 55px;
      margin-right: 10px;
      border-radius: 100px;
    }

    .btn_red_border {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #E8443A;
      width: 150px;
      height: 55px;
      margin-right: 10px;
      color: #E8443A;
      border-radius: 100px;
    }
  }

  .certificate {
    width: 150px;
    height: 150px;
  }
}
</style>
