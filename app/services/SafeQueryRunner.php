<?php
declare(strict_types=1);

namespace App\Services;

use mysqli;

class SafeQueryRunner
{
	private mysqli $db;

	public function __construct(mysqli $db)
	{
		$this->db = $db;
	}

	public function runSelect(string $sql, array $params = []): array
	{
		$sqlTrim = ltrim($sql);
		if (!preg_match('/^(select)\s/i', $sqlTrim)) {
			throw new \InvalidArgumentException('Only SELECT queries are allowed');
		}
		$stmt = $this->db->prepare($sql);
		if (!$stmt) {
			throw new \RuntimeException('Failed to prepare SQL');
		}
		if (!empty($params)) {
			[$types, $values] = $this->buildTypesAndValues($params);
			$stmt->bind_param($types, ...$values);
		}
		$stmt->execute();
		$result = $stmt->get_result();
		return $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
	}

	private function buildTypesAndValues(array $params): array
	{
		$types = '';
		$values = [];
		foreach ($params as $value) {
			if (is_int($value)) {
				$types .= 'i';
			} elseif (is_float($value)) {
				$types .= 'd';
			} elseif (is_null($value)) {
				$types .= 's';
				$value = null;
			} else {
				$types .= 's';
			}
			$values[] = $value;
		}
		return [$types, $values];
	}
}

