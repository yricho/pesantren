'use client';

import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut, Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { saveAs } from 'file-saver';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set worker path for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface EbookReaderProps {
  params: {
    id: string;
  };
}

export default function EbookReader({ params }: EbookReaderProps) {
  const [ebook, setEbook] = useState<any>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEbook();
  }, [params.id]);

  const fetchEbook = async () => {
    try {
      const response = await fetch(`/api/ebooks/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setEbook(data);
      }
    } catch (error) {
      console.error('Error fetching ebook:', error);
    } finally {
      setLoading(false);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 2.0));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  const handleDownload = () => {
    if (ebook) {
      saveAs(ebook.fileUrl, `${ebook.title}.pdf`);
      // Update download count
      fetch(`/api/ebooks/${params.id}/download`, { method: 'POST' });
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!ebook) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">E-Book tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-screen bg-gray-100 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-800">{ebook.title}</h1>
              <p className="text-sm text-gray-600">{ebook.author}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={handleZoomOut}
                variant="outline"
                size="sm"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              
              <span className="px-2 text-sm text-gray-600">
                {Math.round(scale * 100)}%
              </span>
              
              <Button
                onClick={handleZoomIn}
                variant="outline"
                size="sm"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              
              <Button
                onClick={toggleFullscreen}
                variant="outline"
                size="sm"
                title="Fullscreen"
              >
                {isFullscreen ? <X className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              
              <Button
                onClick={handleDownload}
                className="bg-green-600 hover:bg-green-700"
                size="sm"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-auto">
        <div className="flex justify-center py-4">
          <Document
            file={ebook.fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
              </div>
            }
            error={
              <div className="text-red-600 p-8">
                Gagal memuat PDF. Silakan coba lagi.
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="shadow-lg"
            />
          </Document>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-t">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
              variant="outline"
              size="sm"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Sebelumnya
            </Button>
            
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={pageNumber}
                onChange={(e) => {
                  const page = parseInt(e.target.value);
                  if (page > 0 && page <= numPages) {
                    setPageNumber(page);
                  }
                }}
                className="w-16 px-2 py-1 text-center border rounded"
                min="1"
                max={numPages}
              />
              <span className="text-sm text-gray-600">
                dari {numPages} halaman
              </span>
            </div>
            
            <Button
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
              variant="outline"
              size="sm"
            >
              Selanjutnya
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}