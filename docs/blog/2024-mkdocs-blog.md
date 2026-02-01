# 用 MkDocs 搭建博客

**日期**：2024

本文简要说明如何用 MkDocs + Material 主题搭建一个静态博客站点。

## 为什么选 MkDocs

- **Markdown 写作**：直接用 Markdown 写文章，简单清晰
- **Material 主题**：支持搜索、深色模式、响应式布局
- **GitHub Pages**：配置好仓库后，推送即可自动发布

## 常用命令

```bash
# 本地预览（修改后自动刷新）
mkdocs serve

# 构建静态站点（输出到 site/）
mkdocs build
```

## 添加新文章步骤

1. 在 `docs/blog/` 下新建 `.md` 文件
2. 在 `mkdocs.yml` 的 `nav` 里加入该页面的链接
3. 可选：在 `blog/index.md` 的文章列表里加一行

---

*更多用法见 [MkDocs 文档](https://www.mkdocs.org/) 与 [Material 文档](https://squidfunk.github.io/mkdocs-material/)。*
