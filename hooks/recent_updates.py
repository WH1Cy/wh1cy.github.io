from __future__ import annotations

from email.utils import format_datetime
import html
import subprocess
from dataclasses import dataclass
from datetime import date, datetime
from pathlib import Path
import re
from typing import List


RECENT_START = "<!-- RECENT_UPDATES_START -->"
RECENT_END = "<!-- RECENT_UPDATES_END -->"
CTA_START = "<!-- HOMEPAGE_CTA_START -->"
CTA_END = "<!-- HOMEPAGE_CTA_END -->"
TITLE_RE = re.compile(r"^title:\s*(.+?)\s*$", re.MULTILINE)
DATE_RE = re.compile(r"^date:\s*(\d{4}-\d{2}-\d{2})\s*$", re.MULTILINE)


@dataclass
class BlogPost:
    title: str
    source_path: Path
    rel_path: str
    updated: date


def _read_front_matter(md_file: Path) -> str:
    content = md_file.read_text(encoding="utf-8")
    if not content.startswith("---"):
        return ""

    lines = content.splitlines()
    if len(lines) < 3:
        return ""

    end_idx = None
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            end_idx = i
            break

    if end_idx is None:
        return ""

    return "\n".join(lines[1:end_idx])


def _extract_title(front_matter: str, md_file: Path) -> str:
    match = TITLE_RE.search(front_matter)
    if not match:
        return md_file.stem
    return match.group(1).strip().strip("'\"")


def _extract_date(front_matter: str) -> date | None:
    match = DATE_RE.search(front_matter)
    if not match:
        return None

    try:
        return datetime.strptime(match.group(1), "%Y-%m-%d").date()
    except ValueError:
        return None


def _git_last_commit_date(repo_root: Path, rel_md_path: str) -> date | None:
    try:
        result = subprocess.run(
            ["git", "log", "-1", "--format=%cs", "--", rel_md_path],
            cwd=repo_root,
            check=False,
            capture_output=True,
            text=True,
        )
    except OSError:
        return None

    raw = result.stdout.strip()
    if result.returncode != 0 or not raw:
        return None

    try:
        return datetime.strptime(raw, "%Y-%m-%d").date()
    except ValueError:
        return None


def _discover_posts(config) -> List[BlogPost]:
    docs_dir = Path(config["docs_dir"])
    repo_root = docs_dir.parent
    blog_dir = docs_dir / "blog"
    if not blog_dir.exists():
        return []

    posts: List[BlogPost] = []
    for md_file in blog_dir.glob("*.md"):
        if md_file.name == "index.md":
            continue

        rel_from_docs = md_file.relative_to(docs_dir).as_posix()
        front_matter = _read_front_matter(md_file)
        title = _extract_title(front_matter, md_file)
        updated = _extract_date(front_matter)
        if updated is None:
            updated = _git_last_commit_date(repo_root, f"docs/{rel_from_docs}")
        if updated is None:
            updated = date.fromtimestamp(md_file.stat().st_mtime)

        posts.append(
            BlogPost(
                title=title,
                source_path=md_file,
                rel_path=rel_from_docs,
                updated=updated,
            )
        )

    posts.sort(key=lambda p: (p.updated, p.source_path.name), reverse=True)
    return posts


def _build_recent_cards(posts: List[BlogPost], limit: int = 3) -> str:
    top_posts = posts[:limit]
    if not top_posts:
        return (
            '<div class="grid cards" markdown>\n\n'
            '-   :material-information-outline:{ .lg .middle } __暂无更新__\n\n'
            "    ---\n\n"
            "    暂时还没有可展示的文章。\n\n"
            "</div>"
        )

    lines = ['<div class="grid cards" markdown>', ""]
    for post in top_posts:
        date_label = post.updated.strftime("%Y-%m-%d")
        lines.extend(
            [
                f'-   :material-book-open-variant:{{ .lg .middle }} __{post.title}__',
                "",
                "    ---",
                "",
                f"    最近更新：`{date_label}`",
                "",
                f"    [:octicons-arrow-right-24: 阅读全文]({post.rel_path})",
                "",
            ]
        )
    lines.append("</div>")
    return "\n".join(lines)


def _replace_between(markdown: str, start: str, end: str, content: str) -> str:
    if start not in markdown or end not in markdown:
        return markdown
    pattern = re.compile(f"{re.escape(start)}.*?{re.escape(end)}", re.DOTALL)
    return pattern.sub(f"{start}\n{content}\n{end}", markdown, count=1)


def _discover_course_count(config) -> int:
    docs_dir = Path(config["docs_dir"])
    courses_dir = docs_dir / "courses"
    if not courses_dir.exists():
        return 0

    count = 0
    for subdir in courses_dir.iterdir():
        if not subdir.is_dir():
            continue
        if (subdir / "index.md").exists():
            count += 1
    return count


def _build_cta_cards(config, has_email: bool, post_count: int, course_count: int, last_updated: str) -> str:
    repo_url = config.get("repo_url", "https://github.com")
    site_url = config.get("site_url", "").rstrip("/")
    rss_url = f"{site_url}/rss.xml" if site_url else "/rss.xml"
    email = config.get("extra", {}).get("contact_email", "").strip()

    lines = ['<div class="grid cards" markdown>', ""]
    lines.extend(
        [
            '-   :fontawesome-brands-github:{ .lg .middle } __GitHub__',
            "",
            "    ---",
            "",
            "    欢迎查看仓库、提交 Issue 或讨论想法。",
            "",
            f'    [:octicons-arrow-right-24: 访问仓库]({repo_url}){{ target="_blank" rel="noopener" }}',
            "",
            '-   :material-rss:{ .lg .middle } __RSS 订阅__',
            "",
            "    ---",
            "",
            "    通过 RSS 持续获取博客更新，不错过新内容。",
            "",
            f'    [:octicons-arrow-right-24: 订阅 RSS]({rss_url}){{ target="_blank" rel="noopener" }}',
            "",
        ]
    )

    if has_email and email:
        lines.extend(
            [
                '-   :material-email-outline:{ .lg .middle } __邮箱联系__',
                "",
                "    ---",
                "",
                "    欢迎来信交流学习与技术问题。",
                "",
                f"    [:octicons-arrow-right-24: 发送邮件](mailto:{email})",
                "",
            ]
        )
    else:
        lines.extend(
            [
                '-   :material-message-outline:{ .lg .middle } __交流反馈__',
                "",
                "    ---",
                "",
                "    当前未公开邮箱，欢迎通过 GitHub Issue 与我交流。",
                "",
                f'    [:octicons-arrow-right-24: 提交 Issue]({repo_url}/issues){{ target="_blank" rel="noopener" }}',
                "",
            ]
        )

    lines.extend(
        [
            '-   :material-chart-line:{ .lg .middle } __站点活跃度__',
            "",
            "    ---",
            "",
            f"    - 总文章数：`{post_count}`",
            f"    - 课程数：`{course_count}`",
            f"    - 最后更新：`{last_updated}`",
            "",
        ]
    )

    lines.append("</div>")
    return "\n".join(lines)


def _build_rss_xml(posts: List[BlogPost], config) -> str:
    site_url = config.get("site_url", "").rstrip("/")
    site_name = config.get("site_name", "My Site")
    site_description = config.get("site_description", "")
    feed_link = f"{site_url}/rss.xml" if site_url else "/rss.xml"

    pub_date = datetime.utcnow()
    items: List[str] = []
    for post in posts[:20]:
        link = f"{site_url}/{post.rel_path.replace('.md', '/')}" if site_url else f"/{post.rel_path.replace('.md', '/')}"
        item_pub = datetime.combine(post.updated, datetime.min.time())
        items.append(
            "\n".join(
                [
                    "    <item>",
                    f"      <title>{html.escape(post.title)}</title>",
                    f"      <link>{html.escape(link)}</link>",
                    f"      <guid>{html.escape(link)}</guid>",
                    f"      <pubDate>{format_datetime(item_pub)}</pubDate>",
                    "      <description>博客文章更新</description>",
                    "    </item>",
                ]
            )
        )

    return "\n".join(
        [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<rss version="2.0">',
            "  <channel>",
            f"    <title>{html.escape(site_name)}</title>",
            f"    <link>{html.escape(site_url or '/')}</link>",
            f"    <description>{html.escape(site_description)}</description>",
            "    <language>zh-cn</language>",
            f"    <lastBuildDate>{format_datetime(pub_date)}</lastBuildDate>",
            f"    <atom:link href=\"{html.escape(feed_link)}\" rel=\"self\" type=\"application/rss+xml\" xmlns:atom=\"http://www.w3.org/2005/Atom\"/>",
            *items,
            "  </channel>",
            "</rss>",
            "",
        ]
    )


def on_page_markdown(markdown, page, config, files):
    if page.file.src_uri != "index.md":
        return markdown

    posts = _discover_posts(config)
    course_count = _discover_course_count(config)
    post_count = len(posts)
    last_updated = posts[0].updated.strftime("%Y-%m-%d") if posts else "暂无"

    generated = _build_recent_cards(posts, limit=3)
    has_email = bool(config.get("extra", {}).get("contact_email", "").strip())
    cta = _build_cta_cards(
        config,
        has_email=has_email,
        post_count=post_count,
        course_count=course_count,
        last_updated=last_updated,
    )

    markdown = _replace_between(markdown, RECENT_START, RECENT_END, generated)
    markdown = _replace_between(markdown, CTA_START, CTA_END, cta)
    return markdown


def on_post_build(config):
    posts = _discover_posts(config)
    rss_xml = _build_rss_xml(posts, config)
    site_dir = Path(config["site_dir"])
    site_dir.mkdir(parents=True, exist_ok=True)
    (site_dir / "rss.xml").write_text(rss_xml, encoding="utf-8")
