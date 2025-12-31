<script setup lang="ts">
import { ref } from 'vue';

import { ElAlert, ElCard, ElDivider, ElForm, ElFormItem } from 'element-plus';

import { getPostListApi, getPostsByIds } from '#/api/core/post';
import { getRoleListApi, getRolesByIds } from '#/api/core/role';
import { ZqApiSelect } from '#/components/zq-form/zq-api-selector';

// 单选示例
const singleValue = ref<string>('');

// 多选示例
const multipleValue = ref<string[]>([]);

// 角色选择示例
const roleValue = ref<string>('');

// 模拟 API 适配器（将现有 API 适配为 ZqApiSelect 需要的格式）
const postApi = async (params: {
  keyword?: string;
  page: number;
  pageSize: number;
}) => {
  const result = await getPostListApi({
    page: params.page,
    pageSize: params.pageSize,
    name: params.keyword,
  });
  return {
    items: result?.items || [],
    total: result?.total || 0,
  };
};

const roleApi = async (params: {
  keyword?: string;
  page: number;
  pageSize: number;
}) => {
  const result = await getRoleListApi({
    page: params.page,
    pageSize: params.pageSize,
    name: params.keyword,
  });
  return {
    items: result?.items || [],
    total: result?.total || 0,
  };
};
</script>

<template>
  <div class="p-4">
    <ElAlert
      title="ZqApiSelect 组件演示"
      description="通用 API 选择器组件，支持分页加载、搜索、单选/多选模式"
      type="info"
      :closable="false"
      class="mb-4"
    />

    <ElCard header="基础用法" class="mb-4">
      <ElForm label-width="120px">
        <ElFormItem label="单选岗位">
          <ZqApiSelect
            v-model="singleValue"
            :api="postApi"
            :api-by-ids="getPostsByIds"
            value-field="id"
            label-field="name"
            extra-field="code"
            dialog-title="选择岗位"
            placeholder="请选择岗位"
          />
        </ElFormItem>
        <ElFormItem label="当前值">
          <code class="text-sm">{{ singleValue || '未选择' }}</code>
        </ElFormItem>
      </ElForm>
    </ElCard>

    <ElCard header="多选模式" class="mb-4">
      <ElForm label-width="120px">
        <ElFormItem label="多选岗位">
          <ZqApiSelect
            v-model="multipleValue"
            :api="postApi"
            :api-by-ids="getPostsByIds"
            value-field="id"
            label-field="name"
            extra-field="code"
            dialog-title="选择岗位（多选）"
            placeholder="请选择岗位"
            multiple
          />
        </ElFormItem>
        <ElFormItem label="当前值">
          <code class="text-sm">{{
            multipleValue.length > 0 ? multipleValue.join(', ') : '未选择'
          }}</code>
        </ElFormItem>
      </ElForm>
    </ElCard>

    <ElCard header="角色选择示例" class="mb-4">
      <ElForm label-width="120px">
        <ElFormItem label="选择角色">
          <ZqApiSelect
            v-model="roleValue"
            :api="roleApi"
            :api-by-ids="getRolesByIds"
            value-field="id"
            label-field="name"
            extra-field="code"
            dialog-title="选择角色"
            placeholder="请选择角色"
          />
        </ElFormItem>
        <ElFormItem label="当前值">
          <code class="text-sm">{{ roleValue || '未选择' }}</code>
        </ElFormItem>
      </ElForm>
    </ElCard>

    <ElDivider />

    <ElCard header="Props 说明">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b">
            <th class="p-2 text-left">属性</th>
            <th class="p-2 text-left">类型</th>
            <th class="p-2 text-left">默认值</th>
            <th class="p-2 text-left">说明</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b">
            <td class="p-2"><code>api</code></td>
            <td class="p-2">Function</td>
            <td class="p-2">-</td>
            <td class="p-2">列表查询 API（必填）</td>
          </tr>
          <tr class="border-b">
            <td class="p-2"><code>apiByIds</code></td>
            <td class="p-2">Function</td>
            <td class="p-2">-</td>
            <td class="p-2">根据 ID 查询 API（用于回显）</td>
          </tr>
          <tr class="border-b">
            <td class="p-2"><code>valueField</code></td>
            <td class="p-2">string</td>
            <td class="p-2">'id'</td>
            <td class="p-2">值字段名</td>
          </tr>
          <tr class="border-b">
            <td class="p-2"><code>labelField</code></td>
            <td class="p-2">string</td>
            <td class="p-2">'name'</td>
            <td class="p-2">标签字段名</td>
          </tr>
          <tr class="border-b">
            <td class="p-2"><code>extraField</code></td>
            <td class="p-2">string</td>
            <td class="p-2">-</td>
            <td class="p-2">额外信息字段名</td>
          </tr>
          <tr class="border-b">
            <td class="p-2"><code>multiple</code></td>
            <td class="p-2">boolean</td>
            <td class="p-2">false</td>
            <td class="p-2">是否多选</td>
          </tr>
          <tr class="border-b">
            <td class="p-2"><code>dialogTitle</code></td>
            <td class="p-2">string</td>
            <td class="p-2">'请选择'</td>
            <td class="p-2">弹窗标题</td>
          </tr>
          <tr class="border-b">
            <td class="p-2"><code>dialogWidth</code></td>
            <td class="p-2">string</td>
            <td class="p-2">'45%'</td>
            <td class="p-2">弹窗宽度</td>
          </tr>
          <tr class="border-b">
            <td class="p-2"><code>pageSize</code></td>
            <td class="p-2">number</td>
            <td class="p-2">20</td>
            <td class="p-2">每页数量</td>
          </tr>
        </tbody>
      </table>
    </ElCard>
  </div>
</template>
