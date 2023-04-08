<template>
  <view>
    <view class="product-detail">
      <image class="product-image" :src="product.image" mode="aspectFill" />
      <view class="product-name">{{ product.name }}</view>
    </view>

    <view class="form-group">
      <view class="form-label">退货原因：</view>
      <picker class="form-control" mode="selector" :range="reasonList" @change="handleReasonSelected">
        <view class="picker-content">{{ reason }}</view>
      </picker>
    </view>

    <view class="form-group">
      <view class="form-label">上传凭证：</view>
      <view class="form-control">
        <image v-if="imagePath" :src="imagePath" mode="aspectFill" class="image-preview" />
        <button v-else class="btn-upload" @tap="handleUploadImage">上传图片</button>
      </view>
    </view>

    <view class="form-group">
      <view class="form-label">退货物流号：</view>
      <input class="form-control" placeholder="请输入退货物流号" @input="handleLogisticsNoInput" />
    </view>

    <view class="form-group">
      <button type="primary" class="btn-submit" @tap="handleSubmit">提交</button>
    </view>

    <view v-if="showToast" class="toast">{{ toastMessage }}</view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import Taro from '@tarojs/taro';

const product = {
  name: '商品名称',
  image: 'https://picsum.photos/id/237/200/300',
};

const reasonList = ['质量问题', '错发漏发', '不喜欢', '其他'];

const reason = ref('');

const imagePath = ref('');

const logisticsNo = ref('');

const showToast = ref(false);

const toastMessage = ref('');

function handleReasonSelected(event) {
  const selectedIndex = event.detail.value;
  reason.value = reasonList[selectedIndex];
}

async function handleUploadImage() {
  try {
    const res = await Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
    });
    imagePath.value = res.tempFilePaths[0];
  } catch (err) {
    showToast.value = true;
    toastMessage.value = '上传图片失败，请稍后重试';
  }
}

function handleLogisticsNoInput(event) {
  logisticsNo.value = event.target.value;
}

async function handleSubmit() {
  if (!reason.value || !imagePath.value || !logisticsNo.value) {
    showToast.value = true;
    toastMessage.value = '请填写完整信息';
    return;
  }

  try {
    // TODO: 发送退货申请请求，将 reason.value、imagePath.value 和 logisticsNo.value 作为参数传递
    showToast.value = true;
    toastMessage.value = '退货申请已提交';
  } catch (err) {
    showToast.value = true;
    toastMessage.value = '退货申请提交失败，请稍后重试';
  }
}

</script>

<style scoped>
.product-detail {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.product-image {
  width: 120px;
  height: 120px;
  margin-right: 10px;
}

.product-name {
  font-size: 20px;
  font-weight: bold;
}

.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.form-label {
  width: 100px;
  font-size: 16px;
}

.form-control {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.picker-content {
  font-size: 16px;
  color: #999;
}

.btn-upload {
  background-color: #fff;
  border: 1px solid #999;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 16px;
  color: #333;
}

.image-preview {
  width: 80px;
  height: 80px;
  margin-right: 10px;
}

.btn-submit {
  background-color: #00a0e9;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
}

.toast {
  position: fixed;
  left: 50%;
  bottom: 20px;
  transform: translateX(-50%);
  padding: 10px 16px;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
  color: #fff;
  z-index: 999;
}
</style>