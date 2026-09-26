import React from 'react';
import { Play, Copy, Edit, Trash2, Eye, Film, Image as ImageIcon, PlayCircle } from 'lucide-react';
import { TemplateItem } from '../../types/template';

interface TemplateCardProps {
  template: TemplateItem;
  onView: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
}) => {
  const firstMedia = template.media[0];

  const getMediaSummary = () => {
    const videoCount = template.media.filter((m) => m.type === 'video').length;
    const gifCount = template.media.filter((m) => m.type === 'gif').length;
    const imgCount = template.media.filter((m) => m.type === 'image').length;

    const parts = [];
    if (imgCount > 0) parts.push(`${imgCount} img`);
    if (gifCount > 0) parts.push(`${gifCount} gif`);
    if (videoCount > 0) parts.push(`${videoCount} vid`);
    return parts.length > 0 ? parts.join(', ') : 'Empty media box';
  };

  return (
    <div
      onClick={onView}
      className="group relative w-full bg-white rounded-3xl border border-slate-200 hover:border-purple-300 shadow-xs hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Thumbnail Banner */}
      <div className="relative w-full aspect-[16/10] bg-slate-100 overflow-hidden flex items-center justify-center">
        {firstMedia ? (
          firstMedia.type === 'video' ? (
            <div className="relative w-full h-full bg-black flex items-center justify-center">
              <video
                src={firstMedia.url}
                className="w-full h-full object-cover opacity-80"
                muted
                playsInline
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-md">
                  <Play className="w-5 h-5 fill-current translate-x-0.5" />
                </div>
              </div>
            </div>
          ) : (
            <img
              src={firstMedia.url}
              alt={template.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 flex flex-col items-center justify-center text-slate-400 gap-1 p-4">
            <ImageIcon className="w-8 h-8 text-purple-300" />
            <span className="text-[11px] font-display text-purple-400 font-medium">Empty Media Box</span>
          </div>
        )}

        {/* Template Number Badge */}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-purple-900 font-display font-extrabold text-xs shadow-xs border border-purple-200">
          {template.name}
        </div>

        {/* Media items count badge */}
        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/65 backdrop-blur-xs text-white font-mono text-[10px]">
          {getMediaSummary()}
        </div>
      </div>

      {/* Body Details */}
      <div className="p-4 flex flex-col gap-1.5 flex-1 justify-between">
        <div>
          <h4 className="font-display font-bold text-slate-800 text-base group-hover:text-purple-700 transition-colors line-clamp-1">
            {template.title}
          </h4>
          {template.subtitle && (
            <p className="text-xs text-slate-500 font-display line-clamp-1">
              {template.subtitle}
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={onView}
            className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-display font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View</span>
          </button>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onEdit}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-purple-700 transition-colors cursor-pointer"
              title="Edit Template"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onDuplicate}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-purple-700 transition-colors cursor-pointer"
              title="Duplicate Template"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            {!template.isDefault && (
              <button
                type="button"
                onClick={onDelete}
                className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                title="Delete Template"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
