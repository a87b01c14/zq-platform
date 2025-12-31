export const languageExamples: Record<string, string> = {
  javascript: `// JavaScript 示例
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`,

  typescript: `// TypeScript 示例
interface User {
  id: number;
  name: string;
  email: string;
}

function getUser(id: number): User {
  return {
    id,
    name: 'John Doe',
    email: 'john@example.com',
  };
}`,

  python: `# Python 示例
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

print(quicksort([3, 6, 8, 10, 1, 2, 1]))`,

  sql: `-- SQL 示例
SELECT 
  u.id,
  u.name,
  COUNT(o.id) as order_count,
  SUM(o.amount) as total_amount
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
GROUP BY u.id, u.name
HAVING COUNT(o.id) > 0
ORDER BY total_amount DESC
LIMIT 10;`,

  json: `{
  "name": "code-editor-demo",
  "version": "1.0.0",
  "description": "CodeMirror 代码编辑器演示",
  "dependencies": {
    "codemirror": "^6.0.0",
    "@codemirror/lang-javascript": "^6.0.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
}`,

  html: [
    '<!DOCTYPE html>',
    '<html lang="zh-CN">',
    '<head>',
    '  <meta charset="UTF-8">',
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
    '  <title>代码编辑器演示</title>',
    '  <link rel="stylesheet" href="styles.css">',
    '</head>',
    '<body>',
    '  <div id="app">',
    '    <h1>Hello World</h1>',
    '    <p>这是一个 HTML 示例</p>',
    '  </div>',
    '  <script src="main.js"></' + 'script>',
    '</body>',
    '</html>',
  ].join('\n'),

  css: `/* CSS 示例 */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card {
  background-color: var(--bg-color);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 24px;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
}`,

  markdown: `# Markdown 示例

## 功能特性

- **语法高亮**: 支持多种编程语言
- **主题切换**: 自动跟随系统 dark/light 模式
- **代码折叠**: 支持折叠代码块

## 代码示例

\`\`\`javascript
console.log('Hello, World!');
\`\`\`

> 这是一段引用文字

| 功能 | 状态 |
|------|------|
| 基础编辑 | 已完成 |
| 语法高亮 | 已完成 |`,

  xml: [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<configuration>',
    '  <appSettings>',
    '    <add key="AppName" value="CodeEditor Demo" />',
    '    <add key="Version" value="1.0.0" />',
    '  </appSettings>',
    '  <connectionStrings>',
    '    <add name="DefaultConnection"',
    '         connectionString="Server=localhost;Database=demo;User=admin;" />',
    '  </connectionStrings>',
    '</configuration>',
  ].join('\n'),

  yaml: `# YAML 配置示例
server:
  port: 8080
  host: localhost

database:
  driver: postgresql
  host: localhost
  port: 5432
  name: demo_db
  user: admin
  password: \${DB_PASSWORD}

logging:
  level: info
  format: json
  output:
    - console
    - file

features:
  - name: code-editor
    enabled: true
  - name: syntax-highlight
    enabled: true`,
};
