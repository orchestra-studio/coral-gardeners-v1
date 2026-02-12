// Utility functions for exporting data to various formats

export interface ExportColumn {
  key: string;
  label: string;
  format?: (value: unknown) => string;
}

export interface ExportOptions {
  filename?: string;
  columns?: ExportColumn[];
  title?: string;
  subtitle?: string;
}

/**
 * Export data as CSV file
 */
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  options: ExportOptions = {}
): void {
  const { filename = 'export.csv', columns } = options;

  if (data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Determine columns to export
  let exportColumns: ExportColumn[];
  if (columns) {
    exportColumns = columns;
  } else {
    // Auto-generate columns from first data item
    const firstItem = data[0];
    exportColumns = Object.keys(firstItem).map(key => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
    }));
  }

  // Create CSV content
  const headers = exportColumns.map(col => `"${col.label}"`).join(',');
  const rows = data.map(item => 
    exportColumns.map(col => {
      let value = item[col.key];
      if (col.format) {
        value = col.format(value);
      }
      // Escape quotes and wrap in quotes
      return `"${String(value || '').replace(/"/g, '""')}"`;
    }).join(',')
  );

  const csvContent = [headers, ...rows].join('\n');

  // Download file
  downloadFile(csvContent, filename, 'text/csv');
}

/**
 * Export data as JSON file
 */
export function exportToJSON<T extends Record<string, unknown>>(
  data: T[],
  options: ExportOptions = {}
): void {
  const { filename = 'export.json', columns } = options;

  let exportData = data;

  // Filter columns if specified
  if (columns) {
    exportData = data.map(item => {
      const filtered: Record<string, unknown> = {};
      columns.forEach(col => {
        let value = item[col.key];
        if (col.format) {
          value = col.format(value);
        }
        filtered[col.key] = value;
      });
      return filtered as T;
    });
  }

  const jsonContent = JSON.stringify(exportData, null, 2);
  downloadFile(jsonContent, filename, 'application/json');
}

/**
 * Generate HTML table for PDF export
 */
function generateTableHTML<T extends Record<string, unknown>>(
  data: T[],
  columns: ExportColumn[],
  title?: string,
  subtitle?: string
): string {
  const headerRow = columns.map(col => `<th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5;">${col.label}</th>`).join('');
  
  const dataRows = data.map(item => {
    const cells = columns.map(col => {
      let value = item[col.key];
      if (col.format) {
        value = col.format(value);
      }
      return `<td style="border: 1px solid #ddd; padding: 8px;">${String(value || '')}</td>`;
    }).join('');
    return `<tr>${cells}</tr>`;
  }).join('');

  const titleHTML = title ? `<h1 style="margin-bottom: 10px; color: #333;">${title}</h1>` : '';
  const subtitleHTML = subtitle ? `<p style="margin-bottom: 20px; color: #666;">${subtitle}</p>` : '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title || 'Export'}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th, td { text-align: left; }
        @media print {
          body { margin: 0; }
          table { font-size: 12px; }
        }
      </style>
    </head>
    <body>
      ${titleHTML}
      ${subtitleHTML}
      <table>
        <thead>
          <tr>${headerRow}</tr>
        </thead>
        <tbody>
          ${dataRows}
        </tbody>
      </table>
      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;
}

/**
 * Export data as PDF (opens print dialog)
 */
export function exportToPDF<T extends Record<string, unknown>>(
  data: T[],
  options: ExportOptions = {}
): void {
  const { columns, title, subtitle } = options;

  if (data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Determine columns to export
  let exportColumns: ExportColumn[];
  if (columns) {
    exportColumns = columns;
  } else {
    const firstItem = data[0];
    exportColumns = Object.keys(firstItem).map(key => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
    }));
  }

  const htmlContent = generateTableHTML(data, exportColumns, title, subtitle);
  
  // Open in new window for printing
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }
}

/**
 * Helper function to download file
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Format common data types for export
 */
export const formatters = {
  date: (value: unknown): string => {
    if (!value) return '';
    const date = new Date(value as string | number | Date);
    return isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();
  },
  
  datetime: (value: unknown): string => {
    if (!value) return '';
    const date = new Date(value as string | number | Date);
    return isNaN(date.getTime()) ? String(value) : date.toLocaleString();
  },
  
  currency: (value: unknown, currency = 'USD'): string => {
    if (value === null || value === undefined) return '';
    const num = Number(value);
    return isNaN(num) ? String(value) : new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(num);
  },
  
  number: (value: unknown, decimals = 2): string => {
    if (value === null || value === undefined) return '';
    const num = Number(value);
    return isNaN(num) ? String(value) : num.toFixed(decimals);
  },
  
  percentage: (value: unknown): string => {
    if (value === null || value === undefined) return '';
    const num = Number(value);
    return isNaN(num) ? String(value) : `${(num * 100).toFixed(1)}%`;
  },
  
  boolean: (value: unknown): string => {
    return value ? 'Yes' : 'No';
  },
  
  truncate: (maxLength = 50) => (value: unknown): string => {
    const str = String(value || '');
    return str.length > maxLength ? `${str.substring(0, maxLength)}...` : str;
  },
};
