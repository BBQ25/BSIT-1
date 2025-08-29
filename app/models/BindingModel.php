<?php
declare(strict_types=1);

namespace App\Models;

use mysqli;

class BindingModel
{
	private mysqli $db;

	public function __construct(mysqli $db)
	{
		$this->db = $db;
	}

	public function create(int $templateId, string $bindingKey, string $sqlQuery): int
	{
		$stmt = $this->db->prepare('INSERT INTO pdf_bindings (template_id, binding_key, sql_query, created_at) VALUES (?, ?, ?, NOW())');
		$stmt->bind_param('iss', $templateId, $bindingKey, $sqlQuery);
		$stmt->execute();
		return $stmt->insert_id;
	}

	public function findByTemplate(int $templateId): array
	{
		$stmt = $this->db->prepare('SELECT id, binding_key, sql_query FROM pdf_bindings WHERE template_id = ?');
		$stmt->bind_param('i', $templateId);
		$stmt->execute();
		$res = $stmt->get_result();
		return $res ? $res->fetch_all(MYSQLI_ASSOC) : [];
	}
}

