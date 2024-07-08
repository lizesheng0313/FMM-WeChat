<template>
  <view>
    <rich-text :nodes="nodes"></rich-text>
  </view>
</template>
<script setup>
import { ref } from 'vue';
import constConfig from '../../config/confg';
import { get } from '../../utils/request';

const nodes = ref([]);
get('/api/admin/basic/get').then((res) => {
  nodes.value = res.data.user_agreement;
});

const onShareAppMessage = () => {
  return {
    title: constConfig.title,
    imageUrl: '',
    path: '/pages/index/index',
  };
};
</script>
<style scoped>
div {
  text-indent: 2em;
}
</style>
