<script setup lang="ts">
import { Page } from '@vben/common-ui';

import { useZqTable } from '#/components/zq-table';

// 模拟 API
const fetchList = async ({ page }: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        items: Array.from({ length: page.pageSize }).map((_, i) => ({
          id: i,
          name: `User ${i + 1 + (page.currentPage - 1) * page.pageSize}`,
          age: Math.floor(Math.random() * 50) + 18,
          role: ['Admin', 'User', 'Guest'][i % 3],
          date: new Date().toLocaleDateString(),
        })),
        total: 100,
      });
    }, 500);
  });
};

const columns = [
  { key: 'name', dataKey: 'name', title: 'Name', width: 150 },
  { key: 'age', dataKey: 'age', title: 'Age', width: 100 },
  { key: 'role', dataKey: 'role', title: 'Role', width: 150 },
  { key: 'date', dataKey: 'date', title: 'Date', width: 200 },
];

const [Table] = useZqTable({
  tableTitle: '基础示例',
  gridOptions: {
    columns,
    proxyConfig: {
      ajax: {
        query: fetchList,
      },
    },
  },
});
</script>

<template>
  <Page title="ZqTable 基础示例">
    <div class="h-[600px]">
      <Table />
    </div>
  </Page>
</template>
