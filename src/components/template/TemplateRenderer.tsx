import React from 'react';
import { Sparkles, Film, Image as ImageIcon, PlayCircle, Plus, Copy, Edit, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
import { TemplateItem } from '../../types/template';
import { MediaPreview } from './MediaPreview';

interface TemplateRendererProps {
  template: TemplateItem;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onCreateNew?: () => void;
  onPrevTemplate?: () => void;
  onNextTemplate?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  onAddMediaClick?: () => void;
  className?: string;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  template,
  onEdit,
  onDuplicate,
  onDelete,
  onCreateNew,
  onPrevTemplate,
  onNextTemplate,
  hasPrev = false,
  hasNext = false,
  onAddMediaClick,
  className = '',
}) => {
  // Theme color accents
  const getThemeClasses = () => {
    switch (template.themeColor) {
      case 'pink':
        return {
          badge: 'bg-pink-100 text-pink-800 border-pink-200',
          title: 'text-pink-950',
          cardBorder: 'border-pink-200/80',
          accent: 'text-pink-600',
        };
      case 'amber':
        return {
          badge: 'bg-amber-100 text-amber-800 border-amber-200',
          title: 'text-amber-950',
          cardBorder: 'border-amber-200/80',
          accent: 'text-amber-600',
        };
      case 'emerald':
        return {
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          title: 'text-emerald-950',
          cardBorder: 'border-emerald-200/80',
          accent: 'text-emerald-600',
        };
      case 'sky':
        return {
          badge: 'bg-sky-100 text-sky-800 border-sky-200',
          title: 'text-sky-950',
          cardBorder: 'border-sky-200/80',
          accent: 'text-sky-600',
        };
      default:
        return {
          badge: 'bg-purple-100 text-purple-800 border-purple-200',
          title: 'text-purple-950',
          cardBorder: 'border-purple-200/80',
          accent: 'text-purple-600',
        };
    }
  };

  const theme = getThemeClasses();

  return (
    <div className={`w-full max-w-3xl mx-auto flex flex-col gap-6 ${className}`}>
      {/* Top Template Navigation Bar with Prev/Next and "Create New Template" */}
      <div className="w-full flex items-center justify-between gap-2 bg-white/95 backdrop-blur-xs p-3 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onPrevTemplate}
            disabled={!hasPrev}
            className={`px-3 py-1.5 rounded-xl font-display font-medium text-xs flex items-center gap-1 transition-all ${
              hasPrev
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer active:scale-95'
                : 'bg-slate-50 text-slate-300 cursor-not-allowed'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-800 font-display font-bold text-xs border border-purple-200">
            {template.name}
          </span>

          <button
            type="button"
            onClick={onNextTemplate}
            disabled={!hasNext}
            className={`px-3 py-1.5 rounded-xl font-display font-medium text-xs flex items-center gap-1 transition-all ${
              hasNext
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer active:scale-95'
                : 'bg-slate-50 text-slate-300 cursor-not-allowed'
            }`}
          >
            <span className="hidden sm:inline">Next</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Global Prominent Action: Create New Template */}
        <div className="flex items-center gap-1.5">
          {onCreateNew && (
            <button
              type="button"
              onClick={onCreateNew}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-display font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Template</span>
            </button>
          )}

          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-700 transition-colors cursor-pointer"
              title="Edit Template"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}

          {onDuplicate && (
            <button
              type="button"
              onClick={onDuplicate}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-700 transition-colors cursor-pointer"
              title="Duplicate Template"
            >
              <Copy className="w-4 h-4" />
            </button>
          )}

          {onDelete && !template.isDefault && (
            <button
              type="button"
              onClick={onDelete}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-600 transition-colors cursor-pointer"
              title="Delete Template"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Template Card Container */}
      <div className={`w-full bg-white rounded-3xl border-2 ${theme.cardBorder} shadow-md overflow-hidden p-4 sm:p-8 flex flex-col gap-6`}>
        {/* Template Header */}
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${theme.badge}`}>
              {template.name}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Created {new Date(template.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h2 className={`font-display font-extrabold text-2xl sm:text-3xl ${theme.title} tracking-tight`}>
            {template.title}
          </h2>

          {template.subtitle && (
            <p className="text-slate-600 font-display font-medium text-sm sm:text-base">
              {template.subtitle}
            </p>
          )}

          {template.content && (
            <p className="text-slate-500 text-xs sm:text-sm mt-1 leading-relaxed">
              {template.content}
            </p>
          )}
        </div>

        {/* ============================================================== */}
        {/* UNIVERSAL MEDIA BOX                                            */}
        {/* ============================================================== */}
        <div className="w-full flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className={`w-4 h-4 ${theme.accent}`} />
              <h3 className="font-display font-bold text-slate-800 text-sm sm:text-base">
                Media Box
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                ({template.media.length} {template.media.length === 1 ? 'item' : 'items'})
              </span>
            </div>

            {onAddMediaClick && (
              <button
                type="button"
                onClick={onAddMediaClick}
                className="text-xs font-display font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Media</span>
              </button>
            )}
          </div>

          {template.media.length > 0 ? (
            /* Multi-Media Layout */
            <div className={`w-full ${
              template.media.length === 1
                ? 'flex flex-col items-center'
                : 'grid grid-cols-1 sm:grid-cols-2 gap-4'
            }`}>
              {template.media.map((item) => (
                <div
                  key={item.id}
                  className="w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/90 shadow-2xs p-2 flex flex-col gap-2"
                >
                  <div className="w-full overflow-hidden rounded-xl bg-black/5 flex items-center justify-center">
                    <MediaPreview media={item} showDetails autoPlayVideo={false} />
                  </div>
                  {item.caption && (
                    <p className="text-xs font-display text-slate-600 px-1 truncate">
                      {item.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Empty Media Box State */
            <div
              onClick={onAddMediaClick}
              className="w-full py-10 sm:py-14 rounded-2xl border-2 border-dashed border-slate-300 hover:border-purple-400 bg-slate-50/70 hover:bg-slate-50 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center p-4"
            >
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shadow-2xs mb-1">
                <Plus className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-slate-800 text-sm sm:text-base">
                No Media in this Box Yet
              </h4>
              <p className="text-xs text-slate-500 max-w-xs">
                Tap here to add an Image (JPG, PNG, WEBP), animated GIF, or Video (MP4, WEBM).
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
