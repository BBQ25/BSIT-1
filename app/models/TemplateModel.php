<?php
declare(strict_types=1);

namespace App\Models;

use mysqli;

class TemplateModel
{
	private mysqli $db;

	public function __construct(mysqli $db)
	{
		$this->db = $db;
	}

	public function create(array $data): int
	{
		$sql = 'INSERT INTO pdf_templates (name, description, header_html, body_html, footer_html, page_size, orientation, margin_top, margin_right, margin_bottom, margin_left, font_family, created_by, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,NOW(),NOW())';
		$stmt = $this->db->prepare($sql);
		$stmt->bind_param(
			'sssssssiiiiiis',
			$data['name'],
			$data['description'],
			$data['header_html'],
			$data['body_html'],
			$data['footer_html'],
			$data['page_size'],
			$data['orientation'],
			$data['margin_top'],
			$data['margin_right'],
			$data['margin_bottom'],
			$data['margin_left'],
			$data['font_family'],
			$data['created_by']
		);
		$stmt->execute();
		return $stmt->insert_id;
	}

	public function findById(int $id): ?array
	{
		$stmt = $this->db->prepare('SELECT * FROM pdf_templates WHERE id = ?');
		$stmt->bind_param('i', $id);
		$stmt->execute();
		$res = $stmt->get_result()->fetch_assoc();
		return $res ?: null;
	}

	public function listAll(): array
	{
		$res = $this->db->query('SELECT id, name, description, updated_at FROM pdf_templates ORDER BY updated_at DESC');
		return $res ? $res->fetch_all(MYSQLI_ASSOC) : [];
	}
}

