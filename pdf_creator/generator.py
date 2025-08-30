from __future__ import annotations

import io
import re
import html
from dataclasses import dataclass
from typing import Any, Dict, List, Optional, Sequence

from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Preformatted,
    ListFlowable,
    ListItem,
)
from reportlab.lib import enums
from jinja2 import Environment, FileSystemLoader


@dataclass
class PdfOptions:
    pagesize: tuple = LETTER
    left_margin: float = 1.0 * inch
    right_margin: float = 1.0 * inch
    top_margin: float = 1.0 * inch
    bottom_margin: float = 1.0 * inch
    title: Optional[str] = None


def _build_styles() -> Dict[str, ParagraphStyle]:
    styles = getSampleStyleSheet()
    base = styles["BodyText"]

    styles.add(
        ParagraphStyle(
            name="CodeBlock",
            parent=base,
            fontName="Courier",
            fontSize=9,
            leading=11,
        )
    )
    styles.add(
        ParagraphStyle(
            name="H1",
            parent=styles["Heading1"],
            spaceBefore=12,
            spaceAfter=6,
            alignment=enums.TA_LEFT,
        )
    )
    styles.add(
        ParagraphStyle(
            name="H2",
            parent=styles["Heading2"],
            spaceBefore=10,
            spaceAfter=6,
            alignment=enums.TA_LEFT,
        )
    )
    styles.add(
        ParagraphStyle(
            name="H3",
            parent=styles["Heading3"],
            spaceBefore=8,
            spaceAfter=4,
            alignment=enums.TA_LEFT,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Paragraph",
            parent=base,
            fontSize=11,
            leading=14,
            spaceAfter=6,
        )
    )
    return styles


def _inline_format(text: str) -> str:
    # Escape HTML, then apply simple markdown-like inline formatting
    escaped = html.escape(text)
    # Bold **text**
    escaped = re.sub(r"\*\*(.+?)\*\*", r"<b>\\1</b>", escaped)
    # Italic *text*
    escaped = re.sub(r"(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)", r"<i>\\1</i>", escaped)
    # Inline code `code`
    escaped = re.sub(r"`([^`]+)`", r"<font face='Courier'>\\1</font>", escaped)
    return escaped


def _markdown_to_flowables(markdown_text: str, styles: Dict[str, ParagraphStyle]) -> List[Any]:
    flowables: List[Any] = []
    lines = markdown_text.splitlines()
    paragraph_buffer: List[str] = []
    list_buffer: List[str] = []
    list_type: Optional[str] = None  # 'bullet' or 'number'
    in_code_block = False
    code_buffer: List[str] = []

    def flush_paragraph():
        nonlocal paragraph_buffer
        if paragraph_buffer:
            text = " ".join(line.strip() for line in paragraph_buffer).strip()
            if text:
                flowables.append(Paragraph(_inline_format(text), styles["Paragraph"]))
                flowables.append(Spacer(1, 4))
            paragraph_buffer = []

    def flush_list():
        nonlocal list_buffer, list_type
        if list_buffer:
            items = [ListItem(Paragraph(_inline_format(it), styles["Paragraph"])) for it in list_buffer]
            bullet = "1" if list_type == "number" else "bullet"
            flowables.append(ListFlowable(items, bulletType=bullet, start='1'))
            flowables.append(Spacer(1, 4))
            list_buffer = []
            list_type = None

    def flush_code():
        nonlocal code_buffer
        if code_buffer:
            code_text = "\n".join(code_buffer)
            flowables.append(Preformatted(code_text, styles["CodeBlock"]))
            flowables.append(Spacer(1, 4))
            code_buffer = []

    for raw_line in lines:
        line = raw_line.rstrip("\n")

        # Fenced code block
        if line.strip().startswith("```"):
            if in_code_block:
                # closing
                in_code_block = False
                flush_code()
            else:
                # opening
                flush_paragraph()
                flush_list()
                in_code_block = True
                code_buffer = []
            continue

        if in_code_block:
            code_buffer.append(raw_line)
            continue

        # Blank line => paragraph/list break
        if not line.strip():
            flush_paragraph()
            flush_list()
            continue

        # Headings
        m = re.match(r"^(#{1,6})\s+(.*)$", line)
        if m:
            flush_paragraph()
            flush_list()
            level = len(m.group(1))
            content = m.group(2).strip()
            style_name = "H1" if level == 1 else "H2" if level == 2 else "H3"
            flowables.append(Paragraph(_inline_format(content), styles[style_name]))
            flowables.append(Spacer(1, 6))
            continue

        # Lists
        if re.match(r"^[-*+]\s+", line):
            item = re.sub(r"^[-*+]\s+", "", line).strip()
            if list_type not in (None, "bullet"):
                flush_list()
            list_type = "bullet"
            list_buffer.append(item)
            continue
        if re.match(r"^\d+[\.)]\s+", line):
            item = re.sub(r"^\d+[\.)]\s+", "", line).strip()
            if list_type not in (None, "number"):
                flush_list()
            list_type = "number"
            list_buffer.append(item)
            continue

        # Otherwise, part of a paragraph
        paragraph_buffer.append(line)

    # Final flush
    flush_code()
    flush_paragraph()
    flush_list()

    return flowables


def _build_pdf(flowables: Sequence[Any], options: PdfOptions) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=options.pagesize,
        leftMargin=options.left_margin,
        rightMargin=options.right_margin,
        topMargin=options.top_margin,
        bottomMargin=options.bottom_margin,
        title=options.title or "",
    )

    def _on_first_page(canvas, doc):  # noqa: N803
        if options.title:
            canvas.setTitle(options.title)

    doc.build(list(flowables), onFirstPage=_on_first_page)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes


def _write_if_path(pdf_bytes: bytes, output_path: Optional[str]) -> bytes:
    if output_path:
        with open(output_path, "wb") as f:
            f.write(pdf_bytes)
    return pdf_bytes


def generate_pdf_from_text(
    text: str,
    output_path: Optional[str] = None,
    *,
    options: Optional[PdfOptions] = None,
) -> bytes:
    styles = _build_styles()
    options = options or PdfOptions()
    # Prefer normal paragraph rendering but handle multiline text as preformatted
    flowables: List[Any] = []
    if "\n" in text:
        flowables.append(Preformatted(text, styles["CodeBlock"]))
    else:
        flowables.append(Paragraph(_inline_format(text), styles["Paragraph"]))
    flowables.append(Spacer(1, 8))
    pdf_bytes = _build_pdf(flowables, options)
    return _write_if_path(pdf_bytes, output_path)


def generate_pdf_from_markdown(
    markdown_text: str,
    output_path: Optional[str] = None,
    *,
    options: Optional[PdfOptions] = None,
) -> bytes:
    styles = _build_styles()
    options = options or PdfOptions()
    flowables = _markdown_to_flowables(markdown_text, styles)
    pdf_bytes = _build_pdf(flowables, options)
    return _write_if_path(pdf_bytes, output_path)


def generate_pdf_from_template(
    template_path: str,
    context: Dict[str, Any],
    output_path: Optional[str] = None,
    *,
    content_type: str = "text",  # 'text' or 'markdown'
    template_search_path: Optional[str] = None,
    options: Optional[PdfOptions] = None,
) -> bytes:
    env = Environment(loader=FileSystemLoader(template_search_path or "."))
    template = env.get_template(template_path)
    rendered: str = template.render(**(context or {}))
    if content_type.lower() == "markdown":
        return generate_pdf_from_markdown(rendered, output_path, options=options)
    else:
        return generate_pdf_from_text(rendered, output_path, options=options)

