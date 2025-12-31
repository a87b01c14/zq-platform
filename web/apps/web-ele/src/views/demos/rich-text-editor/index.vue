<script setup lang="ts">
import { ref } from 'vue';

import { Page } from '@vben/common-ui';
import { Code, Eye } from '@vben/icons';

import {
  ElButton,
  ElCard,
  ElDialog,
  ElDivider,
  ElForm,
  ElFormItem,
  ElInputNumber,
  ElMessage,
  ElSwitch,
} from 'element-plus';

import { RichTextEditor } from '#/components/zq-form/rich-text-editor';

// 基础示例
const basicContent = ref(
  '<p>这是一个<strong>富文本编辑器</strong>示例。</p><p>支持<em>斜体</em>、<u>下划线</u>、<s>删除线</s>等格式。</p>',
);

// 完整功能示例
const fullContent = ref(`
<h1>富文本编辑器功能演示</h1>
<p>这是一个功能完整的富文本编辑器，基于 <a href="https://tiptap.dev" target="_blank">Tiptap</a> 构建。</p>
<h2>支持的功能</h2>
<ul>
  <li><strong>文本格式</strong>：加粗、斜体、下划线、删除线</li>
  <li><strong>标题</strong>：H1、H2、H3</li>
  <li><strong>对齐</strong>：左对齐、居中、右对齐、两端对齐</li>
  <li><strong>列表</strong>：有序列表、无序列表</li>
  <li><strong>颜色</strong>：文字颜色、背景色</li>
  <li><strong>插入</strong>：链接、图片、表格</li>
  <li><strong>其他</strong>：引用、代码、分割线</li>
</ul>
<h2>表格示例</h2>
<table>
  <tr>
    <th>功能</th>
    <th>描述</th>
    <th>状态</th>
  </tr>
  <tr>
    <td>基础格式</td>
    <td>加粗、斜体、下划线等</td>
    <td>已完成</td>
  </tr>
  <tr>
    <td>高级功能</td>
    <td>表格、图片、链接</td>
    <td>已完成</td>
  </tr>
</table>
<blockquote>
  <p>这是一段引用文字，可以用来强调重要内容。</p>
</blockquote>
<hr>
<p style="text-align: center;">感谢使用！</p>
`);

// 只读模式
const readonlyContent = ref(
  '<p>这是<strong>只读模式</strong>的内容，无法编辑。</p>',
);
const isReadonly = ref(true);

// 禁用模式
const disabledContent = ref('<p>这是<strong>禁用模式</strong>的内容。</p>');
const isDisabled = ref(true);

// 配置选项
const configContent = ref('<p>可以通过配置调整编辑器的行为。</p>');
const showToolbar = ref(true);
const showWordCount = ref(true);
const minHeight = ref(150);
const maxHeight = ref(400);
const placeholder = ref('请输入内容...');

// 获取内容
const editorRef = ref<InstanceType<typeof RichTextEditor> | null>(null);
const outputContent = ref('');
const outputDialogVisible = ref(false);

const handleGetContent = () => {
  if (editorRef.value) {
    outputContent.value = editorRef.value.getHTML();
    outputDialogVisible.value = true;
  }
};

const handleGetText = () => {
  if (editorRef.value) {
    outputContent.value = editorRef.value.getText();
    outputDialogVisible.value = true;
  }
};

const handleClear = () => {
  if (editorRef.value) {
    editorRef.value.clear();
    ElMessage.success('内容已清空');
  }
};

// 事件处理
const handleChange = (content: string) => {
  console.log('内容变化:', `${content.slice(0, 100)}...`);
};

const handleFocus = () => {
  console.log('编辑器获得焦点');
};

const handleBlur = () => {
  console.log('编辑器失去焦点');
};
</script>

<template>
  <Page title="富文本编辑器" description="基于 Tiptap 的富文本编辑器组件">
    <div class="space-y-6">
      <!-- 基础示例 -->
      <ElCard shadow="never">
        <template #header>
          <div class="flex items-center gap-2">
            <Eye class="h-5 w-5" />
            <span class="font-medium">基础示例</span>
          </div>
        </template>
        <RichTextEditor v-model="basicContent" placeholder="请输入内容..." />
        <div class="mt-4">
          <div class="text-sm text-[var(--el-text-color-secondary)]">
            当前内容：
          </div>
          <div class="mt-2 rounded bg-[var(--el-fill-color-light)] p-3 text-sm">
            {{ basicContent }}
          </div>
        </div>
      </ElCard>

      <!-- 完整功能示例 -->
      <ElCard shadow="never">
        <template #header>
          <div class="flex items-center gap-2">
            <Code class="h-5 w-5" />
            <span class="font-medium">完整功能示例</span>
          </div>
        </template>
        <div class="mb-4 rounded bg-[var(--el-color-info-light-9)] p-3 text-sm">
          <div class="mb-1 font-medium text-[var(--el-color-info)]">
            功能说明
          </div>
          <ul
            class="list-inside list-disc text-[var(--el-text-color-secondary)]"
          >
            <li>
              <strong>图片上传</strong>：点击工具栏图片按钮上传、粘贴
              (Ctrl+V)、拖拽图片
            </li>
            <li>
              <strong>图片/视频编辑</strong
              >：右键点击图片或视频打开编辑菜单（对齐、缩放、删除等），拖动四角控制点调整大小
            </li>
            <li>
              <strong>附件上传</strong
              >：点击工具栏附件按钮上传文件，支持常见文档格式，最大 50MB
            </li>
            <li>
              <strong>视频上传</strong
              >：点击工具栏视频按钮上传或插入网络视频，支持 MP4、WebM、OGG，最大
              100MB
            </li>
          </ul>
        </div>
        <RichTextEditor
          ref="editorRef"
          v-model="fullContent"
          :min-height="300"
          :max-height="600"
          @change="handleChange"
          @focus="handleFocus"
          @blur="handleBlur"
        />
        <div class="mt-4 flex gap-2">
          <ElButton type="primary" @click="handleGetContent">
            获取 HTML
          </ElButton>
          <ElButton @click="handleGetText">获取纯文本</ElButton>
          <ElButton type="danger" @click="handleClear">清空内容</ElButton>
        </div>
      </ElCard>

      <!-- 只读/禁用模式 -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ElCard shadow="never">
          <template #header>
            <div class="flex items-center justify-between">
              <span class="font-medium">只读模式</span>
              <ElSwitch
                v-model="isReadonly"
                active-text="只读"
                inactive-text="可编辑"
              />
            </div>
          </template>
          <RichTextEditor v-model="readonlyContent" :readonly="isReadonly" />
        </ElCard>

        <ElCard shadow="never">
          <template #header>
            <div class="flex items-center justify-between">
              <span class="font-medium">禁用模式</span>
              <ElSwitch
                v-model="isDisabled"
                active-text="禁用"
                inactive-text="启用"
              />
            </div>
          </template>
          <RichTextEditor v-model="disabledContent" :disabled="isDisabled" />
        </ElCard>
      </div>

      <!-- 配置选项 -->
      <ElCard shadow="never">
        <template #header>
          <span class="font-medium">配置选项</span>
        </template>
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <ElForm label-width="100px" label-position="left">
              <ElFormItem label="显示工具栏">
                <ElSwitch v-model="showToolbar" />
              </ElFormItem>
              <ElFormItem label="显示字数">
                <ElSwitch v-model="showWordCount" />
              </ElFormItem>
              <ElFormItem label="最小高度">
                <ElInputNumber
                  v-model="minHeight"
                  :min="100"
                  :max="500"
                  :step="50"
                />
              </ElFormItem>
              <ElFormItem label="最大高度">
                <ElInputNumber
                  v-model="maxHeight"
                  :min="200"
                  :max="800"
                  :step="50"
                />
              </ElFormItem>
            </ElForm>
          </div>
          <div>
            <RichTextEditor
              v-model="configContent"
              :show-toolbar="showToolbar"
              :show-word-count="showWordCount"
              :min-height="minHeight"
              :max-height="maxHeight"
              :placeholder="placeholder"
            />
          </div>
        </div>
      </ElCard>

      <!-- API 说明 -->
      <ElCard shadow="never">
        <template #header>
          <span class="font-medium">API 说明</span>
        </template>
        <div class="space-y-4">
          <div>
            <h4 class="mb-2 font-medium">Props</h4>
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-[var(--el-border-color)]">
                  <th class="py-2 text-left">属性</th>
                  <th class="py-2 text-left">说明</th>
                  <th class="py-2 text-left">类型</th>
                  <th class="py-2 text-left">默认值</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-[var(--el-border-color)]">
                  <td class="py-2"><code>v-model</code></td>
                  <td class="py-2">编辑器内容 (HTML)</td>
                  <td class="py-2"><code>string</code></td>
                  <td class="py-2"><code>''</code></td>
                </tr>
                <tr class="border-b border-[var(--el-border-color)]">
                  <td class="py-2"><code>placeholder</code></td>
                  <td class="py-2">占位符</td>
                  <td class="py-2"><code>string</code></td>
                  <td class="py-2"><code>'请输入内容...'</code></td>
                </tr>
                <tr class="border-b border-[var(--el-border-color)]">
                  <td class="py-2"><code>disabled</code></td>
                  <td class="py-2">是否禁用</td>
                  <td class="py-2"><code>boolean</code></td>
                  <td class="py-2"><code>false</code></td>
                </tr>
                <tr class="border-b border-[var(--el-border-color)]">
                  <td class="py-2"><code>readonly</code></td>
                  <td class="py-2">是否只读</td>
                  <td class="py-2"><code>boolean</code></td>
                  <td class="py-2"><code>false</code></td>
                </tr>
                <tr class="border-b border-[var(--el-border-color)]">
                  <td class="py-2"><code>minHeight</code></td>
                  <td class="py-2">最小高度</td>
                  <td class="py-2"><code>number | string</code></td>
                  <td class="py-2"><code>200</code></td>
                </tr>
                <tr class="border-b border-[var(--el-border-color)]">
                  <td class="py-2"><code>maxHeight</code></td>
                  <td class="py-2">最大高度</td>
                  <td class="py-2"><code>number | string</code></td>
                  <td class="py-2"><code>500</code></td>
                </tr>
                <tr class="border-b border-[var(--el-border-color)]">
                  <td class="py-2"><code>showToolbar</code></td>
                  <td class="py-2">是否显示工具栏</td>
                  <td class="py-2"><code>boolean</code></td>
                  <td class="py-2"><code>true</code></td>
                </tr>
                <tr class="border-b border-[var(--el-border-color)]">
                  <td class="py-2"><code>showWordCount</code></td>
                  <td class="py-2">是否显示字数统计</td>
                  <td class="py-2"><code>boolean</code></td>
                  <td class="py-2"><code>true</code></td>
                </tr>
              </tbody>
            </table>
          </div>
          <ElDivider />
          <div>
            <h4 class="mb-2 font-medium">Events</h4>
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-[var(--el-border-color)]">
                  <th class="py-2 text-left">事件</th>
                  <th class="py-2 text-left">说明</th>
                  <th class="py-2 text-left">参数</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-[var(--el-border-color)]">
                  <td class="py-2"><code>change</code></td>
                  <td class="py-2">内容变化时触发</td>
                  <td class="py-2"><code>(content: string)</code></td>
                </tr>
                <tr class="border-b border-[var(--el-border-color)]">
                  <td class="py-2"><code>focus</code></td>
                  <td class="py-2">获得焦点时触发</td>
                  <td class="py-2"><code>(event: FocusEvent)</code></td>
                </tr>
                <tr class="border-b border-[var(--el-border-color)]">
                  <td class="py-2"><code>blur</code></td>
                  <td class="py-2">失去焦点时触发</td>
                  <td class="py-2"><code>(event: FocusEvent)</code></td>
                </tr>
                <tr class="border-b border-[var(--el-border-color)]">
                  <td class="py-2"><code>ready</code></td>
                  <td class="py-2">编辑器初始化完成</td>
                  <td class="py-2"><code>(editor: Editor)</code></td>
                </tr>
              </tbody>
            </table>
          </div>
          <ElDivider />
          <div>
            <h4 class="mb-2 font-medium">Methods</h4>
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-[var(--el-border-color)]">
                  <th class="py-2 text-left">方法</th>
                  <th class="py-2 text-left">说明</th>
                  <th class="py-2 text-left">返回值</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-[var(--el-border-color)]">
                  <td class="py-2"><code>getEditor()</code></td>
                  <td class="py-2">获取编辑器实例</td>
                  <td class="py-2"><code>Editor</code></td>
                </tr>
                <tr class="border-b border-[var(--el-border-color)]">
                  <td class="py-2"><code>getHTML()</code></td>
                  <td class="py-2">获取 HTML 内容</td>
                  <td class="py-2"><code>string</code></td>
                </tr>
                <tr class="border-b border-[var(--el-border-color)]">
                  <td class="py-2"><code>getText()</code></td>
                  <td class="py-2">获取纯文本内容</td>
                  <td class="py-2"><code>string</code></td>
                </tr>
                <tr class="border-b border-[var(--el-border-color)]">
                  <td class="py-2"><code>setContent(content)</code></td>
                  <td class="py-2">设置内容</td>
                  <td class="py-2"><code>void</code></td>
                </tr>
                <tr class="border-b border-[var(--el-border-color)]">
                  <td class="py-2"><code>clear()</code></td>
                  <td class="py-2">清空内容</td>
                  <td class="py-2"><code>void</code></td>
                </tr>
                <tr class="border-b border-[var(--el-border-color)]">
                  <td class="py-2"><code>focus()</code></td>
                  <td class="py-2">聚焦编辑器</td>
                  <td class="py-2"><code>void</code></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </ElCard>
    </div>

    <!-- 输出内容弹窗 -->
    <ElDialog v-model="outputDialogVisible" title="编辑器内容" width="600px">
      <div
        class="max-h-96 overflow-auto rounded bg-[var(--el-fill-color-light)] p-4"
      >
        <pre class="whitespace-pre-wrap break-all text-sm">{{
          outputContent
        }}</pre>
      </div>
    </ElDialog>
  </Page>
</template>
