# 睿鑫食品网站

当前网站：https://ruixinfood.top/

`dist/` 保存网站的 HTML、CSS、JavaScript 和图片资源。`vercel.json` 将 Vercel 发布目录设置为 `dist`。

## UI 改版

2026-10-04 完成整站重新设计：深绿与亮白的品牌视觉、食品摄影首屏、分类产品目录、产品规格弹窗、应用场景、公司介绍及询价表单，并适配桌面与手机。

保留原有六款产品、规格资料和业务联系方式，支持中英文切换、语言偏好记忆、产品筛选和询价。产品数据位于 `dist/products.js`，页面结构、样式及交互分别位于 `dist/index.html`、`dist/styles.css` 和 `dist/app.js`。

## 本地运行

需要 Node.js，无需安装依赖。运行 `npm start`，打开 http://127.0.0.1:4173 。使用 `npm run check` 检查 JavaScript 语法。

## 初始同步来源

- 同步日期：2026-10-04
- Vercel 项目：`ruixinfood-local`
- 域名对应的生产部署：`dpl_BxQKLsq58Cb4LWAhmyWYKzjrYAZt`
- 首次导入时已逐文件校验该部署；后续 UI 改版在此基础上进行。

`images/`、`variants/` 和 `DESIGN.md` 保留此前版本的资源与设计资料；当前网站使用 `dist/`。根目录页面跳转至 `dist/`，兼容现有 GitHub Pages 发布配置。
