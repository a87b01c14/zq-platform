<script lang="ts" setup>
import type { VbenFormProps } from '@vben/common-ui';

import { ref } from 'vue';

import { Page } from '@vben/common-ui';
import { Edit, Trash2 } from '@vben/icons';

import { ElButton, ElMessage, ElTag } from 'element-plus';

import { MultiDataView } from '#/components/multi-data-view';

// 模拟数据类型
interface DemoItem {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  createTime: string;
}

// 模拟 API
const mockApi = async (params: any) => {
  console.log('API params:', params);

  // 模拟延迟
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 模拟总数据
  const totalItems = 50;
  const items: DemoItem[] = [];

  for (let i = 0; i < (params.pageSize || 20); i++) {
    const id = (params.page - 1) * params.pageSize + i + 1;
    if (id > totalItems) break;

    items.push({
      id: String(id),
      name: `项目 ${id}`,
      description: `这是项目 ${id} 的详细描述信息...`,
      status: Math.random() > 0.5 ? 'active' : 'inactive',
      createTime: new Date().toISOString().split('T')[0] ?? '',
    });
  }

  // 模拟搜索过滤
  if (params.name) {
    const filtered = items.filter((item) =>
      item.name.includes(params.name || ''),
    );
    return {
      items: filtered,
      total: filtered.length, // 这里的total不准确，仅演示
    };
  }

  return {
    items,
    total: totalItems,
  };
};

// 搜索表单配置
const searchFormConfig: VbenFormProps = {
  schema: [
    {
      fieldName: 'name',
      label: '项目名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入项目名称',
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        options: [
          { label: '全部', value: '' },
          { label: '启用', value: 'active' },
          { label: '禁用', value: 'inactive' },
        ],
      },
    },
  ],
  wrapperClass: 'grid-cols-1 md:grid-cols-3',
  actionWrapperClass: 'col-span-1 md:col-span-1 text-left',
};

const selectedItems = ref<DemoItem[]>([]);

function handleSelectionChange(items: DemoItem[]) {
  selectedItems.value = items;
}

function handleEdit(item: DemoItem) {
  ElMessage.info(`编辑项目: ${item.name}`);
}

function handleDelete(item: DemoItem) {
  ElMessage.warning(`删除项目: ${item.name}`);
}

function handleBatchDelete() {
  if (selectedItems.value.length === 0) return;
  ElMessage.success(`批量删除 ${selectedItems.value.length} 个项目`);
}
</script>

<template>
  <Page>
    <div class="p-4">
      <MultiDataView
        :api="mockApi"
        title="项目列表"
        selection
        :search-form="searchFormConfig"
        :pagination="{ pageSize: 10 }"
        card-action-position="footer"
        content-height="auto"
        :bottom-offset="100"
        @selection-change="handleSelectionChange"
      >
        <!-- 工具栏 -->
        <template #toolbar>
          <ElButton type="primary" @click="() => ElMessage.success('新建项目')">
            新建项目
          </ElButton>
          <ElButton
            v-if="selectedItems.length > 0"
            type="danger"
            plain
            @click="handleBatchDelete"
          >
            批量删除
          </ElButton>
        </template>

        <!-- 卡片内容 -->
        <template #card="{ item }">
          <div class="mb-2 flex items-start justify-between">
            <div class="text-lg font-bold">{{ item.name }}</div>
            <ElTag
              :type="item.status === 'active' ? 'success' : 'danger'"
              size="small"
            >
              {{ item.status === 'active' ? '启用' : '禁用' }}
            </ElTag>
          </div>
          <div class="mb-4 line-clamp-2 text-sm text-gray-500">
            {{ item.description }}
          </div>
          <div class="text-xs text-gray-400">
            创建时间: {{ item.createTime }}
          </div>
        </template>

        <!-- 列表内容 -->
        <template #list="{ item }">
          <div class="flex-1">
            <div class="font-bold">{{ item.name }}</div>
            <div class="text-sm text-gray-500">{{ item.description }}</div>
          </div>
          <div class="w-24 text-center">
            <ElTag
              :type="item.status === 'active' ? 'success' : 'danger'"
              size="small"
            >
              {{ item.status === 'active' ? '启用' : '禁用' }}
            </ElTag>
          </div>
          <div class="w-32 pr-4 text-right text-sm text-gray-400">
            {{ item.createTime }}
          </div>
        </template>

        <!-- 操作按钮 -->
        <template #actions="{ item }">
          <ElButton link type="primary" :icon="Edit" @click="handleEdit(item)">
            编辑
          </ElButton>
          <ElButton
            link
            type="danger"
            :icon="Trash2"
            @click="handleDelete(item)"
          >
            删除
          </ElButton>
        </template>
      </MultiDataView>
    </div>
  </Page>
</template>
