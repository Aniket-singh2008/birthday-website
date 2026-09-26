import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, FileText, ExternalLink } from 'lucide-react';
import { MediaItem } from '../../types/template';

interface MediaPreviewProps {
  media: MediaItem;
  className?: string;
  autoPlayVideo?: boolean;
  showDetails?: boolean;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({
  media,
  className = '',
  autoPlayVideo = false,
  showDetails = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlayVideo);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration || 0);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, [media.url]);

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
    const targetTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const toggleFullscreen = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // 1. VIDEO PREVIEW
  if (media.type === 'video') {
    return (
      <div
        className={`relative rounded-2xl overflow-hidden bg-black flex flex-col items-center justify-center group ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <video
          ref={videoRef}
          src={media.url}
          playsInline
          muted={isMuted}
          autoPlay={autoPlayVideo}
          className="w-full h-auto max-h-[480px] object-contain select-none"
          onClick={togglePlay}
        />

        {/* Video Control Bar Overlay */}
        <div
          className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 pt-6 flex flex-col gap-1.5 transition-opacity duration-200 ${
            isHovered || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Progress Slider */}
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />

          <div className="flex items-center justify-between text-white text-xs font-mono">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlay}
                className="p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              </button>
              <button
                type="button"
                onClick={toggleMute}
                className="p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <span className="text-[11px] text-white/90">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Big Center Play Button when paused */}
        {!isPlaying && (
          <button
            type="button"
            onClick={togglePlay}
            className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-purple-600/85 hover:bg-purple-600 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer backdrop-blur-xs"
            title="Play Video"
          >
            <Play className="w-7 h-7 fill-current translate-x-0.5" />
          </button>
        )}
      </div>
    );
  }

  // 2. GIF PREVIEW (Explicitly preserves animation loop without static flattening)
  if (media.type === 'gif') {
    return (
      <div className={`relative rounded-2xl overflow-hidden bg-slate-900/5 flex items-center justify-center ${className}`}>
        <img
          src={media.url}
          alt={media.caption || media.filename || 'Animated GIF'}
          className="w-full h-auto max-h-[480px] object-contain select-none"
          loading="eager"
        />
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-purple-600/90 text-white font-mono font-bold text-[10px] tracking-wider uppercase shadow-xs pointer-events-none">
          GIF
        </div>
      </div>
    );
  }

  // 3. IMAGE PREVIEW (JPG, PNG, WEBP, SVG)
  return (
    <div className={`relative rounded-2xl overflow-hidden bg-slate-900/5 flex items-center justify-center ${className}`}>
      <img
        src={media.url}
        alt={media.caption || media.filename || 'Uploaded image'}
        className="w-full h-auto max-h-[480px] object-contain select-none"
      />
      {showDetails && (
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white font-mono text-[10px] uppercase shadow-xs pointer-events-none">
          {media.mimeType.split('/')[1] || 'IMAGE'}
        </div>
      )}
    </div>
  );
};
