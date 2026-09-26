import React, { useState } from 'react';
import { Plus, Copy, LayoutTemplate, Sparkles, X, Check } from 'lucide-react';
import { TemplateItem, CreateTemplateMode, TemplateLayoutStyle } from '../../types/template';
import { getNextTemplateNumber, createTemplate, duplicateTemplate } from '../../services/templateStorage';
import { sound } from '../../services/soundEffects';

interface TemplateCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  allTemplates: TemplateItem[];
  currentTemplate?: TemplateItem | null;
  onTemplateCreated: (newTemplate: TemplateItem) => void;
}

export const TemplateCreator: React.FC<TemplateCreatorProps> = ({
  isOpen,
  onClose,
  allTemplates,
  currentTemplate,
  onTemplateCreated,
}) => {
  const [mode, setMode] = useState<CreateTemplateMode>('blank');
  const [selectedSourceId, setSelectedSourceId] = useState<string>(
    currentTemplate?.id || allTemplates[0]?.id || ''
  );
  const [titleInput, setTitleInput] = useState('');
  const [subtitleInput, setSubtitleInput] = useState('');
  const [themeColor, setThemeColor] = useState('purple');
  const [layoutStyle, setLayoutStyle] = useState<TemplateLayoutStyle>('showcase');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const nextNum = getNextTemplateNumber(allTemplates);
  const defaultGeneratedName = `Template ${nextNum}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let created: TemplateItem;

      if (mode === 'duplicate') {
        // Option 2: Duplicate Current Template
        const sourceId = currentTemplate?.id || selectedSourceId;
        created = await duplicateTemplate(sourceId);
      } else if (mode === 'from_existing') {
        // Option 3: Create From Existing Template
        const source = allTemplates.find((t) => t.id === selectedSourceId);
        created = await createTemplate({
          name: defaultGeneratedName,
          title: titleInput.trim() || `${source?.title || 'Template'} (Copy)`,
          subtitle: subtitleInput.trim() || source?.subtitle || '',
          content: source?.content || '',
          themeColor: themeColor || source?.themeColor || 'purple',
          layoutStyle: layoutStyle || source?.layoutStyle || 'showcase',
          initialMedia: source?.media || [],
        });
      } else {
        // Option 1: Create Blank Template
        created = await createTemplate({
          name: defaultGeneratedName,
          title: titleInput.trim() || `Template ${nextNum}`,
          subtitle: subtitleInput.trim() || 'Add your subtitle or story here',
          content: '',
          themeColor,
          layoutStyle,
          initialMedia: [],
        });
      }

      sound.playSuccessChime();
      onTemplateCreated(created);
      onClose();
    } catch (err) {
      console.error('Failed to create template:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-purple-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-300" />
            <div>
              <h3 className="font-display font-bold text-lg sm:text-xl leading-tight">
                Create New Template
              </h3>
              <p className="text-xs text-white/80 font-mono">
                Next available: <span className="font-bold underline">{defaultGeneratedName}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content & Mode Selector */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 flex flex-col gap-5">
          {/* 3 Main Mode Choices */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-display font-bold text-slate-700">
              Choose Template Creation Method:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMode('blank')}
                className={`p-3 rounded-2xl border-2 text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  mode === 'blank'
                    ? 'border-purple-600 bg-purple-50/80 text-purple-900 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <LayoutTemplate className="w-4 h-4 text-purple-600" />
                  {mode === 'blank' && <Check className="w-3.5 h-3.5 text-purple-600" />}
                </div>
                <span className="font-display font-bold text-xs sm:text-sm">Blank Template</span>
                <span className="text-[10px] text-slate-500 leading-tight">
                  Fresh canvas with universal media box
                </span>
              </button>

              <button
                type="button"
                onClick={() => setMode('duplicate')}
                className={`p-3 rounded-2xl border-2 text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  mode === 'duplicate'
                    ? 'border-purple-600 bg-purple-50/80 text-purple-900 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Copy className="w-4 h-4 text-purple-600" />
                  {mode === 'duplicate' && <Check className="w-3.5 h-3.5 text-purple-600" />}
                </div>
                <span className="font-display font-bold text-xs sm:text-sm">Duplicate Current</span>
                <span className="text-[10px] text-slate-500 leading-tight">
                  Copy {currentTemplate?.name || 'current'} & media
                </span>
              </button>

              <button
                type="button"
                onClick={() => setMode('from_existing')}
                className={`p-3 rounded-2xl border-2 text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  mode === 'from_existing'
                    ? 'border-purple-600 bg-purple-50/80 text-purple-900 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Plus className="w-4 h-4 text-purple-600" />
                  {mode === 'from_existing' && <Check className="w-3.5 h-3.5 text-purple-600" />}
                </div>
                <span className="font-display font-bold text-xs sm:text-sm">From Existing</span>
                <span className="text-[10px] text-slate-500 leading-tight">
                  Pick any template as blueprint
                </span>
              </button>
            </div>
          </div>

          {/* Conditional Select for 'from_existing' or 'duplicate' */}
          {(mode === 'from_existing' || (mode === 'duplicate' && !currentTemplate)) && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-display font-bold text-slate-700">
                Select Base Template:
              </label>
              <select
                value={selectedSourceId}
                onChange={(e) => setSelectedSourceId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-display text-sm focus:outline-hidden focus:border-purple-600"
              >
                {allTemplates.map((tmpl) => (
                  <option key={tmpl.id} value={tmpl.id}>
                    {tmpl.name}: {tmpl.title} ({tmpl.media.length} media)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Basic Fields */}
          {mode !== 'duplicate' && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-display font-bold text-slate-700">
                  Template Title
                </label>
                <input
                  type="text"
                  placeholder={`e.g. ${defaultGeneratedName}`}
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-display text-sm focus:outline-hidden focus:border-purple-600"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-display font-bold text-slate-700">
                  Subtitle (Optional)
                </label>
                <input
                  type="text"
                  placeholder="A short caption or description"
                  value={subtitleInput}
                  onChange={(e) => setSubtitleInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-display text-sm focus:outline-hidden focus:border-purple-600"
                />
              </div>

              {/* Theme Color Picker */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-display font-bold text-slate-700">
                  Theme Accent
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
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-display text-xs sm:text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-display font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : `Create ${defaultGeneratedName} →`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
