from __future__ import annotations

from typing import Any, Dict, Optional

from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel

from .generator import (
    generate_pdf_from_markdown,
    generate_pdf_from_text,
    generate_pdf_from_template,
    PdfOptions,
)


class GenerateRequest(BaseModel):
    content: Optional[str] = None
    content_type: Optional[str] = None  # 'text' | 'markdown'
    template_path: Optional[str] = None
    template_root: Optional[str] = None
    context: Optional[Dict[str, Any]] = None
    title: Optional[str] = None


app = FastAPI(title="PDF Creator API")


@app.post("/generate")
def generate(req: GenerateRequest):
    options = PdfOptions(title=req.title)
    if req.template_path:
        pdf_bytes = generate_pdf_from_template(
            req.template_path,
            req.context or {},
            output_path=None,
            content_type=(req.content_type or "text"),
            template_search_path=(req.template_root or "."),
            options=options,
        )
        return Response(content=pdf_bytes, media_type="application/pdf")

    if not req.content:
        raise HTTPException(status_code=400, detail="Provide 'content' or 'template_path'")

    ctype = (req.content_type or "text").lower()
    if ctype == "markdown":
        pdf_bytes = generate_pdf_from_markdown(req.content, output_path=None, options=options)
    else:
        pdf_bytes = generate_pdf_from_text(req.content, output_path=None, options=options)
    return Response(content=pdf_bytes, media_type="application/pdf")


# To run: uvicorn pdf_creator.server:app --host 0.0.0.0 --port 8000

