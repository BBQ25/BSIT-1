CREATE TABLE IF NOT EXISTS pdf_templates (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	description TEXT NULL,
	header_html MEDIUMTEXT NULL,
	body_html MEDIUMTEXT NULL,
	footer_html MEDIUMTEXT NULL,
	page_size VARCHAR(32) NOT NULL DEFAULT 'A4',
	orientation VARCHAR(16) NOT NULL DEFAULT 'P',
	margin_top INT NOT NULL DEFAULT 20,
	margin_right INT NOT NULL DEFAULT 15,
	margin_bottom INT NOT NULL DEFAULT 20,
	margin_left INT NOT NULL DEFAULT 15,
	font_family VARCHAR(64) NOT NULL DEFAULT 'Poppins',
	created_by INT NULL,
	created_at DATETIME NOT NULL,
	updated_at DATETIME NOT NULL,
	INDEX (updated_at)
);

CREATE TABLE IF NOT EXISTS pdf_bindings (
	id INT AUTO_INCREMENT PRIMARY KEY,
	template_id INT NOT NULL,
	binding_key VARCHAR(255) NOT NULL,
	sql_query MEDIUMTEXT NOT NULL,
	created_at DATETIME NOT NULL,
	FOREIGN KEY (template_id) REFERENCES pdf_templates(id) ON DELETE CASCADE,
	UNIQUE KEY unique_template_binding (template_id, binding_key)
);

CREATE TABLE IF NOT EXISTS pdf_export_logs (
	id INT AUTO_INCREMENT PRIMARY KEY,
	template_id INT NOT NULL,
	user_id INT NULL,
	filename VARCHAR(255) NOT NULL,
	created_at DATETIME NOT NULL,
	FOREIGN KEY (template_id) REFERENCES pdf_templates(id) ON DELETE SET NULL
);

