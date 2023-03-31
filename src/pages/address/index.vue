<!--
 * @Author: lizesheng
 * @Date: 2023-03-25 14:51:26
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-03-31 17:50:13
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
      <view v-for="item in addressList" :key="item?.id" class="flexBetWeenCenter address_box">
        <view class="flexDSpaceStart">
          <view class="flexCenter contact">
            <view>{{ item?.name }}</view>
            <view class="phone">{{ item?.phone }}</view>
          </view>
          <view class="address_info">{{ item.address }}</view>
        </view>
        <view class="flexCenter">
          <child-icon @tap="handleEditAddress(item.id)" value="icon-edit" size="16"></child-icon>
          <child-icon @tap="handleDelAddress(item.id)" value="icon-shanchu" size="16" class="del"></child-icon>
        </view>
      </view>
    </view>
    <view class="add_address">新建快递地址</view>
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

const handleDelAddress = (id) => {
  post('/api/address/delete', {
    id
  }).then(res => {
    fetchList()
    Taro.showToast({
      title: '删除成功'
    })
  })
}

const handleEditAddress = (id) => {
  Taro.navigateTo({
    url: '/pages/addressManage/index?id=' + id
  })
}

const handleChooseAddress = () => {
  wx.chooseAddress({
    success(res) {

    },
    fail() {
      Taro.showToast({
        title: '请重试,刚刚手机卡了一下'
      })
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
    margin-left: 10px;
  }

  .add_address {
    position: fixed;
    left: 20px;
    right: 20px;
    bottom: 20px;
    height: 60px;
    background: #E50F86;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100px;
  }
}
</style>
