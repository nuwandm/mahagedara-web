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
 * SearchFilterPanel Component - Premium Design
 *
 * Elegant search and filtering with glassmorphism effects.
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

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 sm:mb-12 px-4">
      {/* Stats Bar */}
      <motion.div
        className="flex justify-center gap-4 sm:gap-8 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="stats-card px-6 py-3">
          <p className="text-2xl sm:text-3xl font-bold text-gradient-gold">{totalMembers}</p>
          <p className="text-xs sm:text-sm text-white/60 font-medium">Family Members</p>
        </div>
        <div className="stats-card px-6 py-3">
          <p className="text-2xl sm:text-3xl font-bold text-gradient-gold">{maxGeneration + 1}</p>
          <p className="text-xs sm:text-sm text-white/60 font-medium">Generations</p>
        </div>
      </motion.div>

      {/* Main Search Bar */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
          <svg
            className="w-5 h-5 text-white/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search family members..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input-premium"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-16 flex items-center pr-3
                     text-white/50 hover:text-white transition-colors z-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        <motion.button
          onClick={() => setIsFilterExpanded(!isFilterExpanded)}
          className={`
            absolute inset-y-0 right-0 flex items-center pr-5 z-10
            ${isFilterExpanded ? 'text-amber-400' : 'text-white/50'}
            hover:text-amber-400 transition-colors
          `}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle filters"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
          {hasActiveFilters && (
            <motion.span
              className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            />
          )}
        </motion.button>
      </motion.div>

      {/* Expandable Filters */}
      <AnimatePresence>
        {isFilterExpanded && (
          <motion.div
            className="mt-4 p-5 sm:p-6 glass-card"
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="grid gap-5 sm:gap-6">
              {/* Gender Filter */}
              <div>
                <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                  <span>👤</span>
                  Gender
                </h3>
                <div className="flex flex-wrap gap-2">
                  {([
                    { value: 'all', label: 'All', icon: '👥' },
                    { value: 'male', label: 'Male', icon: '👨' },
                    { value: 'female', label: 'Female', icon: '👩' },
                  ] as const).map((option) => (
                    <motion.button
                      key={option.value}
                      onClick={() => onGenderChange(option.value)}
                      className={`filter-chip ${genderFilter === option.value ? 'active' : ''}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="mr-1">{option.icon}</span>
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Generation Filter */}
              <div>
                <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                  <span>🌳</span>
                  Generation
                </h3>
                <div className="flex flex-wrap gap-2">
                  <motion.button
                    onClick={() => onGenerationChange('all')}
                    className={`filter-chip ${generationFilter === 'all' ? 'active' : ''}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    All
                  </motion.button>
                  <motion.button
                    onClick={() => onGenerationChange(0)}
                    className={`filter-chip ${generationFilter === 0 ? 'active' : ''}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    👑 Founders
                  </motion.button>
                  {Array.from({ length: maxGeneration }, (_, i) => i + 1).map((gen) => (
                    <motion.button
                      key={gen}
                      onClick={() => onGenerationChange(gen)}
                      className={`filter-chip ${generationFilter === gen ? 'active' : ''}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Gen {gen}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Tags Filter */}
              {allTags.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                    <span>🏷️</span>
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto custom-scrollbar pr-2">
                    {allTags.map((tag) => (
                      <motion.button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`filter-chip text-xs ${tagFilter.includes(tag) ? 'active' : ''}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {tag}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Decorative line */}
              <div className="decorative-line" />

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <motion.button
                  onClick={onExpandAll}
                  className="filter-chip flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  Expand All
                </motion.button>
                <motion.button
                  onClick={onCollapseAll}
                  className="filter-chip flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                  </svg>
                  Collapse All
                </motion.button>
                {hasActiveFilters && (
                  <motion.button
                    onClick={clearFilters}
                    className="filter-chip flex items-center gap-2 border-red-400/50 text-red-300
                             hover:bg-red-500/20 hover:border-red-400"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear All
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Pills */}
      <AnimatePresence>
        {hasActiveFilters && !isFilterExpanded && (
          <motion.div
            className="mt-4 flex flex-wrap gap-2 justify-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {searchQuery && (
              <motion.span
                className="px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-300
                         text-sm font-medium flex items-center gap-2 border border-amber-500/30"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                🔍 &ldquo;{searchQuery}&rdquo;
                <button
                  onClick={() => onSearchChange('')}
                  className="hover:text-amber-100 transition-colors"
                >
                  ×
                </button>
              </motion.span>
            )}
            {genderFilter !== 'all' && (
              <motion.span
                className="px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-300
                         text-sm font-medium flex items-center gap-2 border border-amber-500/30"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                {genderFilter === 'male' ? '👨 Male' : '👩 Female'}
                <button
                  onClick={() => onGenderChange('all')}
                  className="hover:text-amber-100 transition-colors"
                >
                  ×
                </button>
              </motion.span>
            )}
            {generationFilter !== 'all' && (
              <motion.span
                className="px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-300
                         text-sm font-medium flex items-center gap-2 border border-amber-500/30"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                {generationFilter === 0 ? '👑 Founders' : `🌳 Gen ${generationFilter}`}
                <button
                  onClick={() => onGenerationChange('all')}
                  className="hover:text-amber-100 transition-colors"
                >
                  ×
                </button>
              </motion.span>
            )}
            {tagFilter.slice(0, 3).map((tag) => (
              <motion.span
                key={tag}
                className="px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-300
                         text-sm font-medium flex items-center gap-2 border border-amber-500/30"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                🏷️ {tag}
                <button
                  onClick={() => toggleTag(tag)}
                  className="hover:text-amber-100 transition-colors"
                >
                  ×
                </button>
              </motion.span>
            ))}
            {tagFilter.length > 3 && (
              <span className="px-3 py-1.5 text-amber-300/60 text-sm">
                +{tagFilter.length - 3} more
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
