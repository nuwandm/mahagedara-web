'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Person, RootCouple } from '@/types/family';

interface SearchFilterPanelProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  genderFilter: 'all' | 'male' | 'female';
  onGenderChange: (gender: 'all' | 'male' | 'female') => void;
  generationFilter: number | 'all';
  onGenerationChange: (generation: number | 'all') => void;
  tagFilter: string[];
  onTagChange: (tags: string[]) => void;
  familyData: RootCouple;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  totalMembers: number;
}

/**
 * SearchFilterPanel Component - Mobile-First Premium Design
 *
 * Elegant search and filtering with glassmorphism effects.
 * Optimized for touch interactions and mobile devices.
 */
export default function SearchFilterPanel({
  searchQuery,
  onSearchChange,
  genderFilter,
  onGenderChange,
  generationFilter,
  onGenerationChange,
  tagFilter,
  onTagChange,
  familyData,
  onExpandAll,
  onCollapseAll,
  totalMembers,
}: SearchFilterPanelProps) {
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();

    const extractTags = (person: Person) => {
      person.tags?.forEach((tag) => tags.add(tag));
      person.spouse?.tags?.forEach((tag) => tags.add(tag));
      person.children?.forEach(extractTags);
    };

    familyData.husband.tags?.forEach((tag) => tags.add(tag));
    familyData.wife.tags?.forEach((tag) => tags.add(tag));
    familyData.children?.forEach(extractTags);

    return Array.from(tags).sort();
  }, [familyData]);

  // Calculate max generation depth
  const maxGeneration = useMemo(() => {
    let maxDepth = 0;

    const findMaxDepth = (person: Person, depth: number) => {
      maxDepth = Math.max(maxDepth, depth);
      person.children?.forEach((child) => findMaxDepth(child, depth + 1));
    };

    familyData.children?.forEach((child) => findMaxDepth(child, 1));
    return maxDepth;
  }, [familyData]);

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    if (tagFilter.includes(tag)) {
      onTagChange(tagFilter.filter((t) => t !== tag));
    } else {
      onTagChange([...tagFilter, tag]);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    onSearchChange('');
    onGenderChange('all');
    onGenerationChange('all');
    onTagChange([]);
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    genderFilter !== 'all' ||
    generationFilter !== 'all' ||
    tagFilter.length > 0;

  const activeFilterCount =
    (searchQuery ? 1 : 0) +
    (genderFilter !== 'all' ? 1 : 0) +
    (generationFilter !== 'all' ? 1 : 0) +
    tagFilter.length;

  return (
    <div className="w-full max-w-4xl mx-auto mb-6 sm:mb-10 px-3 sm:px-4">
      {/* Stats Bar - Compact on mobile */}
      <motion.div
        className="flex justify-center gap-3 sm:gap-6 mb-4 sm:mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="stats-card px-4 sm:px-6 py-2 sm:py-3">
          <p className="text-xl sm:text-2xl font-bold text-gradient-gold">{totalMembers}</p>
          <p className="text-[10px] sm:text-xs text-white/60 font-medium">Members</p>
        </div>
        <div className="stats-card px-4 sm:px-6 py-2 sm:py-3">
          <p className="text-xl sm:text-2xl font-bold text-gradient-gold">{maxGeneration + 1}</p>
          <p className="text-[10px] sm:text-xs text-white/60 font-medium">Generations</p>
        </div>
      </motion.div>

      {/* Main Search Bar */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none z-10">
          <svg
            className="w-5 h-5 text-white/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Search Input */}
        <label htmlFor="family-search" className="sr-only">
          Search family members by name or tag
        </label>
        <input
          id="family-search"
          type="text"
          placeholder="Search family..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input-premium"
          autoComplete="off"
        />

        {/* Clear search button */}
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-14 flex items-center pr-2
                     text-white/50 active:text-white transition-colors z-10 touch-target"
            aria-label="Clear search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Filter toggle button */}
        <motion.button
          onClick={() => setIsFilterExpanded(!isFilterExpanded)}
          className={`
            absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 z-10 touch-target
            ${isFilterExpanded ? 'text-amber-400' : 'text-white/50'}
            active:text-amber-400 transition-colors
          `}
          whileTap={{ scale: 0.9 }}
          aria-label={`${isFilterExpanded ? 'Hide' : 'Show'} filters`}
          aria-expanded={isFilterExpanded}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
          {/* Active filter indicator */}
          {activeFilterCount > 0 && (
            <motion.span
              className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-400 rounded-full
                        text-[10px] font-bold text-navy-900 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              {activeFilterCount}
            </motion.span>
          )}
        </motion.button>
      </motion.div>

      {/* Quick Action Buttons - Always visible on mobile */}
      <motion.div
        className="flex justify-center gap-2 mt-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <button
          onClick={onExpandAll}
          className="filter-chip text-xs sm:text-sm flex items-center gap-1.5 px-3"
          aria-label="Expand all family branches"
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          <span className="hidden sm:inline">Expand</span> All
        </button>
        <button
          onClick={onCollapseAll}
          className="filter-chip text-xs sm:text-sm flex items-center gap-1.5 px-3"
          aria-label="Collapse all family branches"
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
          </svg>
          <span className="hidden sm:inline">Collapse</span> All
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="filter-chip text-xs sm:text-sm flex items-center gap-1.5 px-3 border-red-400/50 text-red-300"
            aria-label="Clear all filters"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear
          </button>
        )}
      </motion.div>

      {/* Expandable Filters */}
      <AnimatePresence>
        {isFilterExpanded && (
          <motion.div
            className="mt-4 p-4 sm:p-5 glass-card"
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div className="grid gap-4 sm:gap-5">
              {/* Gender Filter */}
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-white/80 mb-2 sm:mb-3 flex items-center gap-2">
                  <span aria-hidden="true">👤</span>
                  Gender
                </h3>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Filter by gender">
                  {([
                    { value: 'all', label: 'All', icon: '👥' },
                    { value: 'male', label: 'Male', icon: '👨' },
                    { value: 'female', label: 'Female', icon: '👩' },
                  ] as const).map((option) => (
                    <motion.button
                      key={option.value}
                      onClick={() => onGenderChange(option.value)}
                      className={`filter-chip text-xs sm:text-sm ${genderFilter === option.value ? 'active' : ''}`}
                      whileTap={{ scale: 0.95 }}
                      role="radio"
                      aria-checked={genderFilter === option.value}
                    >
                      <span className="mr-1" aria-hidden="true">{option.icon}</span>
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Generation Filter */}
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-white/80 mb-2 sm:mb-3 flex items-center gap-2">
                  <span aria-hidden="true">🌳</span>
                  Generation
                </h3>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Filter by generation">
                  <motion.button
                    onClick={() => onGenerationChange('all')}
                    className={`filter-chip text-xs sm:text-sm ${generationFilter === 'all' ? 'active' : ''}`}
                    whileTap={{ scale: 0.95 }}
                    role="radio"
                    aria-checked={generationFilter === 'all'}
                  >
                    All
                  </motion.button>
                  <motion.button
                    onClick={() => onGenerationChange(0)}
                    className={`filter-chip text-xs sm:text-sm ${generationFilter === 0 ? 'active' : ''}`}
                    whileTap={{ scale: 0.95 }}
                    role="radio"
                    aria-checked={generationFilter === 0}
                  >
                    <span aria-hidden="true">👑</span> Founders
                  </motion.button>
                  {Array.from({ length: maxGeneration }, (_, i) => i + 1).map((gen) => (
                    <motion.button
                      key={gen}
                      onClick={() => onGenerationChange(gen)}
                      className={`filter-chip text-xs sm:text-sm ${generationFilter === gen ? 'active' : ''}`}
                      whileTap={{ scale: 0.95 }}
                      role="radio"
                      aria-checked={generationFilter === gen}
                    >
                      Gen {gen}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Tags Filter */}
              {allTags.length > 0 && (
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-white/80 mb-2 sm:mb-3 flex items-center gap-2">
                    <span aria-hidden="true">🏷️</span>
                    Tags
                  </h3>
                  <div
                    className="flex flex-wrap gap-2 max-h-24 sm:max-h-28 overflow-y-auto custom-scrollbar pr-1"
                    role="group"
                    aria-label="Filter by tags"
                  >
                    {allTags.map((tag) => (
                      <motion.button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`filter-chip text-xs ${tagFilter.includes(tag) ? 'active' : ''}`}
                        whileTap={{ scale: 0.95 }}
                        aria-pressed={tagFilter.includes(tag)}
                      >
                        {tag}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Pills - Show when filters panel is closed */}
      <AnimatePresence>
        {hasActiveFilters && !isFilterExpanded && (
          <motion.div
            className="mt-3 flex flex-wrap gap-1.5 sm:gap-2 justify-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            role="list"
            aria-label="Active filters"
          >
            {searchQuery && (
              <motion.span
                className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300
                         text-xs font-medium flex items-center gap-1.5 border border-amber-500/30"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                role="listitem"
              >
                <span aria-hidden="true">🔍</span>
                <span className="max-w-[100px] truncate">&ldquo;{searchQuery}&rdquo;</span>
                <button
                  onClick={() => onSearchChange('')}
                  className="ml-1 hover:text-amber-100 active:text-amber-100 transition-colors"
                  aria-label={`Remove search filter: ${searchQuery}`}
                >
                  ×
                </button>
              </motion.span>
            )}
            {genderFilter !== 'all' && (
              <motion.span
                className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300
                         text-xs font-medium flex items-center gap-1.5 border border-amber-500/30"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                role="listitem"
              >
                {genderFilter === 'male' ? '👨 Male' : '👩 Female'}
                <button
                  onClick={() => onGenderChange('all')}
                  className="ml-1 hover:text-amber-100 active:text-amber-100 transition-colors"
                  aria-label="Remove gender filter"
                >
                  ×
                </button>
              </motion.span>
            )}
            {generationFilter !== 'all' && (
              <motion.span
                className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300
                         text-xs font-medium flex items-center gap-1.5 border border-amber-500/30"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                role="listitem"
              >
                {generationFilter === 0 ? '👑 Founders' : `🌳 Gen ${generationFilter}`}
                <button
                  onClick={() => onGenerationChange('all')}
                  className="ml-1 hover:text-amber-100 active:text-amber-100 transition-colors"
                  aria-label="Remove generation filter"
                >
                  ×
                </button>
              </motion.span>
            )}
            {tagFilter.slice(0, 2).map((tag) => (
              <motion.span
                key={tag}
                className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300
                         text-xs font-medium flex items-center gap-1.5 border border-amber-500/30"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                role="listitem"
              >
                <span aria-hidden="true">🏷️</span> {tag}
                <button
                  onClick={() => toggleTag(tag)}
                  className="ml-1 hover:text-amber-100 active:text-amber-100 transition-colors"
                  aria-label={`Remove tag filter: ${tag}`}
                >
                  ×
                </button>
              </motion.span>
            ))}
            {tagFilter.length > 2 && (
              <span className="px-2 py-1 text-amber-300/60 text-xs">
                +{tagFilter.length - 2} more
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
