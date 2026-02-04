---
title: 用 MkDocs 搭建个人博客
---

# 用 MkDocs 搭建个人博客（从零到上线）

很多静态博客框架（Hexo、Hugo、Jekyll 等）都很好用，而如果你更熟悉 Python，**MkDocs + Material 主题** 是一个非常优雅、简洁、适合写技术笔记和课程文档的组合。本篇文章将以一个完整流程，带你从零搭建并部署一个 MkDocs 博客。

本文默认你已经会一点点命令行基础，会用 GitHub。

---

## 1. 安装 MkDocs 与主题

### 1.1 安装 Python 与 pip

- **确认本地已安装 Python 3**  
  在终端中执行：

```bash
python3 --version
pip3 --version
```

若没有安装，请先通过系统包管理器或从 Python 官网安装。

### 1.2 安装 MkDocs

```bash
pip3 install mkdocs
```

安装后可以执行：

```bash
mkdocs --version
```

确认命令可用。

### 1.3 安装 Material 主题（可选但强烈推荐）

```bash
pip3 install mkdocs-material
```

安装完成后，我们就可以在配置文件中启用这个主题。

---

## 2. 初始化一个 MkDocs 项目

### 2.1 创建项目目录

```bash
mkdir my-blog
cd my-blog
```

### 2.2 使用 mkdocs new 初始化

```bash
mkdocs new .
```

执行后，目录结构大致如下：

```text
my-blog/
  mkdocs.yml      # 主配置文件
  docs/
    index.md      # 首页
```

后续你写的所有文章，都推荐放在 `docs/` 目录下。

---

## 3. 基本配置：站点信息与主题

打开项目根目录下的 `mkdocs.yml`，填入基本的站点信息和主题配置。可以参考下面的一个示例（与你当前博客的配置类似）：

```yaml
site_name: 三月の海
site_description: 个人博客与笔记
site_author: wh1cy
site_url: https://wh1cy.github.io

theme:
  name: material
  language: zh
  font:
    text: Lora
    code: Sans Code
  palette:
    - scheme: default
      primary: grey
      accent: indigo
      toggle:
        icon: material/toggle-switch
        name: 切换到深色模式
    - scheme: slate
      primary: grey
      accent: indigo
      toggle:
        icon: material/toggle-switch-off-outline
        name: 切换到浅色模式
  features:
    - navigation.instant
    - navigation.tabs
    - navigation.sections
    - navigation.expand
    - search.suggest
    - search.highlight
```

其中：

- **`site_name`**: 页面左上角显示的站点名称  
- **`site_url`**: 部署后的站点 URL（如果是 GitHub Pages，通常是 `https://用户名.github.io` 或 `https://用户名.github.io/仓库名`）  
- **`theme`**: 启用 Material 主题及其特性

---

## 4. 设计导航栏与文档结构

MkDocs 的导航通过 `mkdocs.yml` 中的 `nav` 字段配置。一个典型结构可以是：

```yaml
nav:
  - 首页: index.md
  - 博客:
    - 文章列表: blog/index.md
    - 用 MkDocs 搭建博客: blog/2026-mkdocs-blog.md
  - 关于: about.md
```

对应的文件结构大致是：

```text
docs/
  index.md
  about.md
  blog/
    index.md
    2026-mkdocs-blog.md
```

**建议：**

- `index.md`：作为首页，可以放置一些自我介绍和站点说明  
- `about.md`：更详细的个人信息、联系方式等  
- `blog/` 目录：专门存放博客文章

---

## 5. 把 MkDocs 当作「博客系统」来用

严格来说，MkDocs 是一个文档生成器，不是传统的「博客系统」。但是我们可以通过简单的约定，让它很好地承载博客文章。

### 5.1 使用文件名中的日期

一个惯例是：**文章文件名中包含日期和简短英文标题**，例如：

- `2026-mkdocs-blog.md`
- `2026-network-notes.md`

这样可以在目录中一眼看出大致时间与主题。

### 5.2 手动维护文章列表

可以像现在这样，在 `docs/blog/index.md` 中维护一个表格，按时间倒序列出文章：

```markdown
# 博客文章列表

所有文章按时间倒序排列，新文章在上。

## 文章索引

| 日期 | 标题 |
|------|------|
| 2026-02-04 | [用 MkDocs 搭建博客](2026-mkdocs-blog.md) |
```

后续每写一篇新文章，只要在这里追加一行，并在 `mkdocs.yml` 的 `nav` 中加上对应链接即可。

---

## 6. 撰写你的第一篇 MkDocs 博文

以当前这篇文章为例，放在 `docs/blog/2026-mkdocs-blog.md`，基本结构可以是：

```markdown
---
title: 用 MkDocs 搭建个人博客
---

# 用 MkDocs 搭建个人博客（从零到上线）

这里写文章正文……
```

YAML 头部（`---` 之间的部分）不是必须，但有些主题或插件可以利用其中的 `title`、`tags` 等信息做更多展示。

### 6.1 Markdown 小技巧

- **标题层级**：`#` 为页面标题，`##`、`###` 为小节  
- **代码块**：使用三反引号并指定语言高亮，例如：

```markdown
```python
def hello():
    print("Hello MkDocs")
```
```

- **公式**：配合 `MathJax` 与 `pymdownx.arithmatex`，可以书写 LaTeX 公式  
- **提示块**：使用 Material 主题提供的 `admonition`：

```markdown
!!! note "小提示"
    这是一个提示块示例。
```

---

## 7. 本地预览与调试

在项目根目录下执行：

```bash
mkdocs serve
```

然后在浏览器中打开 `http://127.0.0.1:8000/`，即可实时预览站点效果。  
你可以一边写 Markdown，一边刷新页面查看样式。

常用命令：

- **启动本地预览**：`mkdocs serve`  
- **只构建静态文件**：`mkdocs build`（输出到 `site/` 目录）

---

## 8. 部署到 GitHub Pages

假设你已经在 GitHub 上创建好一个仓库，例如 `wh1cy/wh1cy.github.io`，并在本地完成了 git 初始化和远程关联。

### 8.1 使用 mkdocs gh-deploy（简单方式）

MkDocs 内置了部署到 GitHub Pages 的命令：

```bash
mkdocs gh-deploy
```

它会自动：

1. 运行 `mkdocs build` 构建静态站点  
2. 把构建结果推送到 `gh-pages` 分支  
3. 帮你配置好 GitHub Pages 服务

执行完成之后，在浏览器中访问 `site_url` 对应的地址即可。

### 8.2 手动部署（可选）

如果你想完全自己控制构建和部署流程，大致步骤是：

1. 在 CI（例如 GitHub Actions）中执行 `mkdocs build`  
2. 将 `site/` 目录的内容发布到 `gh-pages` 分支或 `main` 分支的 `docs/` 目录  
3. 在 GitHub 仓库的「Settings → Pages」中选择相应的分支和目录作为 Pages 源

---

## 9. 插件与进阶功能

在当前配置中，你已经启用了若干常用扩展，例如：

- **`search` 插件**：站内搜索  
- **`pymdownx.highlight`**：代码高亮与行号  
- **`pymdownx.tabbed`**：标签页式内容展示  
- **`pymdownx.arithmatex` + MathJax**：数学公式支持

如果你需要目录自动生成、博客分页、标签云等更加「博客味」的功能，可以考虑：

- `mkdocs-blogging-plugin`
- `mkdocs-rss-plugin`
- `mkdocs-minify-plugin`

使用方式通常是：

```bash
pip3 install mkdocs-blogging-plugin
```

然后在 `mkdocs.yml` 中：

```yaml
plugins:
  - search
  - blogging:
      blog_dir: blog
```

根据插件文档进一步配置即可。

---

## 10. 推荐的写作与维护习惯

- **使用 Git 管理内容**：把 `docs/` 下所有文章纳入版本控制，方便回滚与协作  
- **一篇文章一个文件**：保持文件结构清晰，利于长远维护  
- **定期整理导航与索引**：在 `mkdocs.yml` 的 `nav` 中保持合理分组，在博客列表中保持时间顺序  
- **在本地预览后再提交**：尽量在 `mkdocs serve` 下确认无误再 push 或部署

---

## 总结

通过本文，你已经了解了如何：

- **安装与配置 MkDocs 和 Material 主题**  
- **设计站点结构与导航，把 MkDocs 当成博客系统来用**  
- **撰写、预览并部署你的第一篇博文**  

MkDocs 的优势在于：**简单、纯文本、版本可控、适合写技术文档和课程说明**。一旦你把写作习惯迁移到 Markdown + Git，再配合 MkDocs 渲染与部署，一个轻量、优雅且可长期维护的个人博客就自然成形了。

后续你可以继续在 `blog/` 目录下添加新的文章文件，并在博客列表与导航中补充链接，让这个站点逐渐成长为你的「知识基地」。

