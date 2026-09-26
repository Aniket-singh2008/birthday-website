import React, { useState, useEffect } from 'react';
import { LayoutGrid, Plus, ArrowLeft, Loader2 } from 'lucide-react';
import { TemplateItem, MediaItem } from '../../types/template';
import {
  getAllTemplates,
  updateTemplate,
  deleteTemplate,
  duplicateTemplate,
  addMediaToTemplate,
  removeMediaFromTemplate,
  replaceMediaInTemplate,
} from '../../services/templateStorage';
import { TemplateList } from './TemplateList';
import { TemplateRenderer } from './TemplateRenderer';
import { TemplateEditor } from './TemplateEditor';
import { TemplateCreator } from './TemplateCreator';
import { sound } from '../../services/soundEffects';

type ViewMode = 'list' | 'preview' | 'edit';

interface TemplateManagerProps {
  onBackToApp?: () => void;
  className?: string;
}

export const TemplateManager: React.FC<TemplateManagerProps> = ({
  onBackToApp,
  className = '',
}) => {
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [currentTemplateId, setCurrentTemplateId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load all templates from persistent storage
  const loadTemplates = async () => {
    try {
      const items = await getAllTemplates();
      setTemplates(items);
      if (items.length > 0 && !currentTemplateId) {
        setCurrentTemplateId(items[0].id);
      }
    } catch (err) {
      console.error('Failed to load templates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const currentTemplate = templates.find((t) => t.id === currentTemplateId) || templates[0] || null;

  // View Navigation
  const handleSelectTemplate = (tmpl: TemplateItem) => {
    setCurrentTemplateId(tmpl.id);
    setViewMode('preview');
  };

  const handleEditTemplate = (tmpl: TemplateItem) => {
    setCurrentTemplateId(tmpl.id);
    setViewMode('edit');
  };

  const handleSaveEdits = async (updated: TemplateItem) => {
    const saved = await updateTemplate(updated);
    setTemplates((prev) => prev.map((t) => (t.id === saved.id ? saved : t)));
    setViewMode('preview');
  };

  const handleDuplicate = async (tmpl: TemplateItem) => {
    try {
      const duplicated = await duplicateTemplate(tmpl.id);
      setTemplates((prev) => [...prev, duplicated].sort((a, b) => a.number - b.number));
      setCurrentTemplateId(duplicated.id);
      setViewMode('preview');
      sound.playSuccessChime();
    } catch (err) {
      console.error('Failed to duplicate template:', err);
    }
  };

  const handleDelete = async (tmpl: TemplateItem) => {
    if (window.confirm(`Are you sure you want to delete ${tmpl.name}?`)) {
      await deleteTemplate(tmpl.id);
      const remaining = templates.filter((t) => t.id !== tmpl.id);
      setTemplates(remaining);
      if (remaining.length > 0) {
        setCurrentTemplateId(remaining[0].id);
      } else {
        setCurrentTemplateId(null);
      }
      setViewMode('list');
    }
  };

  const handleTemplateCreated = (newTemplate: TemplateItem) => {
    setTemplates((prev) => [...prev, newTemplate].sort((a, b) => a.number - b.number));
    setCurrentTemplateId(newTemplate.id);
    // Open the new template directly in preview or edit mode!
    setViewMode('preview');
  };

  // Next / Previous template navigation
  const currentIndex = templates.findIndex((t) => t.id === currentTemplateId);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < templates.length - 1;

  const handlePrevTemplate = () => {
    if (hasPrev) {
      setCurrentTemplateId(templates[currentIndex - 1].id);
    }
  };

  const handleNextTemplate = () => {
    if (hasNext) {
      setCurrentTemplateId(templates[currentIndex + 1].id);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center text-purple-700">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        <span className="font-display font-medium text-sm">Loading Template Studio...</span>
      </div>
    );
  }

  return (
    <div className={`w-full min-h-[85vh] flex flex-col gap-6 p-2 sm:p-4 select-none ${className}`}>
      {/* Top Universal Controls Bar */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between gap-3 bg-white/95 backdrop-blur-xs p-3 rounded-2xl border border-purple-200/90 shadow-xs">
        <div className="flex items-center gap-2">
          {viewMode !== 'list' ? (
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-display font-semibold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>All Templates ({templates.length})</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-2">
              <span className="font-display font-bold text-slate-800 text-sm">
                Template Studio
              </span>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-mono font-bold">
                {templates.length} Active
              </span>
            </div>
          )}
        </div>

        {/* Global Action: Always visible "Create New Template" button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCreatorOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 hover:from-purple-700 hover:to-pink-600 text-white font-display font-bold text-xs sm:text-sm shadow-md flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Template</span>
          </button>
        </div>
      </div>

      {/* Main View Router */}
      {viewMode === 'list' && (
        <TemplateList
          templates={templates}
          onSelectTemplate={handleSelectTemplate}
          onEditTemplate={handleEditTemplate}
          onDuplicateTemplate={handleDuplicate}
          onDeleteTemplate={handleDelete}
          onCreateNewTemplate={() => setIsCreatorOpen(true)}
        />
      )}

      {viewMode === 'preview' && currentTemplate && (
        <TemplateRenderer
          template={currentTemplate}
          onEdit={() => setViewMode('edit')}
          onDuplicate={() => handleDuplicate(currentTemplate)}
          onDelete={() => handleDelete(currentTemplate)}
          onCreateNew={() => setIsCreatorOpen(true)}
          onPrevTemplate={handlePrevTemplate}
          onNextTemplate={handleNextTemplate}
          hasPrev={hasPrev}
          hasNext={hasNext}
          onAddMediaClick={() => setViewMode('edit')}
        />
      )}

      {viewMode === 'edit' && currentTemplate && (
        <TemplateEditor
          template={currentTemplate}
          onSave={handleSaveEdits}
          onCancel={() => setViewMode('preview')}
        />
      )}

      {/* Reusable Template Creator Modal */}
      <TemplateCreator
        isOpen={isCreatorOpen}
        onClose={() => setIsCreatorOpen(false)}
        allTemplates={templates}
        currentTemplate={currentTemplate}
        onTemplateCreated={handleTemplateCreated}
      />
    </div>
  );
};
