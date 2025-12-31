<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { Check, Download, Edit3, FileText, RotateCcw } from '@vben/icons';

import {
  ElButton,
  ElCard,
  ElCollapse,
  ElCollapseItem,
  ElIcon,
  ElMessage,
  ElProgress,
  ElScrollbar,
} from 'element-plus';
import { storeToRefs } from 'pinia';

import { ContractRenderer } from '#/components/contract-design';
import VariableForm from '#/components/contract-design/components/VariableForm.vue';
import { useContractDesignStore } from '#/components/contract-design/store/contractDesignStore';
import { useContractSignStore } from '#/components/contract-design/store/contractSignStore';
import { exportPagesToPdf } from '#/components/contract-design/utils/exportPdf';

const designStore = useContractDesignStore();
const signStore = useContractSignStore();

const { templateConfig: designTemplateConfig } = storeToRefs(designStore);
const {
  templateConfig,
  signatures,
  variables,
  signProgress,
  allRequiredSigned,
  status,
} = storeToRefs(signStore);

// 签名数据映射（elementId -> signatureImage）
const signatureMap = computed(() => {
  const map: Record<string, string> = {};
  signatures.value.forEach((s) => {
    map[s.elementId] = s.signatureImage;
  });
  return map;
});

// 变量数据映射（code -> value）
const variableMap = computed(() => {
  const map: Record<string, string> = {};
  variables.value.forEach((v) => {
    map[v.code] = v.value;
  });
  return map;
});

// 右侧面板折叠状态
const activeCollapse = ref(['variables', 'signatures']);

// 页面尺寸映射
const pageSizeMap = {
  A4: { width: 794, height: 1123 },
  A5: { width: 559, height: 794 },
  Letter: { width: 816, height: 1056 },
};

// 合同纸张引用
const contractPaperRef = ref<HTMLElement | null>(null);

// 导出中状态
const exporting = ref(false);

// 初始化：从设计器加载模板
onMounted(() => {
  if (
    designTemplateConfig.value &&
    designTemplateConfig.value.elements.length > 0
  ) {
    signStore.loadTemplate(designTemplateConfig.value);
  }
});

// 处理签名
const handleSign = (elementId: string, signatureData: string) => {
  const element = templateConfig.value?.elements.find(
    (e) => e.id === elementId,
  );
  if (!element) return;

  signStore.setSignature({
    elementId,
    partyType: element.signature?.partyType || 'party_a',
    partyLabel: element.signature?.partyLabel || '签名',
    signatureImage: signatureData,
  });

  ElMessage.success('签名成功');
};

// 完成签署
const handleComplete = () => {
  if (!allRequiredVariablesFilled.value) {
    ElMessage.warning('请填写所有必填变量');
    return;
  }

  if (!allRequiredSigned.value) {
    ElMessage.warning('请完成所有必须签署的区域');
    return;
  }

  const success = signStore.completeSign();
  if (success) {
    ElMessage.success('合同签署完成');
  }
};

// 重置签署
const handleReset = () => {
  if (designTemplateConfig.value) {
    signStore.loadTemplate(designTemplateConfig.value);
    ElMessage.info('已重置签署状态');
  }
};

// 处理变量填写
const handleVariableChange = (code: string, value: string) => {
  signStore.setVariable(code, value);
};

// 变量填写进度
const variableFillProgress = computed(() => {
  if (!templateConfig.value) return 100;
  const required = templateConfig.value.variables.filter((v) => v.required);
  if (required.length === 0) return 100;

  const filled = required.filter((v) => {
    const val = variableMap.value[v.code];
    return val !== undefined && val !== null && val !== '';
  });
  return Math.round((filled.length / required.length) * 100);
});

// 检查是否所有必填变量都已填写
const allRequiredVariablesFilled = computed(() => {
  return variableFillProgress.value === 100;
});

// 导出 PDF
const handleExportPdf = async () => {
  if (!contractPaperRef.value) {
    ElMessage.error('导出失败');
    return;
  }

  exporting.value = true;
  try {
    // 查找所有页面元素
    const pages = contractPaperRef.value.querySelectorAll('.contract-paper');
    if (pages.length === 0) {
      // 如果没有分页，直接导出整个容器
      const paper = contractPaperRef.value.querySelector(
        '.contract-paper',
      ) as HTMLElement;
      if (paper) {
        await exportPagesToPdf([paper], {
          filename: `${templateConfig.value?.name || '合同'}-已签署.pdf`,
          pageSize: templateConfig.value?.pageSize || 'A4',
        });
      }
    } else {
      await exportPagesToPdf([...pages] as HTMLElement[], {
        filename: `${templateConfig.value?.name || '合同'}-已签署.pdf`,
        pageSize: templateConfig.value?.pageSize || 'A4',
      });
    }
    ElMessage.success('PDF 导出成功');
  } catch (error) {
    console.error('Export failed:', error);
    ElMessage.error('导出失败');
  } finally {
    exporting.value = false;
  }
};
</script>

<template>
  <div class="contract-sign-page flex h-full gap-4 p-4">
    <!-- 左侧：合同内容 -->
    <div
      class="flex-1 overflow-hidden rounded border border-[var(--el-border-color)] bg-[var(--el-bg-color)]"
    >
      <div
        class="flex items-center justify-between border-b border-[var(--el-border-color)] px-4 py-3"
      >
        <div class="flex items-center gap-2">
          <ElIcon :size="20" class="text-[var(--el-color-primary)]">
            <FileText />
          </ElIcon>
          <span class="text-base font-bold">{{
            templateConfig?.name || '合同签署'
          }}</span>
        </div>
      </div>

      <ElScrollbar class="h-[calc(100%-56px)]">
        <div
          ref="contractPaperRef"
          class="flex justify-center bg-[var(--el-fill-color-light)] p-6"
        >
          <ContractRenderer
            v-if="templateConfig"
            :config="templateConfig"
            :variables="variableMap"
            :signatures="signatureMap"
            :signable="status !== 'completed'"
            show-border
            @sign="handleSign"
          />
          <div
            v-else
            class="flex h-[400px] w-full items-center justify-center text-[var(--el-text-color-placeholder)]"
          >
            <div class="text-center">
              <ElIcon :size="48" class="mb-4"><FileText /></ElIcon>
              <p>请先在设计器中创建合同模板</p>
            </div>
          </div>
        </div>
      </ElScrollbar>
    </div>

    <!-- 右侧：填写与签署 -->
    <div
      class="w-96 flex-shrink-0 overflow-hidden rounded border border-[var(--el-border-color)] bg-[var(--el-bg-color)]"
    >
      <div
        class="flex items-center justify-between border-b border-[var(--el-border-color)] px-4 py-3"
      >
        <div class="flex items-center gap-2">
          <ElIcon :size="16" class="text-[var(--el-color-primary)]">
            <Edit3 />
          </ElIcon>
          <span class="font-medium">填写与签署</span>
        </div>
        <div class="flex items-center gap-2 text-xs">
          <span
            :class="{
              'text-[var(--el-color-warning)]': status === 'signing',
              'text-[var(--el-color-success)]': status === 'completed',
            }"
          >
            {{ status === 'completed' ? '已完成' : '进行中' }}
          </span>
        </div>
      </div>

      <ElScrollbar class="h-[calc(100%-56px-60px)]">
        <div class="p-4">
          <!-- 进度概览 -->
          <ElCard shadow="never" class="mb-4">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-[var(--el-text-color-secondary)]"
                  >变量填写</span
                >
                <span
                  class="text-sm font-medium"
                  :class="{
                    'text-[var(--el-color-success)]':
                      variableFillProgress === 100,
                    'text-[var(--el-color-warning)]':
                      variableFillProgress < 100,
                  }"
                >
                  {{ variableFillProgress }}%
                </span>
              </div>
              <ElProgress
                :percentage="variableFillProgress"
                :status="variableFillProgress === 100 ? 'success' : undefined"
                :stroke-width="6"
                :show-text="false"
              />

              <div class="flex items-center justify-between">
                <span class="text-sm text-[var(--el-text-color-secondary)]"
                  >签署进度</span
                >
                <span
                  class="text-sm font-medium"
                  :class="{
                    'text-[var(--el-color-success)]': signProgress === 100,
                    'text-[var(--el-color-warning)]': signProgress < 100,
                  }"
                >
                  {{ signProgress }}%
                </span>
              </div>
              <ElProgress
                :percentage="signProgress"
                :status="signProgress === 100 ? 'success' : undefined"
                :stroke-width="6"
                :show-text="false"
              />
            </div>
          </ElCard>

          <!-- 折叠面板 -->
          <ElCollapse v-model="activeCollapse">
            <!-- 变量填写 -->
            <ElCollapseItem name="variables">
              <template #title>
                <div class="flex items-center gap-2">
                  <ElIcon :size="14"><Edit3 /></ElIcon>
                  <span>变量填写</span>
                  <span
                    v-if="templateConfig"
                    class="ml-2 text-xs text-[var(--el-text-color-placeholder)]"
                  >
                    ({{ templateConfig.variables.length }} 项)
                  </span>
                </div>
              </template>

              <!-- <VariableForm
                v-if="templateConfig"
                :variables="templateConfig.variables"
                :model-value="variableMap"
                @change="handleVariableChange"
              /> -->
            </ElCollapseItem>

            <!-- 签署区域 -->
            <ElCollapseItem name="signatures">
              <template #title>
                <div class="flex items-center gap-2">
                  <ElIcon :size="14"><Check /></ElIcon>
                  <span>签署区域</span>
                  <span
                    v-if="templateConfig"
                    class="ml-2 text-xs text-[var(--el-text-color-placeholder)]"
                  >
                    ({{ signatures.length }}/{{
                      templateConfig.elements.filter(
                        (e) =>
                          e.type === 'signature-zone' || e.type === 'seal-zone',
                      ).length
                    }})
                  </span>
                </div>
              </template>

              <div v-if="templateConfig" class="space-y-2">
                <div
                  v-for="element in templateConfig.elements.filter(
                    (e) =>
                      e.type === 'signature-zone' || e.type === 'seal-zone',
                  )"
                  :key="element.id"
                  class="flex items-center justify-between rounded border border-[var(--el-border-color)] p-2"
                >
                  <div class="flex items-center gap-2">
                    <ElIcon
                      :size="14"
                      :class="
                        signatureMap[element.id]
                          ? 'text-[var(--el-color-success)]'
                          : 'text-[var(--el-text-color-placeholder)]'
                      "
                    >
                      <Check />
                    </ElIcon>
                    <span class="text-sm">
                      {{
                        element.signature?.partyLabel ||
                        element.props.label ||
                        (element.type === 'signature-zone' ? '签名' : '盖章')
                      }}
                    </span>
                  </div>
                  <span
                    class="text-xs"
                    :class="
                      signatureMap[element.id]
                        ? 'text-[var(--el-color-success)]'
                        : 'text-[var(--el-text-color-placeholder)]'
                    "
                  >
                    {{ signatureMap[element.id] ? '已签署' : '待签署' }}
                  </span>
                </div>

                <div
                  v-if="
                    templateConfig.elements.filter(
                      (e) =>
                        e.type === 'signature-zone' || e.type === 'seal-zone',
                    ).length === 0
                  "
                  class="py-4 text-center text-sm text-[var(--el-text-color-placeholder)]"
                >
                  暂无签署区域
                </div>
              </div>
            </ElCollapseItem>
          </ElCollapse>
        </div>
      </ElScrollbar>

      <!-- 底部操作按钮 -->
      <div class="border-t border-[var(--el-border-color)] p-4">
        <div class="flex gap-2">
          <ElButton class="flex-1" @click="handleReset">
            <ElIcon class="mr-1"><RotateCcw /></ElIcon>
            重置
          </ElButton>

          <ElButton
            v-if="status !== 'completed'"
            type="primary"
            class="flex-1"
            :disabled="!allRequiredVariablesFilled || !allRequiredSigned"
            @click="handleComplete"
          >
            <ElIcon class="mr-1"><Check /></ElIcon>
            完成签署
          </ElButton>

          <ElButton
            v-else
            type="success"
            class="flex-1"
            :loading="exporting"
            @click="handleExportPdf"
          >
            <ElIcon class="mr-1"><Download /></ElIcon>
            导出 PDF
          </ElButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contract-sign-page {
  height: calc(100vh - 120px);
}
</style>
