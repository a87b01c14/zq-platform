<script setup lang="ts">
import type { ContractTemplateConfig } from '#/components/contract-design/store/contractDesignStore';

import { ref } from 'vue';

import { Page } from '@vben/common-ui';
import { FileSignature, FileText } from '@vben/icons';

import { ElButton, ElIcon, ElMessage, ElTabPane, ElTabs } from 'element-plus';

import ContractRenderer from '#/components/contract-design/components/ContractRenderer.vue';
import ContractSignDialog from '#/components/contract-design/components/ContractSignDialog.vue';
import ContractDesign from '#/components/contract-design/index.vue';

// 当前标签页
const activeTab = ref('design');

// 保存的配置（实际项目中应该从后端获取/保存）
const savedConfig = ref<string>('');
const parsedConfig = ref<ContractTemplateConfig | null>(null);

// 签署对话框
const signDialogVisible = ref(false);

// 签署数据
const signedVariables = ref<Record<string, any>>({});
const signedSignatures = ref<Record<string, string>>({});

// 处理保存
const handleSave = (config: string) => {
  savedConfig.value = config;
  try {
    parsedConfig.value = JSON.parse(config);
  } catch {
    parsedConfig.value = null;
  }
  // 实际项目中这里应该调用 API 保存到后端
  console.log('Contract template config saved:', config);
  ElMessage.success('合同模板配置已保存');
};

// 打开签署对话框
const handleOpenSign = () => {
  if (!parsedConfig.value || parsedConfig.value.elements.length === 0) {
    ElMessage.warning('请先设计合同模板并保存');
    return;
  }
  signDialogVisible.value = true;
};

// 处理签署完成
const handleSigned = (data: {
  seal?: string;
  signature: string;
  variables: Record<string, any>;
}) => {
  signedVariables.value = { ...signedVariables.value, ...data.variables };
  signedSignatures.value = {
    ...signedSignatures.value,
    party_a: data.signature,
  };
  ElMessage.success('签署成功！');
  activeTab.value = 'preview';
};
</script>

<template>
  <Page content-class="h-[calc(100vh-80px)]">
    <ElTabs v-model="activeTab" type="border-card" class="h-full">
      <!-- 设计器标签页 -->
      <ElTabPane name="design" class="h-full">
        <template #label>
          <span class="flex items-center gap-1">
            <ElIcon><FileText /></ElIcon>
            模板设计
          </span>
        </template>
        <div class="h-[calc(100vh-160px)]">
          <ContractDesign :initial-config="savedConfig" @save="handleSave" />
        </div>
      </ElTabPane>

      <!-- 签署演示标签页 -->
      <ElTabPane name="sign">
        <template #label>
          <span class="flex items-center gap-1">
            <ElIcon><FileSignature /></ElIcon>
            签署演示
          </span>
        </template>
        <div class="p-4">
          <div class="mb-4 flex items-center justify-between">
            <div class="text-lg font-bold">合同签署演示</div>
            <ElButton type="primary" @click="handleOpenSign">
              <ElIcon class="mr-1"><FileSignature /></ElIcon>
              开始签署
            </ElButton>
          </div>

          <div
            v-if="!parsedConfig"
            class="flex h-60 items-center justify-center text-[var(--el-text-color-placeholder)]"
          >
            请先在"模板设计"中创建合同模板并保存
          </div>

          <div
            v-else
            class="rounded border border-[var(--el-border-color)] bg-[var(--el-fill-color-light)] p-4"
          >
            <div class="mb-2 text-sm text-[var(--el-text-color-secondary)]">
              模板名称：{{ parsedConfig.name }}
            </div>
            <div class="mb-4 text-sm text-[var(--el-text-color-secondary)]">
              元素数量：{{ parsedConfig.elements.length }} 个
            </div>
            <ElButton size="small" @click="handleOpenSign">
              模拟甲方签署
            </ElButton>
          </div>
        </div>
      </ElTabPane>

      <!-- 预览标签页 -->
      <ElTabPane label="签署预览" name="preview">
        <div
          class="overflow-auto bg-[var(--el-fill-color-light)] p-4"
          style="max-height: calc(100vh - 160px)"
        >
          <div v-if="parsedConfig" class="flex justify-center">
            <ContractRenderer
              :config="parsedConfig"
              :variables="signedVariables"
              :signatures="signedSignatures"
              show-border
            />
          </div>
          <div
            v-else
            class="flex h-60 items-center justify-center text-[var(--el-text-color-placeholder)]"
          >
            请先创建合同模板
          </div>
        </div>
      </ElTabPane>
    </ElTabs>

    <!-- 签署对话框 -->
    <ContractSignDialog
      v-if="parsedConfig"
      v-model:visible="signDialogVisible"
      :config="parsedConfig"
      party-type="party_a"
      @signed="handleSigned"
    />
  </Page>
</template>
