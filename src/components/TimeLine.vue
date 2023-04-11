<!--
 * @Author: lizesheng
 * @Date: 2023-04-10 19:53:20
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-04-10 20:01:37
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /shop/src/components/TimeLine.vue
-->
<template>
  <view class="timeline">
    <view class="timeline-item">
      <view class="timeline-time">{{ time }}</view>
      <view class="timeline-content">
        <!-- <view class="timeline-title">{{ title }}</view> -->
        <view class="timeline-desc">{{ desc }}</view>
      </view>
    </view>
  </view>
</template>
<script setup>
import { defineProps, PropType, defineEmits } from 'vue';
const props = defineProps({
  title: {
    type: String,
  },
  time: {
    type: String,
  },
  desc: {
    type: String,
  },
})
</script>
<style lang="scss">
.timeline {
  margin: 30px 0;
  position: relative;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 32px;
    width: 8px;
    background-color: #e5e5e5;
    margin-left: -4px;
  }

  .timeline-item {
    position: relative;
    margin: 20px 0;
    padding-left: 35px;

    .timeline-time {
      position: absolute;
      top: -20px;
      left: -50px;
      font-size: 28px;
      color: #999;
      width: 160px;
      text-align: right;
    }

    .timeline-content {
      background-color: #f5f5f5;
      border-radius: 10px;
      padding: 20px;
      color: #666;
      position: relative;

      &:before {
        content: "";
        position: absolute;
        top: 24px;
        left: -22px;
        width: 0;
        height: 0;
        border-top: 16px solid transparent;
        border-right: 22px solid #f5f5f5;
        border-bottom: 16px solid transparent;
      }

      .timeline-title {
        font-size: 32px;
        margin-bottom: 10px;
      }

      .timeline-desc {
        font-size: 2px;
        line-height: 1.5;
      }
    }

    &:last-child {
      .timeline-content {
        padding-bottom: 50px;
      }
    }
  }
}
</style>