<template>
  <view class="return-goods">
    <view class="goods_info">
      <image :src="goodsDetails.goods_picture"></image>
      <view>
        <view class="name">{{ goodsDetails?.name }}</view>
        <view class="sku">{{ goodsDetails?.sku_string }}</view>
      </view>
    </view>
    <view class="form-group">
      <view class="flexBetWeenCenter reason">
        <view class="form-label">申请原因：</view>
        <picker class="form-control" mode="selector" :range="reasonList" @change="handleReasonSelected">
          <view class="picker-content">{{ returnGoods.reason || '请选择申请原因' }}</view>
        </picker>
      </view>
      <view>
        <input class="memo" placeholder="请描述申请售后服务的具体原因" @input="handleMemoIput" />
      </view>
      <view>
        <image v-if="imagePath" :src="imagePath" mode="aspectFill" class="image-preview" />
        <view class="btn-upload" @tap="handleUploadImage">
          <childIcon value="icon-zhaoxiangji" size="25"></childIcon>
          <view>添加图片</view>
          <view class="total">(最多5张)</view>
        </view>
      </view>
    </view>
    <view class="footer_submit_btn" @tap="handleSubmit">提交</view>
  </view>
</template>

<script setup>
import Taro, { useLoad } from '@tarojs/taro'
import { ref } from 'vue';
import { get, post } from '../../utils/request'
import childIcon from '../../components/Icon.vue'
import { getCurrentDate } from '../../utils/utils'
import constConfig from '../../config/confg'
const goodsDetails = ref('')
useLoad((e) => {
  fetchDetails(e.id)
})

const fetchDetails = (id) => {
  returnGoods.value.id = id
  get('/api/order/getOrderDetails', {
    id
  }).then(res => {
    goodsDetails.value = res.data
  })
}

const reasonList = ['商品质量/故障', '少件/发错货/未收到货', '其它'];
const returnGoods = ref({
  id: '',
  memo: '',
  reason: '',
  picture_list: []
})
const imagePath = ref('');
const logisticsNo = ref('');

const handleMemoIput = (event) => {
  returnGoods.value.memo = event.detail.value;
}

function handleReasonSelected(event) {
  const selectedIndex = event.detail.value;
  returnGoods.value.reason = reasonList[selectedIndex];
}

async function handleUploadImage() {
  try {
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        Taro.showLoading({
          title: '上传中'
        });
        Taro.uploadFile({
          url: `${constConfig.host}/api/uploadImage`,
          filePath: res.tempFilePaths[0],
          name: 'file',
          header: {
            'authorization': wx.getStorageSync('authorization') || ''
          },
          success(res) {
            Taro.hideLoading();
            const response = JSON.parse(res.data)
            returnGoods.value.picture_list.push(`${constConfig.staticHost}${response.data.fileName}`)
          },
          fail() {
            wx.showToast({
              title: '上传失败',
              icon: 'none',
            });
          }
        })
      }
    });
  } catch (err) {
    wx.showToast({
      title: err,
      icon: 'none',
    });
    console.log(err)
  }
}

function handleLogisticsNoInput(event) {
  logisticsNo.value = event.target.value;
}

async function handleSubmit() {
  if (!returnGoods.value.reason) {
    Taro.showToast({
      title: '请输入完整信息',
      icon: 'none'
    })
    return;
  }
  const params = {
    ...returnGoods.value,
    picture_list: returnGoods.value.picture_list.join(',')
  }
  post('/api/order/returnGoods', params).then(res => {
    Taro.redirectTo({
      url: '/pages/returnDetails/index?id=' + res.data
    })
  })
}

</script>

<style  lang="scss">
.return-goods {
  background: #F0F1F3;
  min-height: 100vh;

  .goods_info {
    border-radius: 10px;
    display: flex;
    background: #fff;
    padding: 20px;

    image {
      width: 150px;
      height: 150px;
      border-radius: 10px;
      margin-right: 20px;
    }

    .name {
      margin-bottom: 20px;
    }

    .sku {
      color: #A8A8A8;
      font-size: 24px;
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

  .memo {
    background: #f6f6f6;
    padding: 10px 0;
    font-size: 24px;
    padding-left: 20px;
    margin-bottom: 20px;
  }

  .form-group {
    background: #fff;
    padding: 20px;
    margin: 20px;
    padding-bottom: 50px;
    border-radius: 10px;

    .reason {
      padding: 20px 0;
      margin-bottom: 20px;
      border-bottom: 2px solid #eee;
    }
  }

  .form-control {
    text-align: right;
    flex: 1;
  }

  .picker-content {
    color: #999;
  }

  .btn-upload {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 150px;
    border: 1px solid #eee;
    border-radius: 4px;
    padding: 6px 12px;
    font-size: 24px;
    color: #333;

    .total {
      color: #A8A8A8;
    }
  }

  .image-preview {
    width: 80px;
    height: 80px;
    margin-right: 10px;
  }

}
</style>