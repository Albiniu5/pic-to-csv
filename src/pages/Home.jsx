import React, { useState, useEffect } from 'react';
import { Upload, FileText, Download, Loader2, Bot, Zap, Lock, Smartphone, Camera } from 'lucide-react';
import { convertJsonToCsv, downloadCsv } from '../utils/csvUtils';
import { extractData } from '../services/aiService';
import TableEditor from '../components/TableEditor';
import FloatingActionButton from '../components/FloatingActionButton';
import InAppTips from '../components/InAppTips';
import SocialProof from '../components/SocialProof';
import ProgressIndicator from '../components/ProgressIndicator';
import ProgressAnimation from '../components/ProgressAnimation';
import PostConversionFeedback from '../components/PostConversionFeedback';
import AchievementBadge from '../components/AchievementBadge';
import MobileErrorHandler from '../components/MobileErrorHandler';
import OnboardingTutorial from '../components/OnboardingTutorial';
import UploadProgress from '../components/UploadProgress';
import FeedbackSummary from '../components/FeedbackSummary';
import ContactModal from '../components/ContactModal';
import { getUserData, incrementConversions, awardPoints } from '../utils/gamification';
import { notifyOwnerConversion, notifyOwnerDownload } from '../services/notificationService';

export default function Home() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [selectedTables, setSelectedTables] = useState(new Set());
    const [error, setError] = useState('');
    const [showFeedback, setShowFeedback] = useState(false);
    const [showTip, setShowTip] = useState(true);
    const [showBadge, setShowBadge] = useState(null);
    const [progressSteps, setProgressSteps] = useState([]);
    const [userStats, setUserStats] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);

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
        if (selectedFile) {
            setIsUploading(true);
            setUploadProgress(0);

            // Simulate upload progress (2 seconds total for better UX)
            // Real app would use XHR progress
            const intervalTime = 100;
            const maxProgress = 90;

            const progressInterval = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev >= maxProgress) {
                        return maxProgress;
                    }
                    return prev + 5;
                });
            }, intervalTime);

            // Finish after 2 seconds
            setTimeout(() => {
                clearInterval(progressInterval);
                setUploadProgress(100);

                // Small delay at 100% before showing file
                setTimeout(() => {
                    processFile(selectedFile);
                    setIsUploading(false);
                    setUploadProgress(0);
                }, 500);
            }, 2000);
        }
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

        // Set progress steps for visual feedback
        setProgressSteps([
            'Scanning document...',
            'Detecting tables...',
            'Extracting data...',
            'Finalizing results...'
        ]);

        try {
            const result = await extractData(file);

            // ERROR CHECK: If result is empty or invalid
            if (!result || result.length === 0) {
                // If it was a successful API call but no tables found:
                throw new Error("I'm sorry, this data cannot be extracted. No tables or structured data were found in the image.");
            }

            setData(result);

            // Gamification: Award points and track conversions
            awardPoints(10, 'Conversion completed');
            const userData = incrementConversions();
            setUserStats(userData);

            // Notify owner of conversion
            notifyOwnerConversion({
                name: file.name,
                size: file.size,
                type: file.type,
                tablesCount: result.length,
            });

            // Show achievement badge if new one was earned
            if (userData.hasNewBadges && userData.newBadges.length > 0) {
                // Show the most recent badge with a slight delay
                setTimeout(() => {
                    setShowBadge(userData.newBadges[userData.newBadges.length - 1]);
                }, 500);
            }

            // Show feedback survey after successful conversion
            setTimeout(() => {
                setShowFeedback(true);
            }, 1500);
        } catch (err) {
            setError(err.message || 'Failed to convert file. Please try again.');
        } finally {
            setLoading(false);
            setProgressSteps([]);
        }
    };

    // Initialize user stats on mount
    useEffect(() => {
        setUserStats(getUserData());
    }, []);

    const handleCameraSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) processFile(selectedFile);
    };

    // Handle download for a specific table
    const handleDownload = async (tableIndex, format = 'csv') => {
        if (!data || !data[tableIndex]) return;
        const table = data[tableIndex];

        try {
            if (format === 'xlsx') {
                const { downloadXlsx } = await import('../utils/csvUtils');
                await downloadXlsx(table.data, `${table.name || `table_${tableIndex + 1}`}.xlsx`, table.name);
                notifyOwnerDownload({ format: 'xlsx', tablesCount: 1, fileName: `${table.name || `table_${tableIndex + 1}`}.xlsx` });
            } else if (format === 'pdf') {
                const { downloadPdf } = await import('../utils/csvUtils');
                await downloadPdf(table.data, `${table.name || `table_${tableIndex + 1}`}.pdf`, table.name);
                notifyOwnerDownload({ format: 'pdf', tablesCount: 1, fileName: `${table.name || `table_${tableIndex + 1}`}.pdf` });
            } else {
                const csv = convertJsonToCsv(table.data);
                downloadCsv(csv, `${table.name || `table_${tableIndex + 1}`}.csv`);
                notifyOwnerDownload({ format: 'csv', tablesCount: 1, fileName: `${table.name || `table_${tableIndex + 1}`}.csv` });
            }

            // Trigger contact modal after download
            // Trigger contact modal immediately after download
            setShowContactModal(true);
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

            // Notify owner of download
            notifyOwnerDownload({
                format: 'xlsx',
                tablesCount: tablesToDownload.length,
                fileName: filename,
            });
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

            // Notify owner of download
            notifyOwnerDownload({
                format: 'pdf',
                tablesCount: tablesToDownload.length,
                fileName: filename,
            });
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

            // Notify owner of download
            notifyOwnerDownload({
                format: 'csv',
                tablesCount: tablesToDownload.length,
                fileName: filename,
            });
        }

        // Trigger contact modal immediately after download
        setShowContactModal(true);
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
        <div className="max-w-4xl mx-auto py-8 md:py-16 px-4 sm:px-6 lg:px-8">
            {/* Social Proof Banner */}
            <SocialProof />



            <header className="mb-12 md:mb-16 text-center animate-in fade-in slide-in-from-top-4 duration-700">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 md:mb-6 text-brand-dark">
                    Unstructured Data to <span className="text-brand-blue">Excel</span>
                </h1>
                <p className="text-brand-muted text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                    Turn your screenshots, messy PDFs, and images into clean, formatted Excel sheets in seconds using AI.
                </p>
            </header>

            <main className="space-y-6 md:space-y-10">
                {/* Upload Progress moved inside dropzone */}

                {/* Enhanced Mobile-Friendly Error Handler */}
                {error && (
                    <MobileErrorHandler
                        error={error}
                        onRetry={() => {
                            setError('');
                            if (file) handleConvert();
                        }}
                        onDismiss={() => setError('')}
                    />
                )}

                {/* File Upload Section - Mobile Optimized */}
                <div
                    className="border-2 border-dashed border-gray-200 rounded-xl p-8 md:p-16 text-center bg-white hover:border-brand-blue hover:bg-slate-50 transition-all cursor-pointer shadow-sm group"
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
                    <input
                        type="file"
                        id="cameraInput"
                        className="hidden"
                        accept="image/*"
                        capture="environment"
                        onChange={handleCameraSelect}
                    />
                    <div className="flex flex-col items-center gap-4 md:gap-6">
                        <div className="p-3 md:p-4 bg-blue-50 text-brand-blue rounded-full group-hover:scale-105 transition-transform duration-300">
                            <Upload size={28} strokeWidth={2} className="md:w-8 md:h-8" />
                        </div>
                        <div>
                            <p className="text-lg md:text-xl font-semibold text-brand-dark mb-2">
                                {file ? file.name : "Drop or Select File"}
                            </p>
                            <p className="text-brand-muted text-xs md:text-sm">
                                JPG, PNG, PDF supported up to 10MB
                            </p>
                        </div>
                        {!file && !isUploading && (
                            <div className="flex flex-col sm:flex-row gap-3 mt-2">
                                <button
                                    className="bg-white text-brand-dark border border-gray-200 px-6 py-3 md:px-5 md:py-2.5 rounded-lg font-medium hover:border-brand-blue hover:text-brand-blue transition-colors shadow-sm min-h-[48px] min-w-[140px] touch-manipulation"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        document.getElementById('fileInput').click();
                                    }}
                                >
                                    Browse Files
                                </button>
                                <button
                                    className="bg-brand-blue text-white border border-brand-blue px-6 py-3 md:px-5 md:py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm min-h-[48px] min-w-[140px] touch-manipulation flex items-center justify-center gap-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        document.getElementById('cameraInput').click();
                                    }}
                                >
                                    <Camera size={18} /> Camera
                                </button>
                            </div>
                        )}

                        {isUploading && (
                            <div className="w-full max-w-sm mt-4 animate-in zoom-in duration-200">
                                <UploadProgress progress={uploadProgress} fileName={file ? file.name : "Uploading..."} />
                            </div>
                        )}
                    </div>
                </div>

                {/* In-App Tips - Moved below file upload */}
                {showTip && !file && <InAppTips variant="card" onDismiss={() => setShowTip(false)} />}

                {/* Action Button - Mobile Optimized */}
                {file && !data && (
                    <div className="text-center animate-in fade-in zoom-in duration-300 py-4">
                        {loading ? (
                            <div>
                                {progressSteps.length > 0 ? (
                                    <ProgressIndicator steps={progressSteps} />
                                ) : (
                                    <ProgressAnimation message="AI is extracting your data..." />
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={handleConvert}
                                disabled={loading}
                                className="bg-brand-blue hover:bg-blue-700 text-white text-base md:text-lg font-medium py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3 mx-auto min-h-[56px] min-w-[200px] touch-manipulation"
                            >
                                <FileText className="w-5 h-5" /> Convert to Excel
                            </button>
                        )}
                    </div>
                )}

                {/* Results Section - Global Actions */}
                {data && data.length > 0 && (
                    <div className="flex flex-wrap justify-end gap-3 mb-6 sticky top-20 z-10 bg-white/90 p-3 backdrop-blur-sm rounded-lg border border-gray-100 shadow-sm">
                        <button
                            onClick={() => handleDownloadMerged('csv')}
                            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg shadow-sm transition-colors flex items-center gap-2"
                            title="Download as merged CSV"
                        >
                            <Download size={16} />
                            {selectedTables.size > 0
                                ? `CSV (${selectedTables.size})`
                                : "CSV All"}
                        </button>
                        <button
                            onClick={() => handleDownloadMerged('xlsx')}
                            className="bg-brand-blue hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-colors flex items-center gap-2"
                            title="Download as Excel workbook"
                        >
                            <Download size={16} />
                            {selectedTables.size > 0
                                ? `Excel (${selectedTables.size})`
                                : "Excel All"}
                        </button>
                        <button
                            onClick={() => handleDownloadMerged('pdf')}
                            className="bg-white border border-red-100 hover:bg-red-50 text-red-600 font-medium py-2 px-4 rounded-lg shadow-sm transition-colors flex items-center gap-2"
                            title="Download as PDF"
                        >
                            <Download size={16} />
                            {selectedTables.size > 0
                                ? `PDF (${selectedTables.size})`
                                : "PDF All"}
                        </button>
                    </div>
                )}

                {/* Results Section - Table List */}
                {data && data.map((table, tableIdx) => (
                    <div key={tableIdx} className="bg-white rounded-xl shadow-sm border border-brand-border overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 mb-8">
                        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50/50 gap-4">
                            <div className="flex items-center gap-4">
                                <input
                                    type="checkbox"
                                    checked={selectedTables.has(tableIdx)}
                                    onChange={() => toggleTableSelection(tableIdx)}
                                    className="w-5 h-5 text-brand-blue rounded focus:ring-blue-500 border-gray-300 cursor-pointer"
                                />
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={table.name || `Table ${tableIdx + 1}`}
                                        onChange={(e) => {
                                            const newData = [...data];
                                            newData[tableIdx] = { ...newData[tableIdx], name: e.target.value };
                                            setData(newData);
                                        }}
                                        className="text-lg font-bold text-brand-dark bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-brand-blue focus:outline-none px-1 py-1 transition-colors w-full max-w-xs"
                                        placeholder={`Table ${tableIdx + 1}`}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 self-end sm:self-auto">
                                <button
                                    onClick={() => handleDownload(tableIdx, 'csv')}
                                    className="text-gray-500 hover:text-brand-dark p-2 transition-colors"
                                    title="Download CSV"
                                >
                                    <Download size={18} />
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

            {/* Features Section */}
            <section className="py-24 border-t border-brand-border mt-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-brand-dark">Why PicToCSV?</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto px-4">
                    <div className="text-center">
                        <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-blue">
                            <Bot size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-brand-dark mb-3">AI-Powered Extraction</h3>
                        <p className="text-brand-muted leading-relaxed">
                            Our AI understands context, handwriting, and complex table structures, extracting data with high precision where traditional OCR fails.
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="bg-amber-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-amber-600">
                            <Zap size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-brand-dark mb-3">Lightning Fast</h3>
                        <p className="text-brand-muted leading-relaxed">
                            Get comprehensive Excel spreadsheets from your images or PDFs in seconds. Save hours of manual data entry.
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-green-600">
                            <Lock size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-brand-dark mb-3">100% Private</h3>
                        <p className="text-brand-muted leading-relaxed">
                            Your documents are processed securely in-memory and are permanently deleted immediately after the analysis is complete.
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="bg-purple-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-purple-600">
                            <Smartphone size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-brand-dark mb-3">Works Everywhere</h3>
                        <p className="text-brand-muted leading-relaxed">
                            Fully responsive and cloud-based. Extract data on any device - desktop, tablet, or mobile. No installation needed.
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 border-t border-brand-border bg-slate-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-brand-dark">Frequently Asked Questions</h2>
                    </div>

                    <div className="space-y-12">
                        <div>
                            <h3 className="text-lg font-bold text-brand-dark mb-3">How does the image to Excel conversion work?</h3>
                            <p className="text-brand-muted leading-relaxed">
                                Unlike simple OCR tools that just read text, our AI analyzes the visual structure of your document to identify rows, columns, and headers, reconstructing them perfectly into an editable Excel file.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-brand-dark mb-3">Is my data safe?</h3>
                            <p className="text-brand-muted leading-relaxed">
                                Yes, absolutely. We prioritize your privacy. Files uploaded to PicToCSV are processed in temporary memory and are permanently deleted immediately after the analysis is complete. We do not store, share, or use your documents to train our models.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-brand-dark mb-3">What file formats do you support?</h3>
                            <p className="text-brand-muted leading-relaxed">
                                We currently support PDF documents, standard image formats (JPG, PNG), and text files. You can also paste text directly.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-brand-dark mb-3">Is this tool free?</h3>
                            <p className="text-brand-muted leading-relaxed">
                                Yes, PicToCSV is currently free to use for standard conversions. We optimize for efficiency to keep costs low and pass the value to you.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feedback Summary - Bottom Position */}
            <div className="max-w-2xl mx-auto px-4 pb-8">
                <FeedbackSummary />
            </div>

            {/* Floating Action Button - Mobile Only */}
            <FloatingActionButton
                onFileSelect={handleFileSelect}
                onCameraClick={handleCameraSelect}
            />

            {/* Post-Conversion Feedback */}
            {showFeedback && (
                <PostConversionFeedback onClose={() => setShowFeedback(false)} />
            )}

            {/* Achievement Badge Display */}
            {showBadge && (
                <AchievementBadge
                    badge={showBadge}
                    onDismiss={() => setShowBadge(null)}
                />
            )}

            {/* Onboarding Tutorial */}
            <OnboardingTutorial onComplete={() => { }} />

            {/* Contact Modal */}
            <ContactModal
                isOpen={showContactModal}
                onClose={() => setShowContactModal(false)}
            />
        </div>
    );
}
