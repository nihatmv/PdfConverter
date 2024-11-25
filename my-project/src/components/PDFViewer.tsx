import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { FileUp, ChevronLeft, ChevronRight } from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function PDFViewer() {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isDragging, setIsDragging] = useState(false);

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { files } = event.target;
    if (files && files[0]) {
      setFile(files[0]);
      setPageNumber(1);
    }
  }

  function onDrop(event: React.DragEvent) {
    event.preventDefault();
    setIsDragging(false);
    const { files } = event.dataTransfer;
    if (files && files[0]) {
      setFile(files[0]);
      setPageNumber(1);
    }
  }

  function onDragOver(event: React.DragEvent) {
    event.preventDefault();
    setIsDragging(true);
  }

  function onDragLeave() {
    setIsDragging(false);
  }

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left side - File input */}
      <div className="w-1/3 p-6 border-r border-gray-200 bg-white">
        <div
          className={`h-96 border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6 transition-colors ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
        >
          <FileUp className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-700 mb-2">
            {file ? file.name : "Drop your PDF here"}
          </p>
          <p className="text-sm text-gray-500 mb-4">or</p>
          <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
            Choose file
            <input
              type="file"
              accept=".pdf"
              onChange={onFileChange}
              className="hidden"
            />
          </label>
        </div>

        {file && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              File Details
            </h3>
            <p className="text-sm text-gray-500">Name: {file.name}</p>
            <p className="text-sm text-gray-500">
              Size: {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}
      </div>

      {/* Right side - PDF viewer */}
      <div className="w-2/3 p-6 bg-gray-50">
        {file ? (
          <div className="flex flex-col items-center">
            <Document
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              className="max-w-full"
            >
              <Page
                pageNumber={pageNumber}
                className="shadow-lg rounded-lg overflow-hidden"
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            </Document>

            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={() => changePage(-1)}
                disabled={pageNumber <= 1}
                className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-transparent"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <p className="text-gray-700">
                Page {pageNumber} of {numPages}
              </p>
              <button
                onClick={() => changePage(1)}
                disabled={pageNumber >= numPages}
                className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-transparent"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <p>Select a PDF file to view its contents</p>
          </div>
        )}
      </div>
    </div>
  );
}
