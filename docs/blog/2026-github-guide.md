---
title: GitHub 使用教学：从零到协作
---

# GitHub 使用教学：从零到协作

这篇文章会用比较「实战」的方式，带你从 **零基础安装 Git**，到 **在 GitHub 上托管代码、协作开发**，并结合你当前的博客仓库举例，适合作为今后课程/项目的参考文档。

---

## 1. 准备工作：安装 Git 与创建账号

### 1.1 安装 Git

- **Linux / WSL**：

```bash
sudo apt update
sudo apt install git
```

安装后检查版本：

```bash
git --version
```

### 1.2 配置用户名和邮箱

Git 会把你的提交记录和用户名、邮箱绑定，这两项会显示在 GitHub 上：

```bash
git config --global user.name "wh1cy"
git config --global user.email "you@example.com"
```

> 建议使用和 GitHub 账号绑定的邮箱，这样贡献会自动计入你的贡献图。

### 1.3 注册 / 登录 GitHub

1. 打开 `https://github.com` 注册账号  
2. 设置一个你喜欢的 **用户名**（后面会出现在 `https://用户名.github.io` 等 URL 中）  
3. 打开邮件完成验证

---

## 2. 基本概念快速扫盲

在实际操作之前，先用几句话过一遍 Git / GitHub 的核心概念：

- **仓库（Repository）**：一个项目的代码库（例如：`wh1cy/wh1cy.github.io`）  
- **本地仓库**：在你电脑上的副本  
- **远程仓库**：在 GitHub 上对应的仓库  
- **提交（Commit）**：一次保存代码快照，附带说明  
- **分支（Branch）**：一条开发线，默认是 `main` 或 `master`  
- **Pull / Push**：从远程拉取 / 向远程推送代码  

大部分日常操作都围绕这几个词展开。

---

## 3. 把本地项目关联到 GitHub

下面以你的博客项目为例，演示如何把一个已有项目和 GitHub 仓库关联在一起（你现在已经完成了这一步，这里可以作为说明文档）。

### 3.1 在 GitHub 创建远程仓库

1. 登录 GitHub，右上角点击 **「+」 → New repository**  
2. 填写：
   - **Repository name**：例如 `wh1cy.github.io`  
   - 其他保持默认即可  
3. 点击 **Create repository** 创建仓库

### 3.2 在本地初始化 Git 仓库（已有仓库可跳过）

在项目根目录（例如 `/home/whicy/github-pages`）执行：

```bash
git init
git add .
git commit -m "初始化博客项目"
```

### 3.3 关联远程仓库并推送

```bash
git remote add origin git@github.com:wh1cy/wh1cy.github.io.git
# 或者使用 HTTPS：
# git remote add origin https://github.com/wh1cy/wh1cy.github.io.git

git branch -M main
git push -u origin main
```

执行成功后，刷新 GitHub 仓库页面，就能看到本地代码了。

---

## 4. 日常工作流：改动 → 提交 → 推送

Git 的日常节奏可以概括为：**查看状态 → 选择要提交的文件 → 写提交说明 → 推送到远程**。

### 4.1 查看当前状态

```bash
git status
```

你会看到：

- 修改但未暂存的文件（modified）  
- 未加入版本控制的新文件（untracked）  

### 4.2 将改动加入暂存区

```bash
git add docs/blog/2026-github-guide.md
# 或者一次性添加所有改动：
# git add .
```

### 4.3 提交改动

```bash
git commit -m "新增 GitHub 使用教学博客"
```

提交信息建议使用简短的动词句，说明「做了什么、为何修改」。

### 4.4 推送到远程

```bash
git push
```

第一次推送新分支时可能需要：

```bash
git push -u origin main
```

之后只需 `git push` 即可。

---

## 5. 在新分支上开发再合并

当你要做比较大的改动时，建议使用 **分支**，避免直接在 `main` 上动手。

### 5.1 创建并切换到新分支

```bash
git checkout -b feature/github-guide
```

### 5.2 在新分支上进行改动

像平常一样编辑文件、提交：

```bash
git add docs/blog/2026-github-guide.md
git commit -m "完成 GitHub 使用教学初稿"
git push -u origin feature/github-guide
```

### 5.3 在 GitHub 上发起 Pull Request

1. 打开仓库页面，会提示你为 `feature/github-guide` 创建 Pull Request  
2. 编写标题和说明（描述改动内容与动机）  
3. 提交 PR 后，你可以在浏览器中查看差异、评论、再做调整  

确认无误后，在 GitHub 上将 PR 合并到 `main`，本地再同步：

```bash
git checkout main
git pull
```

---

## 6. 处理常见的合并冲突

多人协作或多设备开发时，难免遇到合并冲突。典型情况下：

```bash
git pull
# 或 git merge 某个分支
```

Git 提示有冲突，并在文件中插入类似标记：

```text
<<<<<<< HEAD
你本地的版本
=======
远程仓库的版本
>>>>>>> origin/main
```

解决方式：

1. 打开冲突文件，根据需要 **手工合并内容**，删掉这些标记行  
2. 再次加入暂存区并提交：

```bash
git add 冲突文件
git commit -m "解决合并冲突"
```

---

## 7. 使用 GitHub 管理 Issue 与任务

除了托管代码，GitHub 还提供了简单的「任务管理」能力：

- **Issues**：可以用来记录 bug、想法、TODO 等  
- **Labels**：给 Issue 打标签，比如 `bug`、`enhancement`、`documentation` 等  
- **Milestones / Projects**：适合管理一段时间内要完成的一组任务

一个典型流程可以是：

1. 为「写 GitHub 使用教学博客」开一个 Issue  
2. 在提交信息或 Pull Request 描述中写上 `Closes #数字`  
3. 当 PR 合并时，对应 Issue 会自动关闭，方便追踪

---

## 8. GitHub 与 GitHub Pages（你的博客就是例子）

你现在使用 MkDocs 生成静态网站，并托管在 GitHub Pages 上。典型流程：

1. 本地编辑 Markdown（例如 `docs/blog/2026-github-guide.md`）  
2. 运行：

```bash
mkdocs serve    # 本地预览
mkdocs build    # 生成静态文件
```

3. 使用：

```bash
git add .
git commit -m "新增 GitHub 使用教学博客"
git push
```

4. 配合 `mkdocs gh-deploy` 或 GitHub Actions，将构建结果部署到 Pages：

```bash
mkdocs gh-deploy
```

这样你就把 **内容写作（Markdown）**、**版本管理（Git）** 和 **托管发布（GitHub / Pages）** 有机地结合在一起了。

---

## 9. 常用 Git 命令速查表

```bash
# 查看当前状态
git status

# 查看提交历史（简要）
git log --oneline --graph --all

# 查看某个文件最近的改动
git log -p -- docs/blog/2026-github-guide.md

# 创建并切换到新分支
git checkout -b feature/xxx

# 切回已有分支
git checkout main

# 从远程获取最新提交并合并
git pull

# 只获取远程更新，不自动合并
git fetch

# 查看本地和远程分支
git branch        # 本地
git branch -r     # 远程
git branch -a     # 所有
```

---

## 总结

这篇文章从 **安装 Git、关联 GitHub 仓库**，到 **日常提交、分支协作、解决冲突**，给出了一个完整的 GitHub 使用路径。  

你可以把它当作：

- 之后课程实验的「Git/GitHub 入门参考」  
- 新同学参与项目时的「协作说明文档」  
- 自己在新机器上重新配置环境时的快速备忘录  

建议结合实际项目多练几次，把 `git status` → `git add` → `git commit` → `git push` 这一工作流变成肌肉记忆，GitHub 就会成为你日常开发的好帮手，而不是负担。

