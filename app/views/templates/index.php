<?php
declare(strict_types=1);

ob_start();
?>
<div class="row">
	<div class="col-3">
		<div class="card mb-3">
			<div class="card-header">Settings</div>
			<div class="card-body">
				<div class="mb-2">
					<label class="form-label">Page Size</label>
					<select id="page_size" class="form-select">
						<option value="A4">A4</option>
						<option value="Letter">Letter</option>
						<option value="Legal">Legal</option>
						<option value="Custom">Custom</option>
					</select>
				</div>
				<div class="row g-2 mb-2" id="custom_size_group" style="display:none;">
					<div class="col">
						<input id="custom_width" type="number" class="form-control" placeholder="Width (mm)">
					</div>
					<div class="col">
						<input id="custom_height" type="number" class="form-control" placeholder="Height (mm)">
					</div>
				</div>
				<div class="mb-2">
					<label class="form-label">Orientation</label>
					<select id="orientation" class="form-select">
						<option value="P">Portrait</option>
						<option value="L">Landscape</option>
					</select>
				</div>
				<div class="row g-2">
					<div class="col"><input id="margin_top" class="form-control" type="number" placeholder="Top" value="20"></div>
					<div class="col"><input id="margin_right" class="form-control" type="number" placeholder="Right" value="15"></div>
				</div>
				<div class="row g-2 mt-2">
					<div class="col"><input id="margin_bottom" class="form-control" type="number" placeholder="Bottom" value="20"></div>
					<div class="col"><input id="margin_left" class="form-control" type="number" placeholder="Left" value="15"></div>
				</div>
				<div class="mt-2">
					<label class="form-label">Font</label>
					<select id="font_family" class="form-select">
						<option value="Poppins">Poppins</option>
					</select>
				</div>
			</div>
		</div>
	</div>
	<div class="col-6">
		<div class="card mb-3">
			<div class="card-header">Editors</div>
			<div class="card-body">
				<ul class="nav nav-tabs" role="tablist">
					<li class="nav-item"><a class="nav-link active" data-bs-toggle="tab" href="#tab-header">Header</a></li>
					<li class="nav-item"><a class="nav-link" data-bs-toggle="tab" href="#tab-body">Body</a></li>
					<li class="nav-item"><a class="nav-link" data-bs-toggle="tab" href="#tab-footer">Footer</a></li>
				</ul>
				<div class="tab-content border border-top-0 p-2" style="height:360px;">
					<div class="tab-pane fade show active h-100" id="tab-header">
						<textarea id="header_html"></textarea>
					</div>
					<div class="tab-pane fade h-100" id="tab-body">
						<textarea id="body_html"></textarea>
					</div>
					<div class="tab-pane fade h-100" id="tab-footer">
						<textarea id="footer_html"></textarea>
					</div>
				</div>
			</div>
		</div>
		<div class="d-flex gap-2">
			<button id="btn-preview" class="btn btn-primary">Preview</button>
			<button id="btn-download" class="btn btn-success">Download</button>
		</div>
	</div>
	<div class="col-3">
		<div class="card mb-3">
			<div class="card-header">Data Binding</div>
			<div class="card-body">
				<div id="bindings"></div>
				<button id="add-binding" class="btn btn-sm btn-outline-secondary mt-2">Add Binding</button>
			</div>
		</div>
		<div class="card">
			<div class="card-header">Live Preview</div>
			<div class="card-body">
				<iframe id="preview_iframe" class="w-100" style="height:360px;"></iframe>
			</div>
		</div>
	</div>
</div>

<?php
$content = ob_get_clean();
require __DIR__ . '/../layouts/base.php';

