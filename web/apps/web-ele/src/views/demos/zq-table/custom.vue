<script setup lang="ts">
import { h } from 'vue';

import { Page } from '@vben/common-ui';

import { ElButton, ElTag } from 'element-plus';

import { useZqTable } from '#/components/zq-table';

const fetchList = async ({ page }: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        items: Array.from({ length: page.pageSize }).map((_, i) => ({
          id: i,
          name: `User ${i + 1}`,
          tags: i % 2 === 0 ? ['Admin'] : ['User', 'Guest'],
          status: i % 3 === 0 ? 'Error' : 'Success',
        })),
        total: 100,
      });
    }, 500);
  });
};

const [Table] = useZqTable({
  tableTitle: '自定义插槽与渲染',
  gridOptions: {
    columns: [
      { key: 'name', dataKey: 'name', title: 'Name', width: 150 },
      {
        key: 'tags',
        dataKey: 'tags',
        title: 'Tags',
        width: 200,
        cellRenderer: ({ cellData }: any) => {
          return cellData.map((tag: string) =>
            h(ElTag, { class: 'mr-1' }, () => tag),
          );
        },
      },
      {
        key: 'status',
        dataKey: 'status',
        title: 'Status',
        width: 100,
        cellRenderer: ({ cellData }: any) => {
          return h(
            ElTag,
            { type: cellData === 'Error' ? 'danger' : 'success' },
            () => cellData,
          );
        },
      },
      {
        key: 'action',
        title: 'Action',
        width: 150,
        cellRenderer: ({ rowData }: any) => {
          return h(
            ElButton,
            {
              size: 'small',
              type: 'primary',
              onClick: () => alert(`Clicked ${rowData.name}`),
            },
            () => 'Edit',
          );
        },
      },
    ],
    proxyConfig: {
      ajax: {
        query: fetchList,
      },
    },
  },
});

const handleCustomAction = () => {
  alert('Custom Action Triggered');
};
</script>

<template>
  <Page title="ZqTable 自定义示例">
    <div class="h-[600px]">
      <Table>
        <template #toolbar-tools>
          <ElButton type="warning" @click="handleCustomAction">
            Custom Tool
          </ElButton>
        </template>
      </Table>
    </div>
  </Page>
</template>
