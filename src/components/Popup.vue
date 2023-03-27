<!--
 * @Author: lizesheng
 * @Date: 2023-03-27 18:17:12
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-03-27 19:59:30
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /shop/src/components/Popup.vue
-->
<template>
  <page-container :show="props.show" :round="true" :overlay="false" :duration="props.duration" :position="props.position">
    <slot></slot>
  </page-container>
</template>
<script setup>
import { defineProps, PropType, defineEmits, Slots } from 'vue';
const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  duration: {
    type: Number,
    default: 300,
  },
  position: {
    type: String,
    default: 'bottom',
  },
})
</script>