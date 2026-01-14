import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // Import as default for Vite compatibility

/**
 * Converts a JSON array of objects to a CSV string.
 * @param {Array<Object>} data - The data to convert.
 * @returns {string} The CSV string.
 */
export const convertJsonToCsv = (data) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return '';
    }

    return Papa.unparse(data, {
        quotes: true, // Quote all fields to handle commas safely
        header: true,
    });
};

/**
 * Triggers a download of valid CSV content.
 * @param {string} csvContent - The CSV string.
 * @param {string} filename - The name of the file to download (e.g., 'data.csv').
 */
export const downloadCsv = (csvContent, filename = 'exported_data.csv') => {
    if (!csvContent) return;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Downloads data as a formatted XLSX file with styling.
 * @param {Array<Object>} data - Array of row objects.
 * @param {string} filename - Filename (e.g., 'data.xlsx').
 * @param {string} sheetName - Sheet name (default: 'Sheet1').
 */
export const downloadXlsx = async (data, filename = 'exported_data.xlsx', sheetName = 'Data') => {
    if (!data || !Array.isArray(data) || data.length === 0) return;

    // Dynamically import XLSX to keep bundle size small
    const XLSX = await import('xlsx');

    // Create worksheet from data
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Apply formatting
    const range = XLSX.utils.decode_range(worksheet['!ref']);

    // Format header row (row 0)
    for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
        if (!worksheet[cellAddress]) continue;

        worksheet[cellAddress].s = {
            font: { bold: true, sz: 12, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "4A5568" } }, // Gray background
            alignment: { horizontal: "center", vertical: "center" }
        };
    }

    // Format first column (row headers)
    for (let row = range.s.r + 1; row <= range.e.r; row++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: 0 });
        if (!worksheet[cellAddress]) continue;

        worksheet[cellAddress].s = {
            font: { bold: true },
            fill: { fgColor: { rgb: "E2E8F0" } }, // Light gray
            alignment: { horizontal: "left", vertical: "center" }
        };
    }

    // Center align all number cells
    for (let row = range.s.r + 1; row <= range.e.r; row++) {
        for (let col = range.s.c + 1; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            if (!worksheet[cellAddress]) continue;

            // Check if it's a number
            const cellValue = worksheet[cellAddress].v;
            if (typeof cellValue === 'number' || !isNaN(cellValue)) {
                worksheet[cellAddress].s = {
                    alignment: { horizontal: "center", vertical: "center" }
                };
            }
        }
    }

    // Set column widths
    const colWidths = [];
    for (let col = range.s.c; col <= range.e.c; col++) {
        colWidths.push({ wch: 15 }); // 15 characters wide
    }
    worksheet['!cols'] = colWidths;

    // Create workbook and download
    const workbook = XLSX.utils.book_new();
    // Excel sheet names max 31 chars - truncate if needed
    const safeSheetName = sheetName.length > 31 ? sheetName.substring(0, 31) : sheetName;
    XLSX.utils.book_append_sheet(workbook, worksheet, safeSheetName);
    XLSX.writeFile(workbook, filename);
};

/**
 * Downloads data as a formatted PDF file.
 * @param {Array<Object>} data - Array of row objects.
 * @param {string} filename - Filename (e.g., 'data.pdf').
 * @param {string} title - Table title.
 */
export const downloadPdf = async (data, filename = 'exported_data.pdf', title = 'Table') => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        console.error("downloadPdf: No data provided");
        return;
    }

    try {
        // jsPDF and autoTable are already imported at the top
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text(title, 14, 15);

        // Extract headers and rows
        const headers = Object.keys(data[0]);
        const rows = data.map(row => headers.map(header => String(row[header] || '')));

        // Call autoTable as a function (Vite/ESM pattern)
        autoTable(doc, {
            head: [headers],
            body: rows,
            startY: 25,
            theme: 'grid',
            styles: {
                fontSize: 9,
                cellPadding: 3,
                halign: 'center',
            },
            headStyles: {
                fillColor: [74, 85, 104],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                halign: 'center',
            },
            columnStyles: {
                0: { halign: 'left', fontStyle: 'bold' },
            },
            alternateRowStyles: {
                fillColor: [245, 247, 250],
            },
        });

        doc.save(filename);
    } catch (error) {
        console.error("PDF generation failed:", error);
        throw error;
    }
};
