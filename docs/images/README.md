# 图片目录

将你的图片放在这个目录中，然后在 Markdown 文件中使用相对路径引用。

## 使用示例

### 在首页中使用图片

```markdown
![描述文字](images/your-image.jpg)
```

### 在关于我区域添加头像

1. 将头像图片（建议 200x200px 或更大）放在 `images/` 目录
2. 在 `index.md` 的关于我区域，将图片占位符替换为：

```html
<div class="about-image">
  <img src="images/your-avatar.jpg" alt="头像" class="avatar-image" />
</div>
```

### 图片建议

- **头像**: 200x200px 或更大，正方形，PNG 或 JPG
- **背景图**: 1920x1080px 或更大，JPG 格式
- **文章配图**: 建议宽度 800-1200px，JPG 或 PNG

## 优化建议

- 使用图片压缩工具（如 TinyPNG）减小文件大小
- 为图片添加有意义的 alt 文本以提高可访问性
- 考虑使用 WebP 格式以获得更好的压缩率
