from __future__ import annotations

import argparse
import json
import os
import sys
from typing import Any, Dict, Optional

from .generator import (
    generate_pdf_from_text,
    generate_pdf_from_markdown,
    generate_pdf_from_template,
    PdfOptions,
)


def _infer_content_type(path: str) -> str:
    ext = os.path.splitext(path)[1].lower()
    if ext in {".md", ".markdown"}:
        return "markdown"
    return "text"


def main(argv: Optional[list[str]] = None) -> int:
    parser = argparse.ArgumentParser(description="Simple PDF generator")
    group = parser.add_mutually_exclusive_group(required=False)
    group.add_argument("--text", help="Raw text content to render")
    group.add_argument("--input", help="Path to input file (.txt or .md)")
    parser.add_argument("--template", help="Path to Jinja2 template (relative to --template-root)")
    parser.add_argument("--template-root", default=".", help="Base directory for templates")
    parser.add_argument("--data", help="Path to JSON file with template context")
    parser.add_argument("--content-type", choices=["text", "markdown", "auto"], default="auto")
    parser.add_argument("--title", help="PDF document title")
    parser.add_argument("--output", required=True, help="Output PDF path")

    args = parser.parse_args(argv)

    options = PdfOptions(title=args.title)

    if args.template:
        context: Dict[str, Any] = {}
        if args.data:
            with open(args.data, "r", encoding="utf-8") as f:
                context = json.load(f)
        ctype = args.content_type if args.content_type != "auto" else "text"
        generate_pdf_from_template(
            args.template,
            context,
            output_path=args.output,
            content_type=ctype,
            template_search_path=args.template_root,
            options=options,
        )
        print(f"Wrote PDF to {args.output}")
        return 0

    if args.text is None and args.input is None:
        parser.error("Provide --text, --input, or --template")

    if args.text is not None:
        ctype = args.content_type if args.content_type != "auto" else "text"
        if ctype == "markdown":
            generate_pdf_from_markdown(args.text, output_path=args.output, options=options)
        else:
            generate_pdf_from_text(args.text, output_path=args.output, options=options)
        print(f"Wrote PDF to {args.output}")
        return 0

    if args.input is not None:
        with open(args.input, "r", encoding="utf-8") as f:
            content = f.read()
        ctype = (
            args.content_type
            if args.content_type != "auto"
            else _infer_content_type(args.input)
        )
        if ctype == "markdown":
            generate_pdf_from_markdown(content, output_path=args.output, options=options)
        else:
            generate_pdf_from_text(content, output_path=args.output, options=options)
        print(f"Wrote PDF to {args.output}")
        return 0

    return 1


if __name__ == "__main__":
    raise SystemExit(main())

