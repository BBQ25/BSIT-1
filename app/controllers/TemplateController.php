<?php
declare(strict_types=1);

namespace App\Controllers;

use mysqli;
use App\Models\TemplateModel;
use App\Models\BindingModel;
use App\Models\ExportLogModel;
use App\Services\TemplateEngine;
use App\Services\SafeQueryRunner;
use App\Services\PdfRenderer;
use HTMLPurifier;
use HTMLPurifier_Config;

class TemplateController
{
	private mysqli $db;
	private array $config;
	private TemplateModel $templates;
	private BindingModel $bindings;
	private ExportLogModel $logs;
	private TemplateEngine $engine;
	private SafeQueryRunner $queryRunner;
	private PdfRenderer $renderer;
	private HTMLPurifier $purifier;

	public function __construct(mysqli $db, array $config)
	{
		$this->db = $db;
		$this->config = $config;
		$this->templates = new TemplateModel($db);
		$this->bindings = new BindingModel($db);
		$this->logs = new ExportLogModel($db);
		$this->engine = new TemplateEngine();
		$this->queryRunner = new SafeQueryRunner($db);
		$this->renderer = new PdfRenderer($this->engine, $config['app']['fonts_dir']);
		$this->purifier = new HTMLPurifier($this->buildPurifierConfig());
	}

	public function index(): void
	{
		$list = $this->templates->listAll();
		require __DIR__ . '/../views/templates/index.php';
	}

	public function create(): void
	{
		$payload = $this->sanitizeTemplate($_POST);
		$id = $this->templates->create($payload);
		header('Content-Type: application/json');
		echo json_encode(['id' => $id]);
	}

	public function preview(): void
	{
		$tpl = $this->sanitizeTemplate($_POST);
		$context = $this->buildContextFromBindings($tpl);
		$pdfData = $this->renderer->render($tpl, $context);
		header('Content-Type: application/pdf');
		echo $pdfData;
	}

	public function export(): void
	{
		$tpl = $this->sanitizeTemplate($_POST);
		$context = $this->buildContextFromBindings($tpl);
		$filename = $this->resolveFileName($tpl, $context);
		$pdfData = $this->renderer->render($tpl, $context);
		header('Content-Type: application/pdf');
		header('Content-Disposition: attachment; filename="' . $filename . '"');
		$this->logs->log((int)($tpl['id'] ?? 0), null, $filename);
		echo $pdfData;
	}

	private function sanitizeTemplate(array $data): array
	{
		return [
			'id' => isset($data['id']) ? (int)$data['id'] : null,
			'name' => (string)($data['name'] ?? 'Untitled'),
			'description' => (string)($data['description'] ?? ''),
			'header_html' => $this->purifier->purify((string)($data['header_html'] ?? '')),
			'body_html' => $this->purifier->purify((string)($data['body_html'] ?? '')),
			'footer_html' => $this->purifier->purify((string)($data['footer_html'] ?? '')),
			'page_size' => (string)($data['page_size'] ?? 'A4'),
			'orientation' => (string)($data['orientation'] ?? 'P'),
			'margin_top' => (int)($data['margin_top'] ?? 20),
			'margin_right' => (int)($data['margin_right'] ?? 15),
			'margin_bottom' => (int)($data['margin_bottom'] ?? 20),
			'margin_left' => (int)($data['margin_left'] ?? 15),
			'font_family' => (string)($data['font_family'] ?? 'Poppins'),
			'custom_width' => isset($data['custom_width']) ? (float)$data['custom_width'] : null,
			'custom_height' => isset($data['custom_height']) ? (float)$data['custom_height'] : null,
			'created_by' => 1,
			'bindings' => $this->parseBindings($data['bindings'] ?? []),
			'filename_pattern' => (string)($data['filename_pattern'] ?? 'document-{{date}}.pdf'),
		];
	}

	private function parseBindings($bindings): array
	{
		if (is_string($bindings)) {
			$decoded = json_decode($bindings, true);
			return is_array($decoded) ? $decoded : [];
		}
		return is_array($bindings) ? $bindings : [];
	}

	private function buildContextFromBindings(array $tpl): array
	{
		$context = [];
		foreach ($tpl['bindings'] as $binding) {
			$key = $binding['key'] ?? '';
			$sql = $binding['sql'] ?? '';
			$params = $binding['params'] ?? [];
			if ($key && $sql) {
				$rows = $this->queryRunner->runSelect($sql, $params);
				$context[$key] = $rows;
			}
		}
		$context['date'] = date('Y-m-d');
		$context['datetime'] = date('Y-m-d H:i');
		return $context;
	}

	private function resolveFileName(array $tpl, array $context): string
	{
		$pattern = $tpl['filename_pattern'] ?? 'document-{{date}}.pdf';
		$name = $this->engine->render($pattern, $context);
		$name = preg_replace('/[^A-Za-z0-9_.-]+/', '-', $name);
		if (!str_ends_with(strtolower($name), '.pdf')) {
			$name .= '.pdf';
		}
		return $name;
	}

	private function buildPurifierConfig(): HTMLPurifier_Config
	{
		$config = HTMLPurifier_Config::createDefault();
		$config->set('HTML.Allowed', 'p,b,strong,i,em,u,span,div,table,thead,tbody,tfoot,tr,th,td,ul,ol,li,img,a,hr,br,h1,h2,h3,h4,h5,h6');
		$config->set('Attr.AllowedFrameTargets', ['_blank']);
		$config->set('CSS.AllowedProperties', ['font','font-size','font-weight','font-style','text-decoration','padding','margin','border','border-collapse','color','background','background-color','width','height','text-align']);
		$config->set('HTML.SafeIframe', false);
		$config->set('URI.AllowedSchemes', ['http' => true, 'https' => true, 'data' => true]);
		return $config;
	}
}

