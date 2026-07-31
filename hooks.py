"""MkDocs hooks for PageSpeed-oriented post-processing."""

from __future__ import annotations

import re
import shutil
import subprocess
from pathlib import Path


FONT_FACE_RE = re.compile(r"@font-face\{.*?\}", re.DOTALL)


def _copy_well_known(docs_dir: Path, site_dir: Path) -> None:
    """MkDocs skips dot-directories, so copy /.well-known (agents.json) manually."""
    src = docs_dir / ".well-known"
    if not src.is_dir():
        return
    dest = site_dir / ".well-known"
    dest.mkdir(parents=True, exist_ok=True)
    for path in src.iterdir():
        if path.is_file():
            shutil.copy2(path, dest / path.name)
            print(f"[llm] copied .well-known/{path.name}")


def on_post_build(config, **kwargs) -> None:
    """Copy static LLM extras and slim theme assets after the site is built."""
    site_dir = Path(config["site_dir"])
    _copy_well_known(Path(config["docs_dir"]), site_dir)

    theme_css = site_dir / "css" / "theme.css"
    if not theme_css.exists():
        return

    original = theme_css.read_text(encoding="utf-8")
    stripped = FONT_FACE_RE.sub("", original)
    if stripped != original:
        theme_css.write_text(stripped, encoding="utf-8")
        print(f"[perf] stripped @font-face from theme.css (−{len(original) - len(stripped)} bytes)")

    fonts_dir = site_dir / "css" / "fonts"
    if fonts_dir.exists():
        removed = 0
        for path in fonts_dir.iterdir():
            if path.is_file():
                removed += path.stat().st_size
                path.unlink()
        print(f"[perf] removed theme font files (−{removed} bytes)")

    if shutil.which("npx"):
        try:
            before = theme_css.stat().st_size
            subprocess.run(
                [
                    "npx",
                    "--yes",
                    "purgecss",
                    "--css",
                    str(theme_css),
                    "--content",
                    str(site_dir / "**" / "*.html"),
                    "--output",
                    str(site_dir / "css"),
                    "--safelist",
                    "shift",
                    "wy-table-responsive",
                    "docutils",
                    "footnote",
                    "citation",
                    "field-list",
                ],
                check=True,
                capture_output=True,
                text=True,
            )
            after = theme_css.stat().st_size
            print(f"[perf] purged unused CSS from theme.css ({before} → {after} bytes)")
        except (subprocess.CalledProcessError, OSError) as exc:
            print(f"[perf] purgecss skipped: {exc}")
