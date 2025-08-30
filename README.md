# PDF Creator Generator

Lightweight PDF generator with CLI and FastAPI API, powered by ReportLab. Supports plain text, a minimal subset of Markdown (headings, lists, bold/italic, code), and Jinja2 templates that render to text or markdown.

## Install dependencies

```bash
pip install -r requirements.txt
```

## CLI usage

```bash
python -m pdf_creator.cli --text "Hello **world**" --content-type markdown --output hello.pdf

python -m pdf_creator.cli --input examples/sample.md --output sample_md.pdf

python -m pdf_creator.cli --template templates/invoice.md.j2 --template-root . \
  --data examples/invoice_data.json --content-type markdown --output invoice.pdf
```

## API usage

Start server:

```bash
uvicorn pdf_creator.server:app --host 0.0.0.0 --port 8000
```

Generate via HTTP:

```bash
curl -X POST http://localhost:8000/generate \
  -H 'Content-Type: application/json' \
  -d '{"content": "# Title\\nSome *text*", "content_type": "markdown", "title": "Demo"}' \
  --output demo.pdf
```

## Minimal markdown supported

- Headings: `#`, `##`, `###`
- Bullets: `- item`, `* item`, `+ item`
- Numbered: `1. item`
- Inline: `**bold**`, `*italic*`, `` `code` ``
- Fenced code blocks: triple backticks

## Examples

See `examples/` and `templates/` directories.

