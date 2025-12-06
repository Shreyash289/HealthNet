export function exportToCsv(filename, rows) {
  if (!rows || !rows.length) return;
  const header = Object.keys(rows[0]);
  const csv = [ header.join(','), ...rows.map(row => header.map(fieldName => {
    const v = row[fieldName] ?? '';
    return '"' + String(v).replace(/"/g, '""') + '"';
  }).join(',')) ].join('\r\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
