<!--
 * @Author: lizesheng
 * @Date: 2023-04-10 19:53:20
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-04-12 18:15:20
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /shop/src/components/TimeLine.vue
-->
<template>
  <view class="timeline">
    <view class="flex">
      <view class="line_circle">
        <view class="circle"></view>
        <view class="line"></view>
      </view>
      <view class="timeline-item" :style="{ 'color': index === 0 ? '#000' : '' }">
        <view class="timeline-time">{{ time }}</view>
        <view class="timeline-desc">{{ desc }}</view>
      </view>
    </view>
  </view>
</template>
<script setup>
import { defineProps, PropType, defineEmits } from 'vue';
const props = defineProps({
  time: {
    type: String,
  },
  desc: {
    type: String,
  },
  index: {
    type: Number
  }
})
console.log(props.index, '----index')
</script>
<style lang="scss">
.timeline {
  position: relative;

  .line_circle {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
  }

  .line {
    padding-bottom: 60px;
    background: #CCCCCC;
    width: 5px;
    height: 100%;
  }

  .circle {
    border-radius: 100px;
    width: 30px;
    flex-shrink: 0;
    height: 30px;
    background: #CCCCCC;
  }

  .timeline-item {
    position: relative;
    margin-bottom: 35px;
    color: #818181;
    top: -3px;

    .timeline-time {
      font-size: 26px;
      flex-shrink: 0;
      margin-bottom: 10px;
      margin-right: 10px;
    }

    .timeline-desc {
      font-size: 28px;
      line-height: 1.5;
    }

    &:last-child {
      .timeline-content {
        padding-bottom: 50px;
      }
    }
  }
}
</style>