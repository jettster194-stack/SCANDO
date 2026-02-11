import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onClose: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, onClose }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center mb-2">Upload Document</h2>
          <p className="text-gray-500 text-center mb-8">
            Upload a photo of your notebook, a screenshot, or a PDF.
          </p>

          <div
            className={`
              relative border-2 border-dashed rounded-2xl h-64 flex flex-col items-center justify-center
              transition-all duration-300 cursor-pointer group
              ${isDragging ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={inputRef}
              onChange={handleChange}
              accept="image/*,.pdf" 
              className="hidden" 
            />
            
            <div className="flex flex-col items-center gap-4 text-gray-400 group-hover:text-gray-600 transition-colors">
              <div className="p-4 bg-gray-100 rounded-full group-hover:scale-110 transition-transform duration-300">
                <UploadCloud size={32} />
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-900">Click to upload or drag and drop</p>
                <p className="text-sm mt-1">SVG, PNG, JPG or PDF (max. 10MB)</p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg text-blue-600 shadow-sm">
                <FileText size={20} />
              </div>
              <div>
                <p className="font-semibold text-blue-900 text-sm">Meeting Notes</p>
                <p className="text-blue-700 text-xs">Converts handwriting to tasks</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg text-purple-600 shadow-sm">
                <ImageIcon size={20} />
              </div>
              <div>
                <p className="font-semibold text-purple-900 text-sm">Screenshots</p>
                <p className="text-purple-700 text-xs">Extracts actions from UI/Web</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
