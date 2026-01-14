import React, { useState } from 'react';
import { Upload, FileText, Download, Loader2 } from 'lucide-react';
import { convertJsonToCsv, downloadCsv } from '../utils/csvUtils';
import { extractData } from '../services/aiService';
import TableEditor from '../components/TableEditor';

export default function Home() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [selectedTables, setSelectedTables] = useState(new Set());
    const [error, setError] = useState('');

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) processFile(droppedFile);
    };

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) processFile(selectedFile);
    };

    const processFile = (file) => {
        setFile(file);
        setError('');
        setData(null);
    };

    const handleConvert = async () => {
        if (!file) return;

        setLoading(true);
        setError('');

        try {
            const result = await extractData(file);
            setData(result);
        } catch (err) {
            setError(err.message || 'Failed to convert file. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle download for a specific table
    const handleDownload = async (tableIndex, format = 'csv') => {
        if (!data || !data[tableIndex]) return;
        const table = data[tableIndex];

        try {
            if (format === 'xlsx') {
                const { downloadXlsx } = await import('../utils/csvUtils');
                await downloadXlsx(table.data, `${table.name || `table_${tableIndex + 1}`}.xlsx`, table.name);
            } else if (format === 'pdf') {
                const { downloadPdf } = await import('../utils/csvUtils');
                await downloadPdf(table.data, `${table.name || `table_${tableIndex + 1}`}.pdf`, table.name);
            } else {
                const csv = convertJsonToCsv(table.data);
                downloadCsv(csv, `${table.name || `table_${tableIndex + 1}`}.csv`);
            }
        } catch (error) {
            console.error("Download failed:", error);
            setError(`Failed to download ${format.toUpperCase()}: ${error.message}`);
        }
    };

    // Handle download of "All" or "Selected" tables
    const handleDownloadMerged = async (format = 'csv') => {
        if (!data) return;

        // Determine which tables to download
        const tablesToDownload = selectedTables.size > 0
            ? data.filter((_, idx) => selectedTables.has(idx))
            : data;

        if (format === 'xlsx') {
            // XLSX: Each table as a separate sheet
            const XLSX = await import('xlsx');
            const workbook = XLSX.utils.book_new();

            tablesToDownload.forEach((table, index) => {
                const worksheet = XLSX.utils.json_to_sheet(table.data);

                // Apply same formatting as single table download
                const range = XLSX.utils.decode_range(worksheet['!ref']);

                // Format header row
                for (let col = range.s.c; col <= range.e.c; col++) {
                    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
                    if (worksheet[cellAddress]) {
                        worksheet[cellAddress].s = {
                            font: { bold: true, sz: 12, color: { rgb: "FFFFFF" } },
                            fill: { fgColor: { rgb: "4A5568" } },
                            alignment: { horizontal: "center", vertical: "center" }
                        };
                    }
                }

                // Format first column
                for (let row = range.s.r + 1; row <= range.e.r; row++) {
                    const cellAddress = XLSX.utils.encode_cell({ r: row, c: 0 });
                    if (worksheet[cellAddress]) {
                        worksheet[cellAddress].s = {
                            font: { bold: true },
                            fill: { fgColor: { rgb: "E2E8F0" } },
                            alignment: { horizontal: "left", vertical: "center" }
                        };
                    }
                }

                // Center numbers
                for (let row = range.s.r + 1; row <= range.e.r; row++) {
                    for (let col = range.s.c + 1; col <= range.e.c; col++) {
                        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
                        if (worksheet[cellAddress]) {
                            const cellValue = worksheet[cellAddress].v;
                            if (typeof cellValue === 'number' || !isNaN(cellValue)) {
                                worksheet[cellAddress].s = {
                                    alignment: { horizontal: "center", vertical: "center" }
                                };
                            }
                        }
                    }
                }

                const sheetName = (table.name || `Table ${index + 1}`).substring(0, 31); // Excel limit
                XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
            });

            const filename = selectedTables.size > 0 ? 'selected_tables.xlsx' : 'all_tables.xlsx';
            XLSX.writeFile(workbook, filename);
        } else if (format === 'pdf') {
            // PDF: Multiple tables in one document
            const { jsPDF } = await import('jspdf');
            const autoTable = (await import('jspdf-autotable')).default;

            const doc = new jsPDF();
            let startY = 15;

            tablesToDownload.forEach((table, index) => {
                if (index > 0) {
                    doc.addPage(); // New page for each table
                    startY = 15;
                }

                // Add table title
                doc.setFontSize(14);
                doc.setFont(undefined, 'bold');
                doc.text(table.name || `Table ${index + 1}`, 14, startY);

                // Extract headers and rows
                if (table.data && table.data.length > 0) {
                    const headers = Object.keys(table.data[0]);
                    const rows = table.data.map(row => headers.map(header => String(row[header] || '')));

                    // Use autoTable as function
                    autoTable(doc, {
                        head: [headers],
                        body: rows,
                        startY: startY + 7,
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
                }
            });

            const filename = selectedTables.size > 0 ? 'selected_tables.pdf' : 'all_tables.pdf';
            doc.save(filename);
        } else {
            // CSV: Merged with comment headers
            let mergedCsv = '';
            tablesToDownload.forEach((table, index) => {
                if (index > 0) {
                    mergedCsv += '\n';
                }
                mergedCsv += `# TABLE: ${table.name || 'Untitled'}\n`;
                mergedCsv += convertJsonToCsv(table.data) + '\n';
            });

            const filename = selectedTables.size > 0 ? 'selected_tables_merged.csv' : 'all_tables_merged.csv';
            downloadCsv(mergedCsv, filename);
        }
    };

    const handleCellChange = (tableIndex, rowIndex, key, value) => {
        const newData = [...data]; // Copy of tables array
        const newTableData = [...newData[tableIndex].data]; // Copy of rows for specific table
        newTableData[rowIndex] = { ...newTableData[rowIndex], [key]: value };

        newData[tableIndex] = { ...newData[tableIndex], data: newTableData };
        setData(newData);
    };

    const handleTableUpdate = (index, newTableState) => {
        setData((prevData) => {
            const newData = [...prevData];
            newData[index] = { ...newData[index], ...newTableState };
            return newData;
        });
    };

    const toggleTableSelection = (index) => {
        const newSelection = new Set(selectedTables);
        if (newSelection.has(index)) {
            newSelection.delete(index);
        } else {
            newSelection.add(index);
        }
        setSelectedTables(newSelection);
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <header className="mb-12 text-center animate-in fade-in slide-in-from-top-4 duration-700">
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
                    Unstructured Data to <span className="text-indigo-600">Excel</span>
                </h1>
                <p className="text-slate-600 text-lg sm:text-xl max-w-2xl mx-auto">
                    Turn your screenshots, messy PDFs, and images into clean, formatted Excel sheets in seconds using AI.
                </p>
            </header>

            <main className="space-y-8">
                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md animate-in fade-in slide-in-from-top-2">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700 font-medium">Error</p>
                                <p className="text-sm text-red-600 mt-1">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* File Upload Section */}
                <div
                    className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center bg-white hover:border-indigo-500 hover:bg-indigo-50/10 transition-all cursor-pointer shadow-sm group"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('fileInput').click()}
                >
                    <input
                        type="file"
                        id="fileInput"
                        className="hidden"
                        accept="image/*,.pdf,.txt"
                        onChange={handleFileSelect}
                    />
                    <div className="flex flex-col items-center gap-6">
                        <div className="p-5 bg-indigo-50 text-indigo-600 rounded-full group-hover:scale-110 transition-transform duration-300">
                            <Upload size={40} />
                        </div>
                        <div>
                            <p className="text-xl font-semibold text-slate-800 mb-2">
                                {file ? file.name : "Drop your image or PDF here"}
                            </p>
                            <p className="text-slate-500">
                                Supports JPG, PNG, PDF • Max 10MB
                            </p>
                        </div>
                        {!file && (
                            <button className="bg-white text-indigo-600 border border-indigo-200 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors">
                                Or click to browse
                            </button>
                        )}
                    </div>
                </div>

                {/* Action Button */}
                {file && !data && (
                    <div className="text-center animate-in fade-in zoom-in duration-300">
                        <button
                            onClick={handleConvert}
                            disabled={loading}
                            className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-lg font-bold py-4 px-10 rounded-xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3 mx-auto"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" /> Extracting Data...
                                </>
                            ) : (
                                <>
                                    <FileText className="w-6 h-6" /> Convert Now
                                </>
                            )}
                        </button>
                        <p className="mt-4 text-sm text-slate-400">Powered by Advanced AI Models</p>
                    </div>
                )}

                {/* Results Section - Global Actions */}
                {data && data.length > 0 && (
                    <div className="flex flex-wrap justify-end gap-3 mb-6 sticky top-20 z-10 bg-slate-50/90 p-2 backdrop-blur-sm rounded-lg border border-slate-200/50">
                        <button
                            onClick={() => handleDownloadMerged('csv')}
                            className="bg-slate-700 hover:bg-slate-800 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-colors flex items-center gap-2"
                            title="Download as merged CSV"
                        >
                            <Download size={18} />
                            {selectedTables.size > 0
                                ? `CSV: Selected (${selectedTables.size})`
                                : "CSV: All Tables"}
                        </button>
                        <button
                            onClick={() => handleDownloadMerged('xlsx')}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-colors flex items-center gap-2"
                            title="Download as Excel workbook (each table = separate sheet)"
                        >
                            <Download size={18} />
                            {selectedTables.size > 0
                                ? `Excel: Selected (${selectedTables.size})`
                                : "Excel: All Tables"}
                        </button>
                        <button
                            onClick={() => handleDownloadMerged('pdf')}
                            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-colors flex items-center gap-2"
                            title="Download as PDF (each table on new page)"
                        >
                            <Download size={18} />
                            {selectedTables.size > 0
                                ? `PDF: Selected (${selectedTables.size})`
                                : "PDF: All Tables"}
                        </button>
                    </div>
                )}

                {/* Results Section - Table List */}
                {data && data.map((table, tableIdx) => (
                    <div key={tableIdx} className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 mb-8">
                        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50 gap-4">
                            <div className="flex items-center gap-4">
                                <input
                                    type="checkbox"
                                    checked={selectedTables.has(tableIdx)}
                                    onChange={() => toggleTableSelection(tableIdx)}
                                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300 cursor-pointer"
                                />
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">{table.name || `Table ${tableIdx + 1}`}</h2>
                                    <p className="text-sm text-slate-500 mt-1">Drag cols/rows to reorder. Edit freely.</p>
                                </div>
                            </div>
                            <div className="flex gap-2 self-end sm:self-auto">
                                <button
                                    onClick={() => handleDownload(tableIdx, 'csv')}
                                    className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium py-2 px-3 rounded-lg shadow-sm transition-colors flex items-center gap-1"
                                    title="Download as CSV"
                                >
                                    <Download size={16} /> CSV
                                </button>
                                <button
                                    onClick={() => handleDownload(tableIdx, 'xlsx')}
                                    className="bg-blue-50 border border-blue-100 hover:bg-blue-100 text-blue-700 text-sm font-medium py-2 px-3 rounded-lg shadow-sm transition-colors flex items-center gap-1"
                                    title="Download as Excel"
                                >
                                    <Download size={16} /> Excel
                                </button>
                                <button
                                    onClick={() => handleDownload(tableIdx, 'pdf')}
                                    className="bg-red-50 border border-red-100 hover:bg-red-100 text-red-700 text-sm font-medium py-2 px-3 rounded-lg shadow-sm transition-colors flex items-center gap-1"
                                    title="Download as PDF"
                                >
                                    <Download size={16} /> PDF
                                </button>
                            </div>
                        </div>

                        <TableEditor
                            initialData={table.data}
                            tableName={table.name}
                            onUpdate={(newTableState) => handleTableUpdate(tableIdx, newTableState)}
                        />
                    </div>
                ))}
            </main>
        </div>
    );
}
