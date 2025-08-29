<?php
declare(strict_types=1);

namespace App\Services;

class TemplateEngine
{
	public function render(string $template, array $context): string
	{
		$template = $this->renderSections($template, $context);
		$template = $this->renderVariables($template, $context);
		return $template;
	}

	private function renderSections(string $template, array $context): string
	{
		$pattern = '/\{\{#\s*([a-zA-Z0-9_\.]+)\s*\}\}([\s\S]*?)\{\{\/\s*\1\s*\}\}/';
		return preg_replace_callback($pattern, function ($matches) use ($context) {
			$keyPath = $matches[1];
			$inner = $matches[2];
			$value = $this->getValue($context, $keyPath);
			if (is_array($value)) {
				$result = '';
				foreach ($value as $item) {
					$merged = array_merge($context, is_array($item) ? $item : ['.' => $item]);
					$result .= $this->render($inner, $merged);
				}
				return $result;
			}
			return '';
		}, $template);
	}

	private function renderVariables(string $template, array $context): string
	{
		return preg_replace_callback('/\{\{\s*([a-zA-Z0-9_\.]+)\s*\}\}/', function ($matches) use ($context) {
			$value = $this->getValue($context, $matches[1]);
			if (is_scalar($value) || $value === null) {
				return htmlspecialchars((string)$value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
			}
			return '';
		}, $template);
	}

	private function getValue(array $context, string $path)
	{
		$parts = explode('.', $path);
		$current = $context;
		foreach ($parts as $part) {
			if (is_array($current) && array_key_exists($part, $current)) {
				$current = $current[$part];
			} else {
				return null;
			}
		}
		return $current;
	}
}

