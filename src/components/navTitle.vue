<!--
 * @Author: lizesheng
 * @Date: 2023-03-30 18:16:15
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-03-30 18:33:23
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /shop/src/components/navTitle.vue
-->
<template>
  <view class="title" :style="{ height: `${navHeight}px`, paddingTop: `${statusHeight}px`, color: Color }">{{ title }}
  </view>
</template>
<script setup>
import { defineProps } from 'vue';
const sysinfo = Taro.getSystemInfoSync()
const statusHeight = ref(sysinfo.statusBarHeight)
const isiOS = sysinfo.system.indexOf('iOS') > -1
const navHeight = ref(!isiOS ? 46 : 44)
const props = defineProps({
  color: {
    type: String,
    default: '#333',
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