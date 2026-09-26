import React, { useState, useRef } from 'react';
import { Trash2, RefreshCw, Plus, FileText, Image as ImageIcon, Film, PlayCircle } from 'lucide-react';
import { MediaItem, MediaType } from '../../types/template';
import { MediaPreview } from './MediaPreview';
import { MediaUploader } from './MediaUploader';

interface MediaManagerProps {
  mediaList: MediaItem[];
  onAddMedia: (media: Omit<MediaItem, 'id' | 'createdAt'>) => void;
  onReplaceMedia: (mediaId: string, newMedia: Omit<MediaItem, 'id' | 'createdAt'>) => void;
  onRemoveMedia: (mediaId: string) => void;
  isEditable?: boolean;
  className?: string;
}

export const MediaManager: React.FC<MediaManagerProps> = ({
  mediaList,
  onAddMedia,
  onReplaceMedia,
  onRemoveMedia,
  isEditable = true,
  className = '',
}) => {
  const [replacingId, setReplacingId] = useState<string | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getTypeBadge = (type: MediaType) => {
    switch (type) {
      case 'video':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-mono font-bold uppercase">
            <Film className="w-3 h-3" />
            <span>Video</span>
          </span>
        );
      case 'gif':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-pink-100 text-pink-800 text-[10px] font-mono font-bold uppercase">
            <PlayCircle className="w-3 h-3" />
            <span>GIF</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-mono font-bold uppercase">
            <ImageIcon className="w-3 h-3" />
            <span>Image</span>
          </span>
        );
    }
  };

  const handleStartReplace = (id: string) => {
    setReplacingId(id);
    replaceInputRef.current?.click();
  };

  const handleReplaceFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && replacingId) {
      const isGif = file.type.includes('gif') || file.name.toLowerCase().endsWith('.gif');
      const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov)$/i.test(file.name);
      const type: MediaType = isGif ? 'gif' : isVideo ? 'video' : 'image';

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        onReplaceMedia(replacingId, {
          type,
          url: dataUrl,
          filename: file.name,
          mimeType: file.type || (isVideo ? 'video/mp4' : isGif ? 'image/gif' : 'image/jpeg'),
          size: file.size,
          caption: file.name.replace(/\.[^/.]+$/, ''),
        });
        setReplacingId(null);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  return (
    <div className={`w-full flex flex-col gap-4 ${className}`}>
      {/* Hidden file input for single-item replace */}
      <input
        ref={replaceInputRef}
        type="file"
        accept="image/*,video/*,.gif"
        onChange={handleReplaceFile}
        className="hidden"
      />

      {/* Render existing Media Items */}
      {mediaList.length > 0 && (
        <div className="w-full flex flex-col gap-5">
          {mediaList.map((item, index) => (
            <div
              key={item.id || index}
              className="relative w-full rounded-2xl bg-white border border-slate-200/90 shadow-xs p-3 sm:p-4 flex flex-col gap-3 group"
            >
              {/* Media Preview Component */}
              <div className="w-full overflow-hidden rounded-xl bg-slate-50 flex items-center justify-center">
                <MediaPreview media={item} showDetails autoPlayVideo={false} />
              </div>

              {/* Media Info and Management Controls */}
              <div className="w-full flex items-center justify-between gap-2 pt-2 border-t border-slate-100 flex-wrap">
                <div className="flex items-center gap-2 min-w-0">
                  {getTypeBadge(item.type)}
                  <span className="text-xs font-mono font-medium text-slate-700 truncate max-w-[180px] sm:max-w-xs" title={item.filename}>
                    {item.filename || 'Untitled Media'}
                  </span>
                  {item.size > 0 && (
                    <span className="text-[11px] text-slate-400 font-mono">
                      ({formatFileSize(item.size)})
                    </span>
                  )}
                </div>

                {isEditable && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleStartReplace(item.id)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-700 text-xs font-display font-medium flex items-center gap-1 transition-colors cursor-pointer"
                      title="Replace this media"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Replace</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveMedia(item.id)}
                      className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-display font-medium flex items-center gap-1 transition-colors cursor-pointer"
                      title="Remove this media"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Media Section */}
      {isEditable && (
        <div className="w-full">
          {mediaList.length === 0 || showUploader ? (
            <div className="w-full flex flex-col gap-2">
              <MediaUploader
                onMediaUploaded={(media) => {
                  onAddMedia(media);
                  setShowUploader(false);
                }}
                buttonLabel={mediaList.length === 0 ? 'Universal Media Box (Add Image / GIF / Video)' : 'Add Another Media Item'}
                allowMultiple={true}
              />
              {mediaList.length > 0 && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setShowUploader(false)}
                    className="text-xs font-display text-slate-500 hover:text-slate-700 underline cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowUploader(true)}
              className="w-full py-3 rounded-2xl border-2 border-dashed border-purple-300 hover:border-purple-500 bg-purple-50/50 hover:bg-purple-50 text-purple-700 font-display font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Media (Image / GIF / Video)</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
