INSERT INTO pdf_templates (name, description, header_html, body_html, footer_html, page_size, orientation, margin_top, margin_right, margin_bottom, margin_left, font_family, created_by, created_at, updated_at)
VALUES
('Class Record', 'Roster with zebra table',
 '<div style="text-align:right; font-size:12px;">{PAGE}/{PAGETOTAL}</div><h2>{{class.code}} - {{class.name}}</h2>',
 '<h3>Class Roster</h3><table class="zebra"><thead><tr><th>#</th><th>Name</th><th>ID</th></tr></thead><tbody>{{#students}}<tr><td>{{index}}</td><td>{{first_name}} {{last_name}}</td><td>{{student_id}}</td></tr>{{/students}}</tbody></table>',
 '<div style="text-align:center; font-size:11px;">Generated on {{date}}</div>',
 'A4','P',20,15,20,15,'Poppins',1,NOW(),NOW()),
('Student Transcript', 'Per-student transcript',
 '<div style="display:flex; justify-content:space-between; align-items:center;"><div><img src="{{school.logo}}" style="height:40px;"></div><div><strong>{{student.first_name}} {{student.last_name}}</strong><br><span>ID: {{student.student_id}}</span></div><div>{PAGE}/{PAGETOTAL}</div></div>',
 '<h3>Transcript</h3><table class="zebra"><thead><tr><th>Course</th><th>Code</th><th>Credits</th><th>Grade</th></tr></thead><tbody>{{#records}}<tr><td>{{course_name}}</td><td>{{course_code}}</td><td>{{credits}}</td><td>{{grade}}</td></tr>{{/records}}</tbody></table>',
 '<div style="text-align:center; font-size:11px;">Printed: {{datetime}}</div>',
 'A4','P',20,15,20,15,'Poppins',1,NOW(),NOW());

-- Example bindings are stored separately in app; runtime can use ad-hoc bindings.

