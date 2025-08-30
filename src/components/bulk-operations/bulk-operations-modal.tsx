'use client';

import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  Upload, 
  FileSpreadsheet, 
  FileText, 
  AlertCircle, 
  CheckCircle,
  X,
  FileDown,
  RefreshCw
} from 'lucide-react';
import { 
  exportToExcel, 
  exportToCSV, 
  generateExcelTemplate, 
  importFromExcel, 
  importFromCSV,
  ImportResult,
  ImportValidationRule,
  ProgressCallback
} from '@/lib/bulk-operations';

interface BulkOperationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  exportData?: any[];
  exportColumns?: { key: string; header: string; width?: number; type?: 'string' | 'number' | 'date' }[];
  importValidationRules?: ImportValidationRule[];
  templateColumns?: { key: string; header: string; width?: number; required?: boolean; example?: string }[];
  onImportComplete?: (data: any[]) => void;
  onExportFilters?: () => React.ReactNode;
}

export default function BulkOperationsModal({
  isOpen,
  onClose,
  title,
  exportData = [],
  exportColumns = [],
  importValidationRules = [],
  templateColumns = [],
  onImportComplete,
  onExportFilters
}: BulkOperationsModalProps) {
  const [activeTab, setActiveTab] = useState('export');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportExcel = async () => {
    if (!exportColumns.length || !exportData.length) {
      alert('Tidak ada data untuk diekspor');
      return;
    }

    setIsProcessing(true);
    try {
      await exportToExcel(
        exportData,
        exportColumns,
        {
          format: 'excel',
          filename: `${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.xlsx`,
          sheetName: title
        }
      );
    } catch (error) {
      console.error('Export error:', error);
      alert('Gagal mengekspor data ke Excel');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportCSV = () => {
    if (!exportColumns.length || !exportData.length) {
      alert('Tidak ada data untuk diekspor');
      return;
    }

    setIsProcessing(true);
    try {
      exportToCSV(
        exportData,
        exportColumns.map(col => ({ key: col.key, header: col.header })),
        {
          format: 'csv',
          filename: `${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`
        }
      );
    } catch (error) {
      console.error('Export error:', error);
      alert('Gagal mengekspor data ke CSV');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadTemplate = async () => {
    if (!templateColumns.length) {
      alert('Template tidak tersedia');
      return;
    }

    setIsProcessing(true);
    try {
      await generateExcelTemplate(
        templateColumns,
        `template-${title.toLowerCase().replace(/\s+/g, '-')}.xlsx`
      );
    } catch (error) {
      console.error('Template generation error:', error);
      alert('Gagal membuat template');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
      if (!validTypes.includes(file.type)) {
        alert('File harus berformat Excel (.xlsx) atau CSV (.csv)');
        return;
      }
      setSelectedFile(file);
      setImportResult(null);
    }
  };

  const handleImport = async () => {
    if (!selectedFile || !importValidationRules.length) {
      alert('Silakan pilih file dan pastikan validasi sudah dikonfigurasi');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setProgressMessage('Memproses file...');

    const progressCallback: ProgressCallback = (current, total, message) => {
      setProgress((current / total) * 100);
      if (message) setProgressMessage(message);
    };

    try {
      let result: ImportResult;
      
      if (selectedFile.type === 'text/csv') {
        result = await importFromCSV(selectedFile, importValidationRules, progressCallback);
      } else {
        result = await importFromExcel(selectedFile, importValidationRules, progressCallback);
      }

      setImportResult(result);
      setProgressMessage('Selesai');

      if (result.success && result.data && onImportComplete) {
        onImportComplete(result.data);
      }
    } catch (error) {
      console.error('Import error:', error);
      setImportResult({
        success: false,
        errors: [`Error: ${error}`],
        totalRows: 0,
        validRows: 0,
        errorRows: 0
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetImport = () => {
    setSelectedFile(null);
    setImportResult(null);
    setProgress(0);
    setProgressMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Operasi Bulk - {title}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Data
            </TabsTrigger>
            <TabsTrigger value="import" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Import Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4">
            <div className="p-4 border rounded-lg bg-blue-50">
              <h3 className="font-semibold text-blue-800 mb-2">Export Data</h3>
              <p className="text-sm text-blue-700 mb-4">
                Ekspor data yang sedang ditampilkan ke format Excel atau CSV
              </p>
              
              {onExportFilters && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Filter Export:</h4>
                  {onExportFilters()}
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleExportExcel}
                  disabled={isProcessing || !exportData.length}
                  className="flex items-center gap-2"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Export ke Excel ({exportData.length} data)
                </Button>
                
                <Button
                  onClick={handleExportCSV}
                  disabled={isProcessing || !exportData.length}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Export ke CSV ({exportData.length} data)
                </Button>
              </div>

              {!exportData.length && (
                <Alert className="mt-3">
                  <AlertCircle className="w-4 h-4" />
                  <div>Tidak ada data untuk diekspor</div>
                </Alert>
              )}
            </div>
          </TabsContent>

          <TabsContent value="import" className="space-y-4">
            <div className="p-4 border rounded-lg bg-green-50">
              <h3 className="font-semibold text-green-800 mb-2">Import Data</h3>
              <p className="text-sm text-green-700 mb-4">
                Import data dari file Excel atau CSV. Pastikan format sesuai dengan template.
              </p>

              {/* Template Download */}
              <div className="mb-4 p-3 bg-white rounded border border-green-200">
                <h4 className="font-medium mb-2">1. Download Template</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Download template Excel untuk memastikan format data sudah benar
                </p>
                <Button
                  onClick={handleDownloadTemplate}
                  disabled={isProcessing || !templateColumns.length}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <FileDown className="w-4 h-4" />
                  Download Template
                </Button>
              </div>

              {/* File Selection */}
              <div className="mb-4 p-3 bg-white rounded border border-green-200">
                <h4 className="font-medium mb-2">2. Pilih File</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Pilih file Excel (.xlsx) atau CSV (.csv) yang akan diimpor
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  {selectedFile && (
                    <Button
                      onClick={resetImport}
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      Reset
                    </Button>
                  )}
                </div>
                {selectedFile && (
                  <div className="mt-2 text-sm text-gray-600">
                    File terpilih: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </div>
                )}
              </div>

              {/* Import Button */}
              <div className="mb-4 p-3 bg-white rounded border border-green-200">
                <h4 className="font-medium mb-2">3. Import Data</h4>
                <Button
                  onClick={handleImport}
                  disabled={!selectedFile || isProcessing || !importValidationRules.length}
                  className="flex items-center gap-2"
                >
                  {isProcessing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  Import Data
                </Button>
              </div>

              {/* Progress */}
              {isProcessing && (
                <div className="space-y-2">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-gray-600">{progressMessage}</p>
                </div>
              )}

              {/* Import Results */}
              {importResult && (
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    {importResult.success ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <h4 className={`font-medium ${importResult.success ? 'text-green-800' : 'text-red-800'}`}>
                      Hasil Import
                    </h4>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{importResult.totalRows}</div>
                      <div className="text-sm text-gray-600">Total Baris</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{importResult.validRows}</div>
                      <div className="text-sm text-gray-600">Berhasil</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{importResult.errorRows}</div>
                      <div className="text-sm text-gray-600">Error</div>
                    </div>
                  </div>

                  {importResult.errors.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="font-medium text-red-800">Error Details:</h5>
                      <div className="max-h-32 overflow-y-auto bg-red-50 p-3 rounded border">
                        {importResult.errors.slice(0, 20).map((error, index) => (
                          <div key={index} className="text-sm text-red-700 mb-1">
                            {error}
                          </div>
                        ))}
                        {importResult.errors.length > 20 && (
                          <div className="text-sm text-red-600 italic">
                            ... dan {importResult.errors.length - 20} error lainnya
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {importResult.success && importResult.validRows > 0 && (
                    <Alert className="bg-green-50 border-green-200">
                      <CheckCircle className="w-4 h-4" />
                      <div>
                        Import berhasil! {importResult.validRows} data telah diproses.
                        {importResult.errorRows > 0 && (
                          <span> {importResult.errorRows} baris diabaikan karena error.</span>
                        )}
                      </div>
                    </Alert>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}