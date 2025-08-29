<?php
declare(strict_types=1);
?><!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>PDF Generator</title>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
	<link href="/assets/css/app.css" rel="stylesheet">
</head>
<body>
	<div class="container-fluid py-3">
		<?= $content ?? '' ?>
	</div>
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/tinymce@7.4.1/tinymce.min.js"></script>
	<script src="/assets/js/app.js"></script>
</body>
</html>

