# 蜡笔的人像写真提示词库

一个无需构建的静态网站，收录 106 条人像写真风格提示词、7 组修图模板及 OpenAI、Nano Banana、即梦平台指南。

## 页面

- `/`：完整中文提示词库（106 条）。
- `/en/`：英文试点，精选 16 条提示词与 3 条修图指令；源编号与中文库一致。
- `/guide/`：中文生成与修图使用指南。

`robots.txt` 和 `sitemap.xml` 指向正式域名。中文首页与英文试点有独立 canonical 和双向 `hreflang` 标记。更新英文版时应同步核对译文、标题、条数和站点地图。

## 本地预览

在仓库根目录运行 `python3 -m http.server 8000`，然后打开 `http://localhost:8000`。

## 部署

将此仓库导入 Vercel，选择 `Other` 框架预设，根目录保持仓库根目录，不设置构建命令或输出目录。生产分支为 `main`。

Vercel 项目须先在 Analytics 中启用 Web Analytics（Hobby 免费额度），再部署网站。三个页面通过 `assets/analytics.js` 加载 Vercel 的统计脚本；本地预览时不请求统计接口。部署后用浏览器检查 `/_vercel/insights/script.js` 与页面浏览上报是否成功。

## 说明

网站中的三张摄影图片是 AI 生成的视觉示意，不代表任一提示词或平台的实际出图效果。原始提示词和平台说明来自 Workbuddy 整理稿（2026-09-25）。
