<script setup lang="ts">
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import DashboardDesign from '#/components/dashboard-design/index.vue';

// 保存的配置（实际项目中应该从后端获取/保存）
const savedConfig = ref<string>('');

// 处理保存
const handleSave = (config: string) => {
  savedConfig.value = config;
  // 实际项目中这里应该调用 API 保存到后端
  console.log('Dashboard config saved:', config);
  ElMessage.success('仪表盘配置已保存');
};
</script>

<template>
  <Page content-class="h-[calc(100vh-80px)]">
    <DashboardDesign :initial-config="savedConfig" @save="handleSave" />
  </Page>
</template>
