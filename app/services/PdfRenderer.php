<?php
declare(strict_types=1);

namespace App\Services;

use Mpdf\Mpdf;
use Mpdf\Config\FontVariables;
use Mpdf\Config\ConfigVariables;

class PdfRenderer
{
	private TemplateEngine $engine;
	private string $fontsDir;

	public function __construct(TemplateEngine $engine, string $fontsDir)
	{
		$this->engine = $engine;
		$this->fontsDir = $fontsDir;
	}

	public function render(array $tpl, array $context): string
	{
		[$format, $orientation] = $this->buildFormat($tpl);
		[$fontdata, $fontdir] = $this->buildFonts();

		$mpdf = new Mpdf([
			'mode' => 'utf-8',
			'format' => $format,
			'orientation' => strtoupper($orientation) === 'L' ? 'L' : 'P',
			'margin_top' => (int)($tpl['margin_top'] ?? 20),
			'margin_right' => (int)($tpl['margin_right'] ?? 15),
			'margin_bottom' => (int)($tpl['margin_bottom'] ?? 20),
			'margin_left' => (int)($tpl['margin_left'] ?? 15),
			'fontDir' => $fontdir,
			'fontdata' => $fontdata,
			'default_font' => 'poppins',
		]);

		$header = $this->prepareHeaderFooter($tpl['header_html'] ?? '', $context);
		$footer = $this->prepareHeaderFooter($tpl['footer_html'] ?? '', $context);
		if ($header !== '') {
			$mpdf->SetHTMLHeader($header);
		}
		if ($footer !== '') {
			$mpdf->SetHTMLFooter($footer);
		}

		$body = $this->engine->render((string)($tpl['body_html'] ?? ''), $context);
		$stylesheet = $this->baseStyles();
		$mpdf->WriteHTML($stylesheet, \Mpdf\HTMLParserMode::HEADER_CSS);
		$mpdf->WriteHTML($body, \Mpdf\HTMLParserMode::HTML_BODY);
		return $mpdf->Output('', 'S');
	}

	private function baseStyles(): string
	{
		return 'table { width: 100%; border-collapse: collapse; } table th, table td { border: 1px solid #ccc; padding: 6px; } .zebra tr:nth-child(even){ background: #f8f9fa; }';
	}

	private function buildFormat(array $tpl): array
	{
		$size = strtoupper((string)($tpl['page_size'] ?? 'A4'));
		if ($size === 'CUSTOM' && isset($tpl['custom_width'], $tpl['custom_height'])) {
			return ([[ (float)$tpl['custom_width'], (float)$tpl['custom_height'] ], $tpl['orientation'] ?? 'P']);
		}
		return [$size, $tpl['orientation'] ?? 'P'];
	}

	private function buildFonts(): array
	{
		$defaultConfig = (new ConfigVariables())->getDefaults();
		$fontDirs = $defaultConfig['fontDir'];
		$fontdir = array_merge($fontDirs, [$this->fontsDir]);

		$fontData = (new FontVariables())->getDefaults()['fontdata'];
		$fontdata = $fontData + [
			'poppins' => [
				'R' => 'Poppins-Regular.ttf',
				'B' => 'Poppins-Bold.ttf',
				'I' => 'Poppins-Italic.ttf',
				'BI' => 'Poppins-BoldItalic.ttf',
			],
		];
		return [$fontdata, $fontdir];
	}

	private function prepareHeaderFooter(string $html, array $context): string
	{
		if ($html === '') {
			return '';
		}
		// Replace {PAGE}/{PAGETOTAL} to mPDF tokens
		$html = str_replace(['{PAGE}', '{PAGETOTAL}'], ['{PAGENO}', '{nbpg}'], $html);
		return $this->engine->render($html, $context);
	}
}

