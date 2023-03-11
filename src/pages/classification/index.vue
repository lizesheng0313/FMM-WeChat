<!--
 * @Author: lizesheng
 * @Date: 2023-03-07 12:29:37
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-03-08 11:01:38
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /shop/src/pages/classification/index.vue
-->
<template>
  <view class="index">
    <Counter />
  </view>
</template>

<script>
import './index.scss'
import Counter from '../../components/Counter.vue'

export default {
  name: 'Index',
  components: {
    Counter
  }
}
</script>
