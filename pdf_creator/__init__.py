"""
pdf_creator: Simple PDF generation utilities with CLI and FastAPI server.
"""

from .generator import (
    generate_pdf_from_text,
    generate_pdf_from_markdown,
    generate_pdf_from_template,
)

__all__ = [
    "generate_pdf_from_text",
    "generate_pdf_from_markdown",
    "generate_pdf_from_template",
]

