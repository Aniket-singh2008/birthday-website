import React, { useState, useEffect, useRef } from 'react';
import {
  Image as ImageIcon,
  Film,
  PlayCircle,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Upload,
  Link as LinkIcon,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { MediaSlotConfig, MediaSlotType } from '../config/referenceMediaConfig';
import { getMediaSlot, saveMediaSlot } from '../services/referenceMediaStorage';
import { sound } from '../services/soundEffects';

interface UniversalMediaSlotProps {
  slotId: string;
  shape: 'rectangle' | 'heart';
  onMediaChanged?: () => void;
}

export const UniversalMediaSlot: React.FC<UniversalMediaSlotProps> = ({
  slotId,
  shape,
  onMediaChanged,
}) => {
  const [slot, setSlot] = useState<MediaSlotConfig>(() => getMediaSlot(slotId));
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [urlType, setUrlType] = useState<MediaSlotType>('image');

  // Video playback states
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [acceptedFilter, setAcceptedFilter] = useState('image/*,video/*,.gif');

  // Sync from storage on mount
  useEffect(() => {
    setSlot(getMediaSlot(slotId));
  }, [slotId]);

  // Handle Video Events
  useEffect(() => {
    const video = videoRef.current;
    if (!video || slot.type !== 'video') return;

    const handleTime = () => setCurrentTime(video.currentTime);
    const handleMeta = () => setDuration(video.duration || 0);
    const handleEnd = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTime);
    video.addEventListener('loadedmetadata', handleMeta);
    video.addEventListener('ended', handleEnd);

    return () => {
      video.removeEventListener('timeupdate', handleTime);
      video.removeEventListener('loadedmetadata', handleMeta);
      video.removeEventListener('ended', handleEnd);
    };
  }, [slot.source, slot.type]);

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const val = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const toggleFullscreen = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current?.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Trigger File Picker
  const triggerPicker = (filter: string) => {
    setAcceptedFilter(filter);
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 50);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isGif = file.type.includes('gif') || file.name.toLowerCase().endsWith('.gif');
      const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|m4v)$/i.test(file.name);
      const detectedType: MediaSlotType = isVideo ? 'video' : isGif ? 'gif' : 'image';

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const updated: MediaSlotConfig = {
          ...slot,
          type: detectedType,
          source: dataUrl,
          label: file.name,
        };
        setSlot(updated);
        saveMediaSlot(updated);
        sound.playSuccessChime();
        onMediaChanged?.();
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  // Handle URL Form Submit
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    let detected = urlType;
    const lower = urlInput.toLowerCase();
    if (lower.endsWith('.gif') || lower.includes('giphy.com') || lower.includes('tenor.com')) {
      detected = 'gif';
    } else if (lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.mov')) {
      detected = 'video';
    }

    const updated: MediaSlotConfig = {
      ...slot,
      type: detected,
      source: urlInput.trim(),
      label: urlInput.split('/').pop() || 'online_media',
    };
    setSlot(updated);
    saveMediaSlot(updated);
    setIsUrlModalOpen(false);
    setUrlInput('');
    sound.playSuccessChime();
    onMediaChanged?.();
  };

  const handleClearMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated: MediaSlotConfig = {
      ...slot,
      source: '',
    };
    setSlot(updated);
    saveMediaSlot(updated);
    sound.playWobble();
    onMediaChanged?.();
  };

  const hasMedia = Boolean(slot.source && slot.source.trim().length > 0);

  return (
    <div
      className="relative w-full h-full group flex items-center justify-center select-none"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFilter}
        onChange={handleFileChange}
        className="hidden"
      />

      {hasMedia ? (
        /* ============================================================== */
        /* MEDIA POPULATED (IMAGE / GIF / VIDEO)                          */
        /* ============================================================== */
        <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
          {slot.type === 'video' ? (
            <div className="relative w-full h-full bg-black flex items-center justify-center">
              <video
                ref={videoRef}
                src={slot.source}
                playsInline
                autoPlay
                loop
                muted={isMuted}
                className="w-full h-full object-cover cursor-pointer"
                onClick={togglePlay}
              />

              {/* Video Overlay Control Bar */}
              <div
                className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-2 pt-4 flex flex-col gap-1 transition-opacity ${
                  showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="flex items-center justify-between text-white text-[10px] font-mono">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="p-1 hover:bg-white/20 rounded-full cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                    </button>
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="p-1 hover:bg-white/20 rounded-full cursor-pointer"
                    >
                      {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                    </button>
                    <span>
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    className="p-1 hover:bg-white/20 rounded-full cursor-pointer"
                  >
                    <Maximize2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {!isPlaying && (
                <button
                  type="button"
                  onClick={togglePlay}
                  className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-purple-600/85 hover:bg-purple-600 text-white flex items-center justify-center shadow-lg cursor-pointer active:scale-95"
                >
                  <Play className="w-5 h-5 fill-current translate-x-0.5" />
                </button>
              )}
            </div>
          ) : slot.type === 'gif' ? (
            <div className="relative w-full h-full flex items-center justify-center bg-slate-50">
              <img
                src={slot.source}
                alt="Animated GIF"
                className="w-full h-full object-cover select-none"
              />
              <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-pink-500/90 text-white font-mono text-[9px] font-bold uppercase shadow-2xs pointer-events-none">
                GIF
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center bg-slate-50">
              <img
                src={slot.source}
                alt="Uploaded Content"
                className="w-full h-full object-cover select-none"
              />
            </div>
          )}

          {/* Quick Hover Controls (Replace / Remove) */}
          <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-30">
            <button
              type="button"
              onClick={() => triggerPicker('image/*,video/*,.gif')}
              className="px-2 py-1 rounded-full bg-black/75 hover:bg-black/90 text-white font-display text-[10px] flex items-center gap-1 shadow-md cursor-pointer active:scale-95"
              title="Replace Media"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              <span>Replace</span>
            </button>
            <button
              type="button"
              onClick={handleClearMedia}
              className="p-1 rounded-full bg-rose-600/80 hover:bg-rose-600 text-white shadow-md cursor-pointer active:scale-95"
              title="Clear Slot"
            >
              <Trash2 className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>
      ) : (
        /* ============================================================== */
        /* BLANK CONTENT AREA (CUSTOMIZABLE MEDIA SLOT)                   */
        /* Supports: Image, Video, GIF, URL                               */
        /* ============================================================== */
        <div className="w-full h-full bg-[#FAF8F5]/90 p-2 sm:p-3 flex flex-col items-center justify-between text-center overflow-y-auto">
          <div className="flex flex-col items-center justify-center mt-1">
            <div className="w-9 h-9 rounded-full bg-purple-100 border border-purple-300 flex items-center justify-center text-purple-600 mb-1 shadow-2xs">
              <Upload className="w-4 h-4" />
            </div>
            <h4 className="font-display font-bold text-slate-800 text-xs sm:text-sm leading-tight">
              Media Slot
            </h4>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
              Choose Image, Video, or GIF
            </p>
          </div>

          {/* 3 Dedicated Media Type Options */}
          <div className="w-full grid grid-cols-3 gap-1.5 my-1 px-1">
            <button
              type="button"
              onClick={() => triggerPicker('image/*')}
              className="py-1.5 px-1 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 font-display font-semibold text-[10px] sm:text-[11px] flex flex-col items-center gap-0.5 transition-all active:scale-95 cursor-pointer shadow-2xs"
            >
              <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
              <span>Image</span>
            </button>

            <button
              type="button"
              onClick={() => triggerPicker('video/*,.mp4,.webm,.mov')}
              className="py-1.5 px-1 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 font-display font-semibold text-[10px] sm:text-[11px] flex flex-col items-center gap-0.5 transition-all active:scale-95 cursor-pointer shadow-2xs"
            >
              <Film className="w-3.5 h-3.5 text-blue-600" />
              <span>Video</span>
            </button>

            <button
              type="button"
              onClick={() => triggerPicker('.gif,image/gif')}
              className="py-1.5 px-1 rounded-xl bg-pink-50 hover:bg-pink-100 border border-pink-200 text-pink-800 font-display font-semibold text-[10px] sm:text-[11px] flex flex-col items-center gap-0.5 transition-all active:scale-95 cursor-pointer shadow-2xs"
            >
              <PlayCircle className="w-3.5 h-3.5 text-pink-500" />
              <span>GIF</span>
            </button>
          </div>

          {/* Link Input Option */}
          <button
            type="button"
            onClick={() => setIsUrlModalOpen(true)}
            className="text-[10px] text-purple-700 hover:text-purple-900 font-display font-medium flex items-center gap-1 cursor-pointer underline pb-1"
          >
            <LinkIcon className="w-2.5 h-2.5" />
            <span>Or paste web URL</span>
          </button>
        </div>
      )}

      {/* URL Input Modal */}
      {isUrlModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-4 w-full max-w-xs shadow-2xl border border-purple-200">
            <h4 className="font-display font-bold text-slate-800 text-sm mb-1">
              Add Media Link
            </h4>
            <p className="text-[11px] text-slate-500 mb-2">
              Paste direct URL for Image, Video, or GIF
            </p>

            <form onSubmit={handleUrlSubmit} className="flex flex-col gap-2.5">
              <input
                type="url"
                placeholder="https://.../media.mp4"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono text-xs focus:outline-hidden focus:border-purple-600"
                autoFocus
                required
              />

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-display text-slate-600">Type:</span>
                {(['image', 'video', 'gif'] as MediaSlotType[]).map((t) => (
                  <label key={t} className="flex items-center gap-1 text-[11px] capitalize font-display cursor-pointer">
                    <input
                      type="radio"
                      name="mediaType"
                      value={t}
                      checked={urlType === t}
                      onChange={() => setUrlType(t)}
                      className="accent-purple-600"
                    />
                    <span>{t}</span>
                  </label>
                ))}
              </div>

              <div className="flex items-center justify-end gap-1.5 mt-1">
                <button
                  type="button"
                  onClick={() => setIsUrlModalOpen(false)}
                  className="px-3 py-1 rounded-lg text-slate-600 hover:bg-slate-100 font-display text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-display font-bold text-xs shadow-2xs cursor-pointer active:scale-95"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
