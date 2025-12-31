'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Person } from '@/types/family';
import PersonCard from './PersonCard';

interface RecursiveTreeNodeProps {
  person: Person;
  generationLevel: number;
  expandedNodes: Set<string>;
  highlightedIds: string[];
  searchQuery: string;
  genderFilter: 'all' | 'male' | 'female';
  generationFilter: number | 'all';
  tagFilter: string[];
  onToggleExpand: (id: string) => void;
  onSelectPerson: (person: Person, generation: number) => void;
  isRootChild?: boolean;
}

/**
 * RecursiveTreeNode Component - Premium Design
 *
 * The CORE RECURSIVE component with elegant connection lines
 * and smooth animations for professional appearance.
 */
export default function RecursiveTreeNode({
  person,
  generationLevel,
  expandedNodes,
  highlightedIds,
  searchQuery,
  genderFilter,
  generationFilter,
  tagFilter,
  onToggleExpand,
  onSelectPerson,
  isRootChild = false,
}: RecursiveTreeNodeProps) {
  const hasChildren = person.children && person.children.length > 0;
  const isExpanded = expandedNodes.has(person.id);
  const isHighlighted = highlightedIds.includes(person.id);

  // Check if this person matches current filters
  const matchesSearch =
    searchQuery === '' ||
    person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.tags?.some((tag) =>
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const matchesGender =
    genderFilter === 'all' || person.gender === genderFilter;

  const matchesGeneration =
    generationFilter === 'all' || generationLevel === generationFilter;

  const matchesTags =
    tagFilter.length === 0 ||
    tagFilter.some((tag) =>
      person.tags?.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
    );

  const isVisible =
    matchesSearch && matchesGender && matchesGeneration && matchesTags;

  // Check if any descendant matches
  const hasMatchingDescendant = (p: Person): boolean => {
    if (!p.children) return false;
    return p.children.some((child) => {
      const childMatches =
        (searchQuery === '' ||
          child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          child.tags?.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )) &&
        (genderFilter === 'all' || child.gender === genderFilter) &&
        (tagFilter.length === 0 ||
          tagFilter.some((tag) =>
            child.tags?.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
          ));
      return childMatches || hasMatchingDescendant(child);
    });
  };

  const shouldShowNode = isVisible || hasMatchingDescendant(person);

  if (!shouldShowNode) return null;

  // Determine card size based on generation
  const getCardSize = (): 'small' | 'medium' | 'large' => {
    if (generationLevel === 0) return 'large';
    if (generationLevel === 1) return 'medium';
    return 'small';
  };

  // Filter visible children
  const visibleChildren = person.children?.filter((child) => {
    const childMatches =
      (searchQuery === '' ||
        child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        child.tags?.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )) &&
      (genderFilter === 'all' || child.gender === genderFilter) &&
      (tagFilter.length === 0 ||
        tagFilter.some((tag) =>
          child.tags?.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
        ));
    return childMatches || hasMatchingDescendant(child);
  });

  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: isVisible ? 1 : 0.5, y: 0 }}
      transition={{ duration: 0.5, delay: generationLevel * 0.05 }}
    >
      {/* Person and Spouse Container */}
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 relative">
        {/* Person Card */}
        <PersonCard
          person={person}
          isHighlighted={isHighlighted}
          onClick={() => onSelectPerson(person, generationLevel)}
          size={getCardSize()}
        />

        {/* Spouse Card (if married) */}
        {person.spouse && (
          <>
            {/* Marriage connector - Desktop */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="tree-connector-horizontal w-6" />
              <motion.div
                className="marriage-connector"
                whileHover={{ scale: 1.1 }}
                animate={{
                  boxShadow: [
                    '0 4px 15px rgba(251,191,36,0.3)',
                    '0 4px 25px rgba(251,191,36,0.5)',
                    '0 4px 15px rgba(251,191,36,0.3)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-xl">💕</span>
              </motion.div>
              <div className="tree-connector-horizontal w-6" />
            </div>

            {/* Marriage connector - Mobile */}
            <div className="sm:hidden flex flex-col items-center gap-1">
              <div className="tree-connector-vertical h-3" />
              <motion.div
                className="marriage-connector w-10 h-10"
                whileHover={{ scale: 1.1 }}
              >
                <span className="text-lg">💕</span>
              </motion.div>
              <div className="tree-connector-vertical h-3" />
            </div>

            <PersonCard
              person={person.spouse}
              onClick={() =>
                onSelectPerson(
                  { ...person.spouse!, id: person.spouse!.id || `${person.id}-spouse` } as Person,
                  generationLevel
                )
              }
              size={getCardSize()}
            />
          </>
        )}
      </div>

      {/* Expand/Collapse Button */}
      {hasChildren && (
        <motion.button
          className="expand-btn mt-4 touch-target z-10"
          onClick={() => onToggleExpand(person.id)}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isExpanded ? 'Collapse children' : 'Expand children'}
          aria-expanded={isExpanded}
        >
          <motion.svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M19 9l-7 7-7-7"
            />
          </motion.svg>
        </motion.button>
      )}

      {/* Children Count Badge */}
      {hasChildren && !isExpanded && (
        <motion.div
          className="mt-3 generation-badge"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
        >
          <span className="mr-1">👶</span>
          {visibleChildren?.length || 0}{' '}
          {(visibleChildren?.length || 0) === 1 ? 'child' : 'children'}
        </motion.div>
      )}

      {/* Connection Lines and Children */}
      <AnimatePresence>
        {hasChildren && isExpanded && visibleChildren && visibleChildren.length > 0 && (
          <motion.div
            className="flex flex-col items-center w-full"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            {/* Vertical connector from parent */}
            <motion.div
              className="tree-connector-vertical h-10"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.3 }}
              style={{ transformOrigin: 'top' }}
            />

            {/* Horizontal connector line (multiple children) */}
            {visibleChildren.length > 1 && (
              <motion.div
                className="relative flex justify-center mb-2"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div
                  className="tree-connector-horizontal"
                  style={{
                    width: `calc(${Math.min(visibleChildren.length - 1, 4) * 25}vw)`,
                    maxWidth: '600px',
                    minWidth: '100px',
                  }}
                />
                {/* Connection dots */}
                {visibleChildren.map((_, index) => (
                  <motion.div
                    key={index}
                    className="decorative-dot absolute top-1/2 -translate-y-1/2"
                    style={{
                      left: `${(index / (visibleChildren.length - 1)) * 100}%`,
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                  />
                ))}
              </motion.div>
            )}

            {/* Children Grid */}
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-6 sm:gap-8 pt-2">
              {visibleChildren.map((child, index) => (
                <motion.div
                  key={child.id}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  {/* Vertical connector to each child */}
                  {visibleChildren.length > 1 && (
                    <motion.div
                      className="tree-connector-vertical h-6 hidden sm:block"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      style={{ transformOrigin: 'top' }}
                    />
                  )}

                  {/* RECURSIVE CALL */}
                  <RecursiveTreeNode
                    person={child}
                    generationLevel={generationLevel + 1}
                    expandedNodes={expandedNodes}
                    highlightedIds={highlightedIds}
                    searchQuery={searchQuery}
                    genderFilter={genderFilter}
                    generationFilter={generationFilter}
                    tagFilter={tagFilter}
                    onToggleExpand={onToggleExpand}
                    onSelectPerson={onSelectPerson}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
