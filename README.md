# 三月の海 · 个人博客

> 记录计算机系统、网络、安全等技术笔记与生活随想的个人博客

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Deployed-success)](https://wh1cy.github.io)
[![MkDocs](https://img.shields.io/badge/MkDocs-1.6.1-blue)](https://www.mkdocs.org/)
[![Material](https://img.shields.io/badge/Material-9.7.1-blue)](https://squidfunk.github.io/mkdocs-material/)

## ✨ 特性

- 📱 **响应式布局** - 完美适配桌面端、平板和移动设备
- 🌓 **深色模式** - 支持浅色/深色主题切换
- 🔍 **全文搜索** - 基于 Lunr.js 的客户端搜索功能
- 📝 **Markdown 写作** - 使用 Markdown 编写内容，支持数学公式、代码高亮等
- 🚀 **自动部署** - GitHub Actions 自动构建并部署到 GitHub Pages
- ⚡ **快速加载** - 静态站点，加载速度快

## 🛠️ 技术栈

- **静态站点生成器**: [MkDocs](https://www.mkdocs.org/) 1.6.1
- **主题**: [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) 9.7.1
- **托管平台**: GitHub Pages
- **CI/CD**: GitHub Actions
- **版本控制**: Git & GitHub

## 📁 项目结构

```
.
├── docs/                    # 文档源文件目录
│   ├── index.md            # 首页
│   ├── about.md            # 关于页面
│   ├── blog/               # 博客文章
│   ├── courses/            # 课程笔记
│   ├── images/             # 图片资源
│   ├── stylesheets/        # 自定义样式
│   └── javascripts/        # 自定义脚本
├── site/                   # 构建输出目录（自动生成）
├── .github/
│   └── workflows/
│       └── ci.yml         # GitHub Actions 工作流
├── mkdocs.yml             # MkDocs 配置文件
├── requirements.txt       # Python 依赖
└── README.md              # 项目说明文档
```

## 🚀 快速开始

### 环境要求

- Python 3.7+
- pip

### 安装依赖

```bash
pip install -r requirements.txt
```

### 本地开发

启动本地开发服务器：

```bash
mkdocs serve
```

访问 http://127.0.0.1:8000 查看站点。

### 构建静态站点

```bash
mkdocs build
```

构建结果将输出到 `site/` 目录。

## 📝 添加内容

### 添加博客文章

1. 在 `docs/blog/` 目录下创建新的 Markdown 文件
2. 在 `mkdocs.yml` 的 `nav` 配置中添加文章链接
3. 提交并推送到 GitHub，GitHub Actions 会自动构建和部署

### 添加课程笔记

1. 在 `docs/courses/` 目录下创建或更新相应的 Markdown 文件
2. 更新 `mkdocs.yml` 中的导航配置
3. 提交更改

## 🎨 自定义样式

项目包含自定义样式，位于 `docs/stylesheets/extra.css`。主要特性包括：

- 自定义卡片样式
- Hero 区域样式
- 响应式设计
- 深色模式支持

## 🔧 配置说明

主要配置文件为 `mkdocs.yml`，包含：

- 站点基本信息（名称、描述、URL）
- 主题配置（颜色、字体、功能）
- 导航结构
- 插件配置
- 自定义 CSS/JS 引用

## 📦 部署

本项目使用 GitHub Actions 自动部署：

1. 推送到 `main` 分支
2. GitHub Actions 自动触发构建
3. 构建完成后自动部署到 GitHub Pages

部署流程详见 `.github/workflows/ci.yml`。

## 🌐 访问地址

- **生产环境**: https://wh1cy.github.io
- **GitHub 仓库**: https://github.com/wh1cy/wh1cy.github.io

## 📄 许可证

本项目内容采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 许可证。

## 🤝 贡献

欢迎通过以下方式参与：

- 提交 Issue 报告问题或建议
- 提交 Pull Request 改进内容或功能
- 分享文章或笔记

## 📮 联系方式

- **GitHub**: [@wh1cy](https://github.com/wh1cy)
- **博客**: [三月の海](https://wh1cy.github.io)

---

<p align="center">
  Made with ❤️ using <a href="https://www.mkdocs.org/">MkDocs</a> and <a href="https://squidfunk.github.io/mkdocs-material/">Material</a>
</p>
