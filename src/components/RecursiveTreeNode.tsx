'use client';

import { useState } from 'react';
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
 * RecursiveTreeNode Component - Clean Family View
 *
 * Shows only direct children initially. Spouses are hidden until
 * the user hovers over a person, creating a cleaner family tree view.
 * Click to expand children, hover to reveal spouse.
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
  // State to track if spouse is revealed (on hover or touch)
  const [isSpouseVisible, setIsSpouseVisible] = useState(false);

  const hasChildren = person.children && person.children.length > 0;
  const isExpanded = expandedNodes.has(person.id);
  const isHighlighted = highlightedIds.includes(person.id);
  const hasSpouse = !!person.spouse;

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

  // Determine card size based on generation - smaller as we go deeper
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

  // Calculate connector width based on number of children (capped for mobile)
  const getConnectorWidth = () => {
    const childCount = visibleChildren?.length || 0;
    // Use smaller width on mobile, cap at 4 children worth of width
    const cappedCount = Math.min(childCount - 1, 3);
    return {
      mobile: `${Math.max(cappedCount * 80, 60)}px`,
      desktop: `${Math.min(cappedCount * 120, 400)}px`,
    };
  };

  const connectorWidth = getConnectorWidth();

  // Handle mouse/touch interactions for spouse reveal
  const handleMouseEnter = () => {
    if (hasSpouse) {
      setIsSpouseVisible(true);
    }
  };

  const handleMouseLeave = () => {
    setIsSpouseVisible(false);
  };

  // For mobile: toggle spouse visibility on tap
  const handleSpouseToggle = () => {
    if (hasSpouse) {
      setIsSpouseVisible(!isSpouseVisible);
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0.6, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(generationLevel * 0.03, 0.15) }}
    >
      {/* Person and Spouse Container */}
      <div
        className="flex flex-row items-center relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Person Card */}
        <div className="relative">
          <PersonCard
            person={person}
            isHighlighted={isHighlighted}
            onClick={() => onSelectPerson(person, generationLevel)}
            size={getCardSize()}
          />

          {/* Spouse indicator badge - shows when spouse exists but hidden */}
          {hasSpouse && !isSpouseVisible && (
            <motion.div
              className="absolute -right-1 top-1/2 -translate-y-1/2 z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                handleSpouseToggle();
              }}
            >
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-pink-400 to-rose-500
                          flex items-center justify-center shadow-lg cursor-pointer
                          border-2 border-white transform translate-x-1/2"
                title={`Married to ${person.spouse?.name}`}
                aria-label={`Show spouse: ${person.spouse?.name}`}
              >
                <span className="text-sm" aria-hidden="true">💑</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Spouse Card - Slides in from right on hover */}
        <AnimatePresence>
          {hasSpouse && isSpouseVisible && (
            <motion.div
              className="flex flex-row items-center"
              initial={{ opacity: 0, width: 0, x: -20 }}
              animate={{ opacity: 1, width: 'auto', x: 0 }}
              exit={{ opacity: 0, width: 0, x: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Marriage connector */}
              <div className="flex flex-row items-center gap-1 sm:gap-2 mx-1 sm:mx-2">
                <motion.div
                  className="tree-connector-horizontal w-3 sm:w-4"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.1 }}
                />

                <motion.div
                  className="marriage-connector w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 15, delay: 0.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Married to"
                >
                  <span className="text-sm sm:text-lg" aria-hidden="true">💕</span>
                </motion.div>

                <motion.div
                  className="tree-connector-horizontal w-3 sm:w-4"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.1 }}
                />
              </div>

              {/* Spouse Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 }}
              >
                <PersonCard
                  person={person.spouse!}
                  onClick={() =>
                    onSelectPerson(
                      { ...person.spouse!, id: person.spouse!.id || `${person.id}-spouse` } as Person,
                      generationLevel
                    )
                  }
                  size={getCardSize()}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Expand/Collapse Button */}
      {hasChildren && (
        <motion.button
          className="expand-btn mt-3 sm:mt-4 z-10"
          onClick={() => onToggleExpand(person.id)}
          whileTap={{ scale: 0.9 }}
          aria-label={isExpanded ? `Collapse ${person.name}'s children` : `Expand ${person.name}'s children`}
          aria-expanded={isExpanded}
        >
          <motion.svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
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

      {/* Children Count Badge (when collapsed) */}
      {hasChildren && !isExpanded && (
        <motion.div
          className="mt-2 generation-badge text-xs sm:text-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onToggleExpand(person.id)}
          role="button"
          aria-label={`${visibleChildren?.length || 0} children, tap to expand`}
        >
          <span className="mr-1" aria-hidden="true">👶</span>
          {visibleChildren?.length || 0}{' '}
          {(visibleChildren?.length || 0) === 1 ? 'child' : 'children'}
        </motion.div>
      )}

      {/* Connection Lines and Children */}
      <AnimatePresence>
        {hasChildren && isExpanded && visibleChildren && visibleChildren.length > 0 && (
          <motion.div
            className="flex flex-col items-center w-full overflow-visible"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            {/* Vertical connector from parent */}
            <motion.div
              className="tree-connector-vertical h-6 sm:h-8"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.2 }}
              style={{ transformOrigin: 'top' }}
            />

            {/* Horizontal connector line (multiple children) */}
            {visibleChildren.length > 1 && (
              <motion.div
                className="relative flex justify-center mb-1"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.25, delay: 0.1 }}
              >
                <div
                  className="tree-connector-horizontal"
                  style={{
                    width: connectorWidth.mobile,
                  }}
                />
                {/* Desktop: wider connector */}
                <style jsx>{`
                  @media (min-width: 640px) {
                    .tree-connector-horizontal {
                      width: ${connectorWidth.desktop} !important;
                    }
                  }
                `}</style>
              </motion.div>
            )}

            {/* Children - Horizontal layout */}
            <div
              className={`
                flex flex-row flex-wrap justify-center
                gap-4 sm:gap-6 pt-1
                ${visibleChildren.length > 3 ? 'overflow-x-auto max-w-full pb-2' : ''}
              `}
            >
              {visibleChildren.map((child, index) => (
                <motion.div
                  key={child.id}
                  className="flex flex-col items-center flex-shrink-0"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(0.15 + index * 0.05, 0.4) }}
                >
                  {/* Vertical connector to each child */}
                  {visibleChildren.length > 1 && (
                    <motion.div
                      className="tree-connector-vertical h-4 sm:h-5"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 0.2 + index * 0.03 }}
                      style={{ transformOrigin: 'top' }}
                    />
                  )}

                  {/* RECURSIVE CALL - Children shown without spouse initially */}
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
