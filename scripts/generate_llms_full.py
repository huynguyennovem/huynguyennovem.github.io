#!/usr/bin/env python3
"""Generate docs/llms-full.txt from site markdown sources.

Run from repo root:
  python3 scripts/generate_llms_full.py
"""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
OUT = DOCS / "llms-full.txt"
SITE_URL = "https://huynq.dev"

# Order matters: identity first, then curated content.
SECTIONS: list[tuple[str, str, Path]] = [
    ("About", f"{SITE_URL}/about/", DOCS / "about.md"),
    ("Projects and packages", f"{SITE_URL}/projects_packages/", DOCS / "projects_packages.md"),
    ("Contributions", f"{SITE_URL}/contributions/", DOCS / "contributions.md"),
    ("Community activities", f"{SITE_URL}/community_activities/", DOCS / "community_activities.md"),
    ("Talks index", f"{SITE_URL}/talks/", DOCS / "talks.md"),
]

def _post_sort_key(path: Path) -> str:
    text = path.read_text(encoding="utf-8")
    match = re.search(r"^datePublished:\s*(.+)$", text, re.MULTILINE)
    return match.group(1).strip() if match else path.name


TALK_FILES = sorted((DOCS / "talks").glob("*.md"))
POST_FILES = sorted(
    (DOCS / "posts").glob("*.md"),
    key=_post_sort_key,
    reverse=True,
)


def strip_frontmatter(text: str) -> str:
    if text.startswith("---"):
        end = text.find("\n---", 3)
        if end != -1:
            return text[end + 4 :].lstrip("\n")
    return text


def strip_html(text: str) -> str:
    text = re.sub(r"<div\b[^>]*>.*?</div>", "", text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r"<[^>]+>", "", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def clean(text: str) -> str:
    return strip_html(strip_frontmatter(text))


def page_url_from_docs_path(path: Path) -> str:
    rel = path.relative_to(DOCS).with_suffix("").as_posix()
    if rel == "index":
        return f"{SITE_URL}/"
    return f"{SITE_URL}/{rel}/"


def render_section(title: str, url: str, path: Path) -> str:
    body = clean(path.read_text(encoding="utf-8"))
    return f"## {title}\n\nSource: {url}\n\n{body}\n"


def main() -> None:
    sections: list[str] = []

    for title, url, path in SECTIONS:
        sections.append(render_section(title, url, path))

    for path in TALK_FILES:
        title = path.stem.replace("-", " ").title()
        heading_match = re.search(
            r"^#\s+(.+)$",
            clean(path.read_text(encoding="utf-8")),
            re.MULTILINE,
        )
        if heading_match:
            title = heading_match.group(1).strip()
        sections.append(
            render_section(f"Talk: {title}", page_url_from_docs_path(path), path)
        )

    for path in POST_FILES:
        raw = path.read_text(encoding="utf-8")
        title_match = re.search(r'^title:\s*"(.+)"\s*$', raw, re.MULTILINE)
        title = title_match.group(1) if title_match else path.stem
        sections.append(
            render_section(f"Post: {title}", page_url_from_docs_path(path), path)
        )

    header = (
        "# Huy Nguyen — Full Context\n\n"
        "> Expanded LLM context for https://huynq.dev. "
        "Includes about, projects, contributions, talks, and all blog posts.\n\n"
        "Generated from the site markdown sources. "
        "For a curated index, see https://huynq.dev/llms.txt\n"
    )
    OUT.write_text(
        header + "\n---\n\n" + "\n---\n\n".join(sections).rstrip() + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
