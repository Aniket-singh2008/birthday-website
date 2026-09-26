import React, { useState } from 'react';
import { Plus, Search, Filter, Sparkles, LayoutGrid, List as ListIcon, Film, PlayCircle, Image as ImageIcon } from 'lucide-react';
import { TemplateItem, MediaType } from '../../types/template';
import { TemplateCard } from './TemplateCard';

interface TemplateListProps {
  templates: TemplateItem[];
  onSelectTemplate: (template: TemplateItem) => void;
  onEditTemplate: (template: TemplateItem) => void;
  onDuplicateTemplate: (template: TemplateItem) => void;
  onDeleteTemplate: (template: TemplateItem) => void;
  onCreateNewTemplate: () => void;
  className?: string;
}

export const TemplateList: React.FC<TemplateListProps> = ({
  templates,
  onSelectTemplate,
  onEditTemplate,
  onDuplicateTemplate,
  onDeleteTemplate,
  onCreateNewTemplate,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | MediaType>('all');

  // Filter templates by search and media type
  const filteredTemplates = templates.filter((tmpl) => {
    const matchesSearch =
      tmpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tmpl.subtitle && tmpl.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedFilter === 'all') return true;
    return tmpl.media.some((m) => m.type === selectedFilter);
  });

  return (
    <div className={`w-full max-w-5xl mx-auto flex flex-col gap-6 ${className}`}>
      {/* Header with Title and Prominent "Create New Template" Action */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/95 backdrop-blur-xs p-5 rounded-3xl border border-slate-200/90 shadow-xs">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
              Dynamic Template Studio
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-display">
            Create, duplicate, and manage templates with universal Image, GIF & Video media boxes.
          </p>
        </div>

        {/* Global Prominent Action: Create New Template */}
        <button
          type="button"
          onClick={onCreateNewTemplate}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 hover:from-purple-700 hover:to-pink-600 text-white font-display font-bold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Template</span>
        </button>
      </div>

      {/* Search and Media Type Filter Controls */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-display focus:outline-hidden focus:border-purple-600"
          />
        </div>

        {/* Media Type Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-display font-semibold transition-all cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            All ({templates.length})
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('video')}
            className={`px-3 py-1.5 rounded-xl text-xs font-display font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              selectedFilter === 'video'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Videos</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('gif')}
            className={`px-3 py-1.5 rounded-xl text-xs font-display font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              selectedFilter === 'gif'
                ? 'bg-pink-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>GIFs</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('image')}
            className={`px-3 py-1.5 rounded-xl text-xs font-display font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              selectedFilter === 'image'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Images</span>
          </button>
        </div>
      </div>

      {/* Grid of Templates */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onView={() => onSelectTemplate(template)}
              onEdit={() => onEditTemplate(template)}
              onDuplicate={() => onDuplicateTemplate(template)}
              onDelete={() => onDeleteTemplate(template)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="w-full py-16 bg-white rounded-3xl border border-slate-200 text-center flex flex-col items-center justify-center p-6 gap-3">
          <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            <LayoutGrid className="w-7 h-7" />
          </div>
          <h3 className="font-display font-bold text-slate-800 text-lg">
            No Templates Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm">
            {searchQuery
              ? `No templates matching "${searchQuery}". Try a different keyword.`
              : 'You have no templates matching this filter. Create a new one now!'}
          </p>
          <button
            type="button"
            onClick={onCreateNewTemplate}
            className="mt-2 px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-display font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            + Create New Template
          </button>
        </div>
      )}
    </div>
  );
};
