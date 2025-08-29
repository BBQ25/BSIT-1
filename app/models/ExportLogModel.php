<?php
declare(strict_types=1);

namespace App\Models;

use mysqli;

class ExportLogModel
{
	private mysqli $db;

	public function __construct(mysqli $db)
	{
		$this->db = $db;
	}

	public function log(int $templateId, ?int $userId, string $filename): void
	{
		$stmt = $this->db->prepare('INSERT INTO pdf_export_logs (template_id, user_id, filename, created_at) VALUES (?, ?, ?, NOW())');
		if ($userId === null) {
			$null = null;
			$stmt->bind_param('iis', $templateId, $null, $filename);
		} else {
			$stmt->bind_param('iis', $templateId, $userId, $filename);
		}
		$stmt->execute();
	}
}

