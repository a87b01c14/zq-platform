<script setup lang="ts">
import { Page } from '@vben/common-ui';

import { useZqTable } from '#/components/zq-table';

const fetchList = async ({ page, form }: any) => {
  console.log('Query params:', form);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        items: Array.from({ length: page.pageSize }).map((_, i) => ({
          id: i,
          name: `User ${i + 1}`,
          department: form.department || 'All',
          status: form.status || 'Active',
        })),
        total: 50,
      });
    }, 500);
  });
};

const [Table] = useZqTable({
  tableTitle: '带搜索表单',
  gridOptions: {
    columns: [
      { key: 'name', dataKey: 'name', title: 'Name', width: 150 },
      {
        key: 'department',
        dataKey: 'department',
        title: 'Department',
        width: 150,
      },
      { key: 'status', dataKey: 'status', title: 'Status', width: 100 },
    ],
    proxyConfig: {
      ajax: {
        query: fetchList,
      },
    },
  },
  formOptions: {
    schema: [
      {
        fieldName: 'name',
        label: 'Name',
        component: 'Input',
      },
      {
        fieldName: 'department',
        label: 'Department',
        component: 'Select',
        componentProps: {
          options: [
            { label: 'IT', value: 'IT' },
            { label: 'HR', value: 'HR' },
          ],
        },
      },
      {
        fieldName: 'status',
        label: 'Status',
        component: 'Select',
        componentProps: {
          options: [
            { label: 'Active', value: 'Active' },
            { label: 'Inactive', value: 'Inactive' },
          ],
        },
      },
    ],
  },
});
</script>

<template>
  <Page auto-content-height>
    <Table />
  </Page>
</template>
