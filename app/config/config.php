<?php
declare(strict_types=1);

return [
	'db' => [
		'host' => getenv('DB_HOST') ?: '127.0.0.1',
		'port' => (int)(getenv('DB_PORT') ?: '3306'),
		'name' => getenv('DB_NAME') ?: 'app',
		'user' => getenv('DB_USER') ?: 'root',
		'pass' => getenv('DB_PASS') ?: '',
	],
	'app' => [
		'base_url' => getenv('APP_BASE_URL') ?: '/',
		'timezone' => getenv('APP_TZ') ?: 'UTC',
		'upload_dir' => __DIR__ . '/../../storage',
		'logs_dir' => __DIR__ . '/../../storage/logs',
		'fonts_dir' => __DIR__ . '/../../storage/fonts',
	],
];

