<!--
 * @Author: lizesheng
 * @Date: 2023-03-09 11:23:00
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-03-25 11:49:04
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /shop/src/components/Icon.vue
-->
<template>
  <view :class="['iconfont', props.value]" :style="{ 'font-size': props.size + 'px', color: props.color }"></view>
</template>

<script setup>
import { defineProps } from 'vue';
const props = defineProps({
  value: {
    type: String,
    default: '',
  },
  size: {
    type: Number,
    default: 16,
  },
  color: {
    type: String,
    default: ''
  }
});
</script>
