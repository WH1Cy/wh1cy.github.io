---
title: 三月の海 · 个人博客主页
description: 记录计算机系统、网络、安全等技术笔记与生活随想的个人博客。
hide:
  - toc
---

<!-- 渐变网格 + 天气粒子 Canvas（仅首页显示；地区在下方 #greeting 的 data-weather-city） -->
<div class="home-hero-canvas-stack" aria-hidden="true">
  <canvas id="gridCanvas"></canvas>
  <canvas id="weatherCanvas"></canvas>
</div>

<div class="home-intro fade-in">
  <h1 class="home-title">三月の海</h1>
  <p class="home-subtitle">记录技术笔记与生活随想</p>
  <p class="home-typewriter">
    <span id="typewriter-text"></span><span class="typewriter-cursor">|</span>
  </p>
</div>

<!-- 实时天气：修改 data-weather-city 为你的城市（中/英均可）；或改用 data-weather-lat / data-weather-lon 指定坐标（此时可不写 city） -->
<div id="greeting" class="greeting-container fade-in" data-weather-city="杭州">
  <div class="greeting-time-line">
    <span id="greeting-time" class="greeting-time"></span>
  </div>
  <div class="greeting-weather-line">
    <span id="greeting-weather" class="greeting-weather"></span>
  </div>
  <div class="greeting-status-line">
    <span id="greeting-status" class="greeting-status"></span>
  </div>
</div>

<div class="home-scroll-arrow-wrap">
  <!-- 使用 button 避免 Material instant 把带 href 的 a 当成整页导航，首次点击被拉到顶并重绘 -->
  <button type="button" class="home-scroll-arrow" data-scroll-target="#about-me" aria-label="向下滑动，查看下方内容">
    <span class="home-scroll-arrow__chevron" aria-hidden="true"></span>
  </button>
</div>

## 关于我 {#about-me}

<div class="grid cards" markdown>

-   :material-account-circle-outline:{ .lg .middle } __关于我__

    ---

    ![头像](images/Rain01.jpg){ .avatar-in-card loading="lazy" align=right width="120" height="120" }

    你好，我是**三月海**，2023级ZJU信息安全在读，这个博客主要记录自己的学习笔记与技术思考，希望通过文字沉淀知识，欢迎通过 [GitHub](https://github.com/wh1cy){ target="_blank" rel="noopener" } 与我交流！

</div>

---

## 浏览本站

<div class="grid cards" markdown>

-   :material-compass-outline:{ .lg .middle } __如何浏览本站__

    ---

    - 通过<mark>左侧目录</mark>或顶部导航选择分类
    - 使用<ins>搜索</ins>快速查找文章
    - 欢迎在 [友链](friends/index.md) 交换链接

</div>

---

## 最近更新 {#recent-posts}

<div class="grid cards" markdown>

-   :material-book-open-variant:{ .lg .middle } __GitHub 使用教学：从零到协作__

    ---

    从零基础安装 Git，到在 GitHub 上托管代码、协作开发，结合实战项目举例。

    [:octicons-arrow-right-24: 阅读全文](blog/2026-github-guide.md)

-   :material-book-open-variant:{ .lg .middle } __用 MkDocs 搭建个人博客__

    ---

    从安装、配置到部署，完整流程带你从零搭建并部署一个 MkDocs 博客。

    [:octicons-arrow-right-24: 阅读全文](blog/2026-mkdocs-blog.md)

</div>

---

## 推荐文章

<div class="grid cards" markdown>

-   :material-bookmark-multiple-outline:{ .lg .middle } __精选文章__

    ---

    - [考研记录楼](blog/2026-kaoyan-log.md)
    - [Markdown 基础语法教学](blog/2026-markdown-guide.md)
    - [GitHub 使用教学：从零到协作](blog/2026-github-guide.md)
    - [用 MkDocs 搭建个人博客](blog/2026-mkdocs-blog.md)

</div>

---

## 快速导航

<div class="grid cards" markdown>

-   :material-book-multiple:{ .lg .middle } __博客__

    ---

    查看所有技术笔记与生活随想

    [:octicons-arrow-right-24: 进入博客](blog/index.md)

-   :material-school:{ .lg .middle } __课程__

    ---

    计算机系统、网络、安全等课程笔记与实验报告

    [:octicons-arrow-right-24: 查看课程](courses/index.md)

-   :material-share-variant:{ .lg .middle } __友链__

    ---

    友情链接，欢迎交换

    [:octicons-arrow-right-24: 查看友链](friends/index.md)

-   :material-information-outline:{ .lg .middle } __关于__

    ---

    了解本站与作者信息

    [:octicons-arrow-right-24: 关于本站](about.md)

</div>

---

<div class="footer-note fade-in">
  <p><em>使用 <a href="https://jaywhj.github.io/mkdocs-materialx/">MkDocs MaterialX</a> 构建</em></p>
</div>
