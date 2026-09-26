import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Film, PlayCircle, Link as LinkIcon, AlertCircle, Loader2 } from 'lucide-react';
import { MediaItem, MediaType } from '../../types/template';

interface MediaUploaderProps {
  onMediaUploaded: (media: Omit<MediaItem, 'id' | 'createdAt'>) => void;
  className?: string;
  buttonLabel?: string;
  allowMultiple?: boolean;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  onMediaUploaded,
  className = '',
  buttonLabel = 'Add Media',
  allowMultiple = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [urlMediaType, setUrlMediaType] = useState<MediaType>('gif');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [acceptedTypesFilter, setAcceptedTypesFilter] = useState<string>('image/*,video/*,.gif');

  // Trigger file picker with specific media focus
  const triggerPicker = (typeFilter: string) => {
    setAcceptedTypesFilter(typeFilter);
    setErrorMessage(null);
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 50);
  };

  const detectMediaType = (file: File): MediaType => {
    if (file.type.includes('gif') || file.name.toLowerCase().endsWith('.gif')) {
      return 'gif';
    }
    if (file.type.startsWith('video/') || /\.(mp4|webm|mov|m4v)$/i.test(file.name)) {
      return 'video';
    }
    return 'image';
  };

  const processFile = async (file: File) => {
    // 50MB file size limit
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setErrorMessage(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max size is 50MB.`);
      return;
    }

    const type = detectMediaType(file);
    setIsUploading(true);
    setUploadProgress(`Loading ${file.name}...`);
    setErrorMessage(null);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        onMediaUploaded({
          type,
          url: dataUrl,
          filename: file.name,
          mimeType: file.type || (type === 'video' ? 'video/mp4' : type === 'gif' ? 'image/gif' : 'image/jpeg'),
          size: file.size,
          caption: file.name.replace(/\.[^/.]+$/, ''),
        });
        setIsUploading(false);
        setUploadProgress('');
      };
      reader.onerror = () => {
        setErrorMessage('Failed to read media file. Please try again.');
        setIsUploading(false);
        setUploadProgress('');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setErrorMessage('Error reading media file.');
      setIsUploading(false);
      setUploadProgress('');
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (allowMultiple) {
      Array.from(files).forEach((f) => processFile(f));
    } else {
      processFile(files[0]);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  // URL Submit
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    let detected: MediaType = urlMediaType;
    const lower = urlInput.toLowerCase();
    if (lower.endsWith('.gif') || lower.includes('giphy.com') || lower.includes('tenor.com')) {
      detected = 'gif';
    } else if (lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.mov')) {
      detected = 'video';
    }

    onMediaUploaded({
      type: detected,
      url: urlInput.trim(),
      filename: urlInput.split('/').pop() || 'web_media',
      mimeType: detected === 'video' ? 'video/mp4' : detected === 'gif' ? 'image/gif' : 'image/jpeg',
      size: 0,
      caption: 'Online Media',
    });

    setUrlInput('');
    setIsUrlModalOpen(false);
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypesFilter}
        multiple={allowMultiple}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {/* Main Drag-and-Drop Area & Selector */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full rounded-2xl border-2 border-dashed p-4 sm:p-6 transition-all text-center flex flex-col items-center justify-center ${
          isDragOver
            ? 'border-purple-500 bg-purple-50/80 scale-[1.01]'
            : 'border-slate-300 hover:border-purple-400 bg-slate-50/70 hover:bg-slate-50'
        }`}
      >
        {isUploading ? (
          <div className="py-6 flex flex-col items-center justify-center text-purple-700">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <span className="font-display font-semibold text-sm">{uploadProgress || 'Uploading media...'}</span>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-purple-100 border border-purple-300 flex items-center justify-center text-purple-600 mb-3 shadow-2xs">
              <Upload className="w-6 h-6" />
            </div>

            <h4 className="font-display font-bold text-slate-800 text-sm sm:text-base">
              {buttonLabel}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">
              Drag & drop or choose media type below
            </p>

            {/* Quick Media Action Options */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => triggerPicker('image/*')}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-slate-700 hover:text-purple-700 font-display font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
                <span>Add Image</span>
              </button>

              <button
                type="button"
                onClick={() => triggerPicker('.gif,image/gif')}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-pink-50 border border-slate-200 hover:border-pink-300 text-slate-700 hover:text-pink-700 font-display font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 cursor-pointer"
              >
                <PlayCircle className="w-3.5 h-3.5 text-pink-500" />
                <span>Add GIF</span>
              </button>

              <button
                type="button"
                onClick={() => triggerPicker('video/*,.mp4,.webm,.mov')}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 font-display font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 cursor-pointer"
              >
                <Film className="w-3.5 h-3.5 text-blue-600" />
                <span>Add Video</span>
              </button>

              <button
                type="button"
                onClick={() => setIsUrlModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 font-display font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 cursor-pointer"
                title="Paste direct URL"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Link URL</span>
              </button>
            </div>
          </>
        )}

        {errorMessage && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Paste URL Modal */}
      {isUrlModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-purple-200">
            <h3 className="font-display font-bold text-slate-800 text-base mb-1">
              Add Media from Link
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter any direct Image, GIF, or Video web link
            </p>

            <form onSubmit={handleUrlSubmit} className="flex flex-col gap-3">
              <input
                type="url"
                placeholder="https://example.com/media.gif"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-purple-600 text-sm font-mono"
                required
                autoFocus
              />

              <div className="flex items-center gap-2">
                <span className="text-xs font-display text-slate-600">Type:</span>
                {(['image', 'gif', 'video'] as MediaType[]).map((t) => (
                  <label key={t} className="flex items-center gap-1 text-xs cursor-pointer capitalize font-display">
                    <input
                      type="radio"
                      name="mediaType"
                      value={t}
                      checked={urlMediaType === t}
                      onChange={() => setUrlMediaType(t)}
                      className="accent-purple-600"
                    />
                    <span>{t}</span>
                  </label>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setIsUrlModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-display text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-display font-bold text-xs shadow-xs cursor-pointer transition-all active:scale-95"
                >
                  Add Media
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
