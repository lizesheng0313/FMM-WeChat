<!--
 * @Author: lizesheng
 * @Date: 2023-03-25 14:51:26
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-04-01 19:11:32
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /shop/src/pages/address/index.vue
-->
<template>
  <view class="address">
    <view class="flexBetWeenCenter get_sys" @tap="handleChooseAddress">
      <view class="flexCenter">
        <child-icon value="icon-weixin" color="#78B730" size="14"></child-icon>
        <view class="txt">获取微信收货地址</view>
      </view>
      <child-icon class="right_arrow grey" value="icon-youjiantou" size="14"></child-icon>
    </view>
    <view class="line"></view>
    <view>
      <view v-for="item in addressList" :key="item?.id" class="flexBetWeenCenter address_box"
        @tap="handleConfirmAddress(item)">
        <view class="flexDSpaceStart">
          <view class="flexCenter contact">
            <view>{{ item?.name }}</view>
            <view class="phone">{{ item?.phone }}</view>
          </view>
          <view class="address_info">{{ item.address }}</view>
        </view>
        <view class="flexCenter">
          <child-icon @tap="(event) => { handleJumpAddressManage(event, item.id) }" value="icon-edit"
            size="23"></child-icon>
          <child-icon @tap="(event) => { handleDelAddress(event, item.id) }" value="icon-shanchu" size="23"
            class="del"></child-icon>
        </view>
      </view>
    </view>
    <view class="add_address" @tap="handleJumpAddressManage">新建快递地址</view>
  </view>
</template>

<script setup>
import Taro from '@tarojs/taro'
import { useDidShow } from '@tarojs/taro'
import { get, post } from '../../utils/request'
import { ref, reactive } from 'vue'
import childIcon from '../../components/Icon.vue'
const addressList = ref([])

useDidShow(() => {
  fetchList()
})

const fetchList = () => {
  get('/api/address/get').then(res => {
    addressList.value = res.data.list
  })
}

const handleDelAddress = (e, id) => {
  e.stopPropagation()
  Taro.showModal({
    title: '确认删除该地址吗?',
    success(res) {
      if (res.confirm) {
        post('/api/address/delete', {
          id
        }).then(res => {
          fetchList()
        })
      }
    }
  })
}

const handleJumpAddressManage = (e, id) => {
  e.stopPropagation()
  Taro.navigateTo({
    url: '/pages/addressManage/index?id=' + id
  })
}

const handleConfirmAddress = (item) => {
  Taro.setStorageSync('addressInfo', JSON.stringify(item))
  Taro.navigateBack()
}

const handleChooseAddress = () => {
  wx.chooseAddress({
    success(res) {
      post('/api/address/add', {
        name: res.userName,
        address: res.cityName + res.countyName + res.detailInfo,
        phone: res.telNumber,
      }).then(result => {
        handleConfirmAddress({
          id: result.id,
          name: res.userName,
          address: res.cityName + res.countyName + res.detailInfo,
          phone: res.telNumber,
        })
      })
    },
    fail() {

    },
  })
}
</script>
<style lang="scss">
.address {
  .get_sys {
    padding: 20px 20px;
  }

  .address_info {
    margin-top: 10px;
    font-size: 24px;
    color: #A8A8A8;
  }

  .contact {
    font-weight: bold;
    font-size: 28px;
  }

  .address_box {
    border: 1px solid #FEFEFE;
    padding: 25px 20px;
  }

  .txt {
    margin-left: 10px;
  }

  .phone {
    margin-left: 10px;
  }

  .line {
    background-color: #F7F8FA;
    height: 20px;
  }

  .del {
    margin-left: 20px;
  }

  .add_address {
    position: fixed;
    left: 20px;
    right: 20px;
    bottom: 20px;
    height: 90px;
    background: #E50F86;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100px;
  }
}
</style>
