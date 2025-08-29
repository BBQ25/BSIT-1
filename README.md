## PDF Generator (PHP + MySQLi + mPDF) integrated with Bootstrap 5 (Attex-like)

### Setup

1) Requirements
- PHP 8.1+ with extensions: mbstring, xml, gd, curl, zip, mysqli
- MySQL 5.7+/MariaDB

2) Install dependencies
```
composer install
```

If you don't have Composer globally, use the local binary: `php composer install` in the project root.

3) Configure environment
Set environment variables or edit `app/config/config.php` defaults:
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`
- Optional: `APP_BASE_URL`, `APP_TZ`

4) Database
```
mysql -u root -p -e "CREATE DATABASE app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p app < database/schema.sql
mysql -u root -p app < database/seed.sql
```

5) Fonts
Poppins TTFs are in `storage/fonts`. mPDF is configured to default to Poppins.

6) Run
```
php -S 0.0.0.0:8080 -t public index.php
```
Then open `http://localhost:8080`.

### Features
- Page size: A4, Letter, Legal, Custom (mm), orientation P/L, margins
- Fonts: Poppins default; add more by placing TTFs in `storage/fonts` and updating `PdfRenderer`
- Header/Footer editors with tokens `{PAGE}`, `{PAGETOTAL}` and template variables
- Body editor with WYSIWYG (TinyMCE), tables with zebra, images (URL or base64)
- Data binding: add bindings as key + prepared SELECT with params JSON; rendered via `{{key.field}}` and sections `{{#key}}...{{/key}}`
- Safe queries (prepared statements, SELECT only)
- Live preview (iframe) and Download
- Export logs recorded to `pdf_export_logs`

### Controllers & Routes
- `GET /` → editor UI
- `POST /templates/preview` → returns PDF bytes for iframe
- `POST /templates/export` → returns PDF download and logs export
- `POST /templates/create` → persists a template (minimal sample; extend for full CRUD/versioning)

### Security
- HTML is sanitized with HTMLPurifier (allowlist tags/styles). Inline JS is blocked
- SQL runs via prepared statements and only allows SELECT queries
- Add auth/role checks in `TemplateController` before write/export actions

### Data Binding Examples
- Class roster:
  - Key: `students`
  - SQL: `SELECT ROW_NUMBER() OVER() AS index, first_name, last_name, student_id FROM students WHERE class_id = ? ORDER BY last_name` 
  - Params: `[123]`
  - Body uses:
```
<table class="zebra"><tbody>{{#students}}<tr><td>{{index}}</td><td>{{first_name}} {{last_name}}</td><td>{{student_id}}</td></tr>{{/students}}</tbody></table>
```

- Per-student transcript:
  - Key: `records`
  - SQL: `SELECT course_name, course_code, credits, grade FROM transcript WHERE student_id = ? ORDER BY course_code`
  - Params: `[456]`
  - Header may use single object binding (e.g., `student`) or fields from another binding

### Attex Integration Notes
- The UI uses Bootstrap 5 cards, tabs, and layout. To integrate inside Attex, drop `views` content into an Attex page and keep the same element IDs. Styles/scripts are lightweight and non-conflicting.

### Extending
- Add full CRUD, versioning, and cloning in `TemplateModel` and `TemplateController`
- Persist bindings in `pdf_bindings` and load per-template
- Add TOC by enabling mPDF TOC features and adding a toggle in the settings
- Add page number position controls by adjusting header/footer HTML wrappers

