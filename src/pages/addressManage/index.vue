
<template>
  <view class="address-manage">
    <view class="flexCenter address_box">
      <view class="title">收货人</view>
      <input maxlength="16" :value="addressInfo.name" placeholder="请填写收货人姓名" @input="(e) => { handleInput(e, 'name') }" />
    </view>
    <view class="flexCenter address_box">
      <view class="title">手机号码</view>
      <input :value="addressInfo.phone" maxlength="11" type="number" placeholder="请填写11位手机号码"
        @input="(e) => { handleInput(e, 'phone') }" />
    </view>
    <view class="flexCenter address_box">
      <view class="title">选择地区</view>
      <picker mode="region" class="picker" @change="handleChangeProvice">
        <view v-if="addressInfo.province">
          {{ addressInfo.province }} {{ addressInfo.city }} {{ addressInfo.streetName }}
        </view>
        <view v-else class="picker_info">
          请选择地址
        </view>
      </picker>
    </view>
    <view class="flexCenter address_box">
      <view class="title">详细地址</view>
      <input :value="addressInfo.address" placeholder="请填写街道、楼牌号等" @input="(e) => { handleInput(e, 'address') }" />
    </view>
    <view class="flexBetWeenCenter address_box">
      <view class="title">设为默认地址</view>
      <switch :checked="addressInfo.is_default" className='my-switch' color="#E8443A" size="small"
        @change="handleChangeDefault"></switch>
    </view>
    <view class="footer_submit_btn" @tap="handleSave">保存</view>
  </view>
</template>

<script setup>
import constConfig from '../../config/confg'
import Taro, { useRouter } from '@tarojs/taro'
import { post } from '../../utils/request'
import { ref, reactive } from 'vue'
import childIcon from '../../components/Icon.vue'
const router = useRouter()
const addressInfo = ref({
  is_default: false
})
if (router?.params?.id) {
  Taro.setNavigationBarTitle({
    title: '编辑收货地址'
  })
  addressInfo.value = JSON.parse(Taro.getStorageSync('addressEditInfo'))
  addressInfo.value.is_default = addressInfo.value.is_default === '1' ? true : false
}
else {
  Taro.setNavigationBarTitle({
    title: '新建收货地址'
  })
}

const handleChangeProvice = (e) => {
  addressInfo.value.province = e.detail.value[0]
  addressInfo.value.city = e.detail.value[1]
  addressInfo.value.streetName = e.detail.value[2]
}

const handleInput = (e, key) => {
  addressInfo.value[key] = e.detail.value;
}
const handleChangeDefault = (e) => {
  addressInfo.value.is_default = e.detail.value
}
const handleSave = () => {
  const { name, phone, address, province } = addressInfo.value
  if (!name) return Taro.showToast({ title: '请填写收货人姓名', icon: 'none' })
  if (!phone) return Taro.showToast({ title: '请填写收货人手机号', icon: 'none' })
  if (!province) return Taro.showToast({ title: '请选择地区', icon: 'none' })
  if (!address) return Taro.showToast({ title: '请填写收货人详细地址', icon: 'none' })
  if (router?.params?.id) {
    post('/api/address/update', { ...addressInfo.value, is_default: addressInfo.value.is_default === true ? '1' : '0' }).then(() => Taro.navigateBack())
  }
  else {
    post('/api/address/add', { ...addressInfo.value, is_default: addressInfo.value.is_default === true ? '1' : '0' }).then(() => Taro.navigateBack())
  }
}

const onShareAppMessage = () => {
  return {
    title: constConfig.title,
    imageUrl: '',
    path: '/pages/index/index'
  }
}


</script>
<style lang="scss">
.address-manage {
  padding: 0 20px;

  .picker {
    height: 80px;
    display: flex;
    align-items: center;
    width: 100vw;
  }

  .picker_info {
    color: #999;
  }

  .address_box {
    height: 60px;
    padding: 20px 0;
    border-bottom: 2px solid #eee;

    input {
      font-size: 28px;
      flex-grow: 1;
      padding: 20px 0;
    }

    .title {
      width: 200px;
      font-size: 28px;
      color: #000;
      flex-shrink: 0;
    }
  }

  .my-switch {
    transform: scale(.7)
  }

}
</style>
