import React, { useRef, useState } from 'react';
import { Camera, Plus, ZoomIn, X, Sparkles } from 'lucide-react';
import { MemoryPhotoBox } from '../config/birthdayConfig';
import { saveCustomMemoryBoxPhoto, getCustomMemoryBoxPhotos } from '../services/photoStorage';
import { sound } from '../services/soundEffects';

interface PhotoGridSectionProps {
  configuredMemories: MemoryPhotoBox[];
}

export const PhotoGridSection: React.FC<PhotoGridSectionProps> = ({ configuredMemories }) => {
  const [customPhotos, setCustomPhotos] = useState<Record<number, string>>(getCustomMemoryBoxPhotos());
  const [activeUploadBoxId, setActiveUploadBoxId] = useState<number | null>(null);
  const [zoomPhoto, setZoomPhoto] = useState<{ url: string; title: string; caption?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Guarantee 10 boxes (Photo Box 1 to Photo Box 10)
  const boxes: MemoryPhotoBox[] = Array.from({ length: 10 }, (_, index) => {
    const id = index + 1;
    const found = configuredMemories.find((m) => m.id === id);
    return {
      id,
      title: found?.title || `Photo Box ${id}`,
      image: customPhotos[id] || found?.image || '',
      caption: found?.caption || '',
      date: found?.date || '',
    };
  });

  const handleBoxClick = (box: MemoryPhotoBox) => {
    sound.playPop();
    if (box.image) {
      setZoomPhoto({
        url: box.image,
        title: box.title,
        caption: box.caption,
      });
    } else {
      setActiveUploadBoxId(box.id);
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeUploadBoxId !== null) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        saveCustomMemoryBoxPhoto(activeUploadBoxId, dataUrl);
        setCustomPhotos(getCustomMemoryBoxPhotos());
        sound.playSuccessChime();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="w-full my-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Section Title */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-800 tracking-tight">
              Memory Collection
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-handwritten text-purple-700/80 text-base mt-0.5">
            10 dedicated memory boxes to cherish forever ✨
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
          10 Boxes
        </span>
      </div>

      {/* Responsive Grid:
          Mobile: 2 columns
          Tablet: 3 columns
          Desktop: 4 columns
      */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4.5">
        {boxes.map((box) => {
          const hasImage = Boolean(box.image);

          return (
            <div
              key={box.id}
              onClick={() => handleBoxClick(box)}
              className="group relative aspect-[4/5] rounded-2xl bg-white/90 border-2 border-purple-100 hover:border-purple-300 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col items-center justify-center p-2.5 cursor-pointer"
            >
              {hasImage ? (
                /* Filled Image State */
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-purple-50">
                  <img
                    src={box.image}
                    alt={box.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                  {/* Badge & Title overlay */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-xs text-[10px] font-semibold text-white tracking-wide">
                    {box.title}
                  </div>

                  <div className="absolute bottom-2 left-2 right-2 text-left">
                    {box.caption && (
                      <p className="text-white text-xs font-handwritten text-base leading-tight drop-shadow-sm line-clamp-1">
                        {box.caption}
                      </p>
                    )}
                  </div>

                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/70 backdrop-blur-xs flex items-center justify-center text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-3.5 h-3.5" />
                  </div>
                </div>
              ) : (
                /* Subtle Clean "Add Memory" Placeholder (No random stock photos) */
                <div className="w-full h-full rounded-xl border border-dashed border-purple-200 hover:border-purple-400 bg-purple-50/40 hover:bg-purple-100/40 flex flex-col items-center justify-center text-center p-3 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-white border border-purple-200 shadow-xs flex items-center justify-center text-purple-500 mb-2 group-hover:scale-110 transition-transform">
                    <Plus className="w-5 h-5 text-purple-600" />
                  </div>

                  <span className="font-display font-bold text-slate-700 text-xs sm:text-sm">
                    {box.title}
                  </span>

                  <span className="font-handwritten text-purple-600 text-sm sm:text-base mt-0.5">
                    Add Memory
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Image Zoom Modal */}
      {zoomPhoto && (
        <div
          onClick={() => setZoomPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-sm animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#FFFEFA] border-2 border-purple-200 rounded-3xl p-4 sm:p-6 scrapbook-shadow-lg relative text-center"
          >
            <button
              onClick={() => setZoomPhoto(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-800 flex items-center justify-center border border-purple-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-display font-bold text-slate-800 text-lg mb-2">
              {zoomPhoto.title}
            </h3>

            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-purple-100 mb-3 bg-slate-100">
              <img
                src={zoomPhoto.url}
                alt={zoomPhoto.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>

            {zoomPhoto.caption && (
              <p className="font-handwritten text-purple-800 text-lg leading-snug">
                {zoomPhoto.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
