import React, { useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { ImageAsset } from '../types';

interface ImageUploadProps {
  label: string;
  onImageSelect: (file: File, base64: string) => void;
  onRemove: () => void;
  currentImage: ImageAsset | null;
  compact?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  label, 
  onImageSelect, 
  onRemove, 
  currentImage,
  compact = false 
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`relative flex flex-col ${compact ? 'h-40' : 'h-64'} w-full`}>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {currentImage ? (
        <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-700 group">
          <img 
            src={currentImage.previewUrl} 
            alt="Preview" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <button 
              onClick={onRemove}
              className="p-2 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs font-medium text-white backdrop-blur-sm">
            {label}
          </div>
        </div>
      ) : (
        <div 
          onClick={() => inputRef.current?.click()}
          className="flex-1 border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-800/50 hover:bg-slate-800 transition-all rounded-2xl flex flex-col items-center justify-center cursor-pointer group"
        >
          <div className="p-4 rounded-full bg-slate-900/50 group-hover:scale-110 transition-transform duration-300 mb-3">
             <Upload className="text-indigo-400 group-hover:text-indigo-300" size={compact ? 24 : 32} />
          </div>
          <span className="text-slate-400 font-medium text-sm group-hover:text-white transition-colors">{label}</span>
          <span className="text-slate-500 text-xs mt-1">Click to browse</span>
        </div>
      )}
    </div>
  );
};