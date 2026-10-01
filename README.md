# Kyson Library

Kyson 的开心图书馆：一个可以持续改进的亲子互动项目。

孩子当店长，和奶龙、小七一起选书、模拟结账，再让小天送书。

当前可在手机浏览器打开的 GitHub Pages 版本：https://zhaosongli.github.io/kyson-library/

此前的 ChatGPT Site 版本：https://happy-library-adventure.zhaosongli1982.chatgpt.site/ （是独立站点，不会随 GitHub Pages 发布自动更新）。

## 本地运行

需要 Node.js 22.13 或更高版本及 npm。

```sh
npm ci
npm run dev
```

打开终端显示的本地地址。

## 检查和构建

```sh
npm run lint
npm run build
```

## 从哪里开始修改

- `app/page.tsx`：书籍、选书、结账、配送和主要界面。
- `app/globals.css`：全局样式。
- `app/layout.tsx`：页面布局和元信息。
- `public/assets/`：图书馆图片。
- `components/ui/`：可复用的界面组件。

每次可以选一个小目标，例如增加一本书、调整书价或改善配送动画；完成后检查功能，再提交到 GitHub。

## 发布到手机网页

推送 `main` 会触发 `.github/workflows/pages.yml`，以 Node 22 把应用静态导出到 `dist/client` 并发布到 GitHub Pages。页面链接为 https://zhaosongli.github.io/kyson-library/ 。此构建会设置 `GITHUB_PAGES=true` 和 `NEXT_PUBLIC_BASE_PATH=/kyson-library`；非 Pages 构建仍保留原站点根路径配置。模拟付款仅为游戏交互，不会实际扣费。

## 项目来源

保留 2026 年 9 月 19 日发布版本的源码及 Git 历史，作为 Kyson 后续改进的起点。
项目使用 React、TypeScript、Tailwind CSS、Vite 和 Vinext。
`.openai/hosting.json` 保留旧 ChatGPT Site 的关联；推送 GitHub 会更新本项目的 GitHub Pages 网页，但不会自动更新旧站。
