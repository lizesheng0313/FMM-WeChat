<!--
 * @Author: lizesheng
 * @Date: 2023-03-30 18:16:15
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-03-31 13:30:53
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /shop/src/components/navTitle.vue
-->
<template>
  <view class="title" :style="{ height: `${navHeight}px`, paddingTop: `${statusHeight}px`, color: color }">{{ title }}
  </view>
</template>
<script setup>
import { defineProps } from 'vue';
import Taro from '@tarojs/taro'
import { ref } from 'vue'
const sysinfo = Taro.getSystemInfoSync()
const statusHeight = ref(sysinfo.statusBarHeight)
const isiOS = sysinfo.system.indexOf('iOS') > -1
const navHeight = ref(!isiOS ? 46 : 44)
const props = defineProps({
  color: {
    type: String,
    default: '#333',
  },
  title: {
    type: String,
    default: '',
  },
});
</script>
<style>
.title {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>