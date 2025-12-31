<script setup lang="ts">
import { ref } from 'vue';

import { Page } from '@vben/common-ui';
import { Copy, FileCode, Play } from '@vben/icons';

import {
  ElButton,
  ElCard,
  ElCol,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElMessage,
  ElOption,
  ElRow,
  ElSelect,
  ElSwitch,
} from 'element-plus';

import {
  CodeEditor,
  supportedLanguages,
} from '#/components/zq-form/code-editor';

import { languageExamples } from './examples';

// 基础示例
const basicCode = ref(`function greet(name) {
  console.log('Hello, ' + name + '!');
}

greet('World');`);

// 多语言示例
const selectedLanguage = ref('javascript');
const multiLangCode = ref(languageExamples.javascript);

const handleLanguageChange = (lang: string) => {
  multiLangCode.value = languageExamples[lang] || '';
};

// 只读模式
const readonlyCode = ref(`// 这是只读模式的代码
const PI = 3.14159265359;
const E = 2.71828182846;

function calculateCircleArea(radius) {
  return PI * radius * radius;
}`);
const isReadonly = ref(true);

// 禁用模式
const disabledCode = ref(`// 这是禁用模式的代码
function disabled() {
  console.log('This editor is disabled');
}`);
const isDisabled = ref(true);

// 配置选项
const configCode = ref(`// 可以通过配置调整编辑器的行为
function demo() {
  const options = {
    lineNumbers: true,
    lineWrapping: false,
    foldGutter: true,
  };
  return options;
}`);
const showLineNumbers = ref(true);
const showLineWrapping = ref(false);
const showFoldGutter = ref(true);
const highlightActiveLine = ref(true);
const bracketMatching = ref(true);
const autocompletion = ref(true);
const editorHeight = ref(200);
const tabSize = ref(2);
const placeholder = ref('请输入代码...');

// JSON 格式化示例
const jsonCode = ref(
  `{"name":"demo","version":"1.0.0","dependencies":{"vue":"^3.0.0","element-plus":"^2.0.0"}}`,
);
const jsonEditorRef = ref<InstanceType<typeof CodeEditor> | null>(null);

const handleFormatJson = () => {
  if (jsonEditorRef.value) {
    jsonEditorRef.value.format();
    ElMessage.success('JSON 格式化成功');
  }
};

// 获取内容
const editorRef = ref<InstanceType<typeof CodeEditor> | null>(null);

const handleGetContent = () => {
  if (editorRef.value) {
    const content = editorRef.value.getValue();
    ElMessage.success(`获取到 ${content.length} 个字符`);
    console.log('代码内容:', content);
  }
};

const handleCopyContent = () => {
  if (editorRef.value) {
    const content = editorRef.value.getValue();
    navigator.clipboard.writeText(content).then(() => {
      ElMessage.success('代码已复制到剪贴板');
    });
  }
};

const handleFocus = () => {
  if (editorRef.value) {
    editorRef.value.focus();
  }
};

// 事件处理
const handleChange = (content: string) => {
  console.log('代码变化:', `${content.slice(0, 50)}...`);
};

const handleEditorFocus = () => {
  console.log('编辑器获得焦点');
};

const handleEditorBlur = () => {
  console.log('编辑器失去焦点');
};
</script>

<template>
  <Page title="代码编辑器演示" description="基于 CodeMirror 6 的代码编辑器组件">
    <ElRow :gutter="16">
      <!-- 基础示例 -->
      <ElCol :span="12">
        <ElCard shadow="never" class="mb-4">
          <template #header>
            <div class="flex items-center gap-2">
              <FileCode :size="18" />
              <span class="font-semibold">基础示例</span>
            </div>
          </template>
          <CodeEditor
            ref="editorRef"
            v-model="basicCode"
            language="javascript"
            height="200px"
            @change="handleChange"
            @focus="handleEditorFocus"
            @blur="handleEditorBlur"
          />
          <div class="mt-3 flex gap-2">
            <ElButton size="small" @click="handleGetContent">
              <Play :size="14" class="mr-1" />
              获取内容
            </ElButton>
            <ElButton size="small" @click="handleCopyContent">
              <Copy :size="14" class="mr-1" />
              复制代码
            </ElButton>
            <ElButton size="small" @click="handleFocus">聚焦编辑器</ElButton>
          </div>
        </ElCard>
      </ElCol>

      <!-- 多语言支持 -->
      <ElCol :span="12">
        <ElCard shadow="never" class="mb-4">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <FileCode :size="18" />
                <span class="font-semibold">多语言支持</span>
              </div>
              <ElSelect
                v-model="selectedLanguage"
                size="small"
                style="width: 140px"
                @change="handleLanguageChange"
              >
                <ElOption
                  v-for="lang in supportedLanguages"
                  :key="lang"
                  :label="lang"
                  :value="lang"
                />
              </ElSelect>
            </div>
          </template>
          <CodeEditor
            v-model="multiLangCode"
            :language="selectedLanguage"
            height="200px"
          />
        </ElCard>
      </ElCol>

      <!-- 只读模式 -->
      <ElCol :span="12">
        <ElCard shadow="never" class="mb-4">
          <template #header>
            <div class="flex items-center justify-between">
              <span class="font-semibold">只读模式</span>
              <ElSwitch
                v-model="isReadonly"
                active-text="只读"
                inactive-text="可编辑"
              />
            </div>
          </template>
          <CodeEditor
            v-model="readonlyCode"
            language="javascript"
            height="150px"
            :readonly="isReadonly"
          />
        </ElCard>
      </ElCol>

      <!-- 禁用模式 -->
      <ElCol :span="12">
        <ElCard shadow="never" class="mb-4">
          <template #header>
            <div class="flex items-center justify-between">
              <span class="font-semibold">禁用模式</span>
              <ElSwitch
                v-model="isDisabled"
                active-text="禁用"
                inactive-text="启用"
              />
            </div>
          </template>
          <CodeEditor
            v-model="disabledCode"
            language="javascript"
            height="150px"
            :disabled="isDisabled"
          />
        </ElCard>
      </ElCol>

      <!-- JSON 格式化 -->
      <ElCol :span="12">
        <ElCard shadow="never" class="mb-4">
          <template #header>
            <div class="flex items-center justify-between">
              <span class="font-semibold">JSON 格式化</span>
              <ElButton size="small" type="primary" @click="handleFormatJson">
                格式化 JSON
              </ElButton>
            </div>
          </template>
          <CodeEditor
            ref="jsonEditorRef"
            v-model="jsonCode"
            language="json"
            height="150px"
          />
        </ElCard>
      </ElCol>

      <!-- 配置选项 -->
      <ElCol :span="12">
        <ElCard shadow="never" class="mb-4">
          <template #header>
            <span class="font-semibold">配置选项</span>
          </template>
          <ElForm label-width="100px" size="small" class="mb-3">
            <ElRow :gutter="12">
              <ElCol :span="8">
                <ElFormItem label="行号">
                  <ElSwitch v-model="showLineNumbers" />
                </ElFormItem>
              </ElCol>
              <ElCol :span="8">
                <ElFormItem label="自动换行">
                  <ElSwitch v-model="showLineWrapping" />
                </ElFormItem>
              </ElCol>
              <ElCol :span="8">
                <ElFormItem label="代码折叠">
                  <ElSwitch v-model="showFoldGutter" />
                </ElFormItem>
              </ElCol>
              <ElCol :span="8">
                <ElFormItem label="高亮当前行">
                  <ElSwitch v-model="highlightActiveLine" />
                </ElFormItem>
              </ElCol>
              <ElCol :span="8">
                <ElFormItem label="括号匹配">
                  <ElSwitch v-model="bracketMatching" />
                </ElFormItem>
              </ElCol>
              <ElCol :span="8">
                <ElFormItem label="自动补全">
                  <ElSwitch v-model="autocompletion" />
                </ElFormItem>
              </ElCol>
              <ElCol :span="8">
                <ElFormItem label="高度">
                  <ElInputNumber
                    v-model="editorHeight"
                    :min="100"
                    :max="500"
                    :step="50"
                  />
                </ElFormItem>
              </ElCol>
              <ElCol :span="8">
                <ElFormItem label="Tab 大小">
                  <ElInputNumber
                    v-model="tabSize"
                    :min="2"
                    :max="8"
                    :step="2"
                  />
                </ElFormItem>
              </ElCol>
              <ElCol :span="8">
                <ElFormItem label="占位符">
                  <ElInput v-model="placeholder" />
                </ElFormItem>
              </ElCol>
            </ElRow>
          </ElForm>
          <CodeEditor
            v-model="configCode"
            language="javascript"
            :height="editorHeight"
            :line-numbers="showLineNumbers"
            :line-wrapping="showLineWrapping"
            :fold-gutter="showFoldGutter"
            :highlight-active-line="highlightActiveLine"
            :bracket-matching="bracketMatching"
            :autocompletion="autocompletion"
            :tab-size="tabSize"
            :placeholder="placeholder"
          />
        </ElCard>
      </ElCol>
    </ElRow>
  </Page>
</template>
