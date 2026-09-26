import React, { useState } from 'react';
import { Save, ArrowLeft, Sparkles, Image as ImageIcon } from 'lucide-react';
import { TemplateItem, MediaItem } from '../../types/template';
import { MediaManager } from './MediaManager';
import { sound } from '../../services/soundEffects';

interface TemplateEditorProps {
  template: TemplateItem;
  onSave: (updated: TemplateItem) => Promise<void>;
  onCancel: () => void;
  className?: string;
}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  template,
  onSave,
  onCancel,
  className = '',
}) => {
  const [name, setName] = useState(template.name);
  const [title, setTitle] = useState(template.title);
  const [subtitle, setSubtitle] = useState(template.subtitle || '');
  const [content, setContent] = useState(template.content || '');
  const [themeColor, setThemeColor] = useState(template.themeColor || 'purple');
  const [mediaList, setMediaList] = useState<MediaItem[]>(template.media);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddMedia = (mediaData: Omit<MediaItem, 'id' | 'createdAt'>) => {
    const newItem: MediaItem = {
      ...mediaData,
      id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    setMediaList((prev) => [...prev, newItem]);
    sound.playSuccessChime();
  };

  const handleReplaceMedia = (mediaId: string, newMediaData: Omit<MediaItem, 'id' | 'createdAt'>) => {
    setMediaList((prev) =>
      prev.map((m) =>
        m.id === mediaId
          ? { ...newMediaData, id: mediaId, createdAt: m.createdAt }
          : m
      )
    );
    sound.playSuccessChime();
  };

  const handleRemoveMedia = (mediaId: string) => {
    setMediaList((prev) => prev.filter((m) => m.id !== mediaId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        ...template,
        name: name.trim() || template.name,
        title: title.trim() || template.title,
        subtitle: subtitle.trim(),
        content: content.trim(),
        themeColor,
        media: mediaList,
      });
      sound.playSuccessChime();
    } catch (err) {
      console.error('Failed to save template edits:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`w-full max-w-3xl mx-auto flex flex-col gap-6 ${className}`}>
      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between gap-3 bg-white/95 backdrop-blur-xs p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-display font-medium text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-slate-800 text-sm">
            Editing {template.name}
          </span>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSaving}
          className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-display font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Editor Form Card */}
      <form onSubmit={handleSubmit} className="w-full bg-white rounded-3xl border border-slate-200 shadow-md p-5 sm:p-8 flex flex-col gap-6">
        {/* Basic Metadata */}
        <div className="flex flex-col gap-4">
          <h3 className="font-display font-bold text-slate-800 text-base flex items-center gap-2 border-b border-slate-100 pb-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Template Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-display font-bold text-slate-700">
                Template Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-display text-sm focus:outline-hidden focus:border-purple-600"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-display font-bold text-slate-700">
                Main Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-display text-sm focus:outline-hidden focus:border-purple-600"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-display font-bold text-slate-700">
              Subtitle
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-display text-sm focus:outline-hidden focus:border-purple-600"
              placeholder="A short descriptive line"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-display font-bold text-slate-700">
              Description / Notes
            </label>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-display text-sm focus:outline-hidden focus:border-purple-600"
              placeholder="Add your story or notes for this template"
            />
          </div>

          {/* Theme Color Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-display font-bold text-slate-700">
              Accent Theme
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { id: 'purple', label: 'Purple', bg: 'bg-purple-500' },
                { id: 'pink', label: 'Pink', bg: 'bg-pink-500' },
                { id: 'amber', label: 'Amber', bg: 'bg-amber-500' },
                { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-500' },
                { id: 'sky', label: 'Sky', bg: 'bg-sky-500' },
              ].map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setThemeColor(color.id)}
                  className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-display font-semibold transition-all cursor-pointer ${
                    themeColor === color.id
                      ? 'border-purple-600 ring-2 ring-purple-200 bg-white'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${color.bg}`} />
                  <span>{color.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* UNIVERSAL MEDIA BOX (EMBEDDED)                                 */}
        {/* ============================================================== */}
        <div className="flex flex-col gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-slate-800 text-base flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-purple-600" />
              <span>Universal Media Box</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {mediaList.length} media items
            </span>
          </div>

          <MediaManager
            mediaList={mediaList}
            onAddMedia={handleAddMedia}
            onReplaceMedia={handleReplaceMedia}
            onRemoveMedia={handleRemoveMedia}
            isEditable={true}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-display text-sm cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-display font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Template'}
          </button>
        </div>
      </form>
    </div>
  );
};
