'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FamilyData, Person } from '@/types/family';
import PersonCard from './PersonCard';
import RecursiveTreeNode from './RecursiveTreeNode';
import ProfileModal from './ProfileModal';
import SearchFilterPanel from './SearchFilterPanel';

interface FamilyTreeProps {
  data: FamilyData;
}

/**
 * FamilyTree Component - Premium Design
 *
 * The main entry point with an elegant header, premium styling,
 * and professional animations throughout.
 */
export default function FamilyTree({ data }: FamilyTreeProps) {
  // State management
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']));
  const [selectedPerson, setSelectedPerson] = useState<{
    person: Person;
    generation: number;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [highlightedIds, setHighlightedIds] = useState<string[]>([]);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');
  const [generationFilter, setGenerationFilter] = useState<number | 'all'>('all');
  const [tagFilter, setTagFilter] = useState<string[]>([]);

  // Calculate total family members
  const totalMembers = useMemo(() => {
    let count = 2; // Root couple

    const countMembers = (person: Person) => {
      count++;
      if (person.spouse) count++;
      person.children?.forEach(countMembers);
    };

    data.rootCouple.children?.forEach(countMembers);
    return count;
  }, [data.rootCouple]);

  // Collect all node IDs
  const allNodeIds = useMemo(() => {
    const ids: string[] = ['root'];

    const collectIds = (person: Person) => {
      ids.push(person.id);
      person.children?.forEach(collectIds);
    };

    data.rootCouple.children?.forEach(collectIds);
    return ids;
  }, [data.rootCouple.children]);

  // Toggle expand/collapse
  const handleToggleExpand = useCallback((id: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const handleExpandAll = useCallback(() => {
    setExpandedNodes(new Set(allNodeIds));
  }, [allNodeIds]);

  const handleCollapseAll = useCallback(() => {
    setExpandedNodes(new Set(['root']));
  }, []);

  // Handle person selection
  const handleSelectPerson = useCallback(
    (person: Person, generation: number) => {
      setSelectedPerson({ person, generation });
      setIsModalOpen(true);

      // Build lineage path
      const path: string[] = [];

      const findPath = (
        current: Person,
        targetId: string,
        currentPath: string[]
      ): boolean => {
        currentPath.push(current.id);
        if (current.id === targetId) {
          return true;
        }
        if (current.children) {
          for (const child of current.children) {
            if (findPath(child, targetId, currentPath)) {
              return true;
            }
          }
        }
        currentPath.pop();
        return false;
      };

      if (person.id === data.rootCouple.husband.id) {
        path.push(data.rootCouple.husband.id);
      } else if (person.id === data.rootCouple.wife.id) {
        path.push(data.rootCouple.wife.id);
      } else {
        path.push(data.rootCouple.husband.id, data.rootCouple.wife.id);
        data.rootCouple.children?.forEach((child) => {
          const tempPath: string[] = [];
          if (findPath(child, person.id, tempPath)) {
            path.push(...tempPath);
          }
        });
      }

      setHighlightedIds(path);
    },
    [data.rootCouple]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => {
      setHighlightedIds([]);
    }, 300);
  }, []);

  // Filter logic
  const rootMatchesSearch = (person: Person) =>
    searchQuery === '' ||
    person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.tags?.some((tag) =>
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const rootMatchesGender = (person: Person) =>
    genderFilter === 'all' || person.gender === genderFilter;

  const showHusband =
    (generationFilter === 'all' || generationFilter === 0) &&
    rootMatchesSearch(data.rootCouple.husband) &&
    rootMatchesGender(data.rootCouple.husband);

  const showWife =
    (generationFilter === 'all' || generationFilter === 0) &&
    rootMatchesSearch(data.rootCouple.wife) &&
    rootMatchesGender(data.rootCouple.wife);

  // Filter children
  const visibleChildren = useMemo(() => {
    const hasMatchingDescendant = (person: Person): boolean => {
      if (!person.children) return false;
      return person.children.some((child) => {
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

    return data.rootCouple.children?.filter((child) => {
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
  }, [data.rootCouple.children, searchQuery, genderFilter, tagFilter]);

  const isRootExpanded = expandedNodes.has('root');

  return (
    <div className="w-full min-h-screen py-8 sm:py-12 px-4 sm:px-6 overflow-x-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <motion.nav
        className="flex justify-center gap-4 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-amber-500/20 text-amber-400 font-medium text-sm hover:bg-amber-500/30 transition-colors"
        >
          Family Tree
        </Link>
        <Link
          href="/events"
          className="px-5 py-2.5 rounded-xl bg-white/10 text-white/70 font-medium text-sm hover:bg-white/20 hover:text-white transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Events
        </Link>
      </motion.nav>

      {/* Header */}
      <motion.header
        className="text-center mb-10 sm:mb-16 relative"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Decorative crown */}
        <motion.div
          className="mb-4"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', damping: 15 }}
        >
          <div className="relative inline-block">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full
                          bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600
                          flex items-center justify-center shadow-2xl glow-gold">
              <span className="text-4xl sm:text-5xl filter drop-shadow-lg">🌳</span>
            </div>
            <motion.div
              className="absolute -inset-2 rounded-full border-2 border-amber-400/50"
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Family Name */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 text-gradient-gold"
          style={{ fontFamily: 'Playfair Display, serif' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {data.familyName}
        </motion.h1>

        {/* Family Motto */}
        {data.familyMotto && (
          <motion.p
            className="text-white/70 text-lg sm:text-xl italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            &ldquo;{data.familyMotto}&rdquo;
          </motion.p>
        )}

        {/* Decorative line */}
        <motion.div
          className="decorative-line w-48 mx-auto mt-6"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        />
      </motion.header>

      {/* Search and Filter Panel */}
      <SearchFilterPanel
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        genderFilter={genderFilter}
        onGenderChange={setGenderFilter}
        generationFilter={generationFilter}
        onGenerationChange={setGenerationFilter}
        tagFilter={tagFilter}
        onTagChange={setTagFilter}
        familyData={data.rootCouple}
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
        totalMembers={totalMembers}
      />

      {/* Family Tree Container */}
      <motion.div
        className="flex flex-col items-center relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {/* Root Couple Section */}
        <motion.div
          className="relative mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          {/* Generation Label */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <span className="generation-badge text-base">
              👑 Family Founders
            </span>
          </motion.div>

          {/* Root Couple Cards */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            {showHusband && (
              <PersonCard
                person={data.rootCouple.husband}
                isHighlighted={highlightedIds.includes(data.rootCouple.husband.id)}
                isRootMember
                onClick={() => handleSelectPerson(data.rootCouple.husband, 0)}
                size="large"
              />
            )}

            {/* Marriage Connector */}
            {showHusband && showWife && (
              <>
                {/* Desktop connector */}
                <div className="hidden sm:flex items-center gap-3">
                  <div className="tree-connector-horizontal w-8" />
                  <motion.div
                    className="marriage-connector"
                    animate={{
                      boxShadow: [
                        '0 4px 15px rgba(251,191,36,0.3)',
                        '0 4px 30px rgba(251,191,36,0.6)',
                        '0 4px 15px rgba(251,191,36,0.3)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-2xl">💕</span>
                  </motion.div>
                  <div className="tree-connector-horizontal w-8" />
                </div>

                {/* Mobile connector */}
                <div className="sm:hidden flex flex-col items-center gap-2">
                  <div className="tree-connector-vertical h-4" />
                  <motion.div
                    className="marriage-connector w-12 h-12"
                    animate={{
                      boxShadow: [
                        '0 4px 15px rgba(251,191,36,0.3)',
                        '0 4px 30px rgba(251,191,36,0.6)',
                        '0 4px 15px rgba(251,191,36,0.3)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-xl">💕</span>
                  </motion.div>
                  <div className="tree-connector-vertical h-4" />
                </div>
              </>
            )}

            {showWife && (
              <PersonCard
                person={data.rootCouple.wife}
                isHighlighted={highlightedIds.includes(data.rootCouple.wife.id)}
                isRootMember
                onClick={() => handleSelectPerson(data.rootCouple.wife, 0)}
                size="large"
              />
            )}
          </div>
        </motion.div>

        {/* Expand/Collapse Button for Root */}
        {data.rootCouple.children && data.rootCouple.children.length > 0 && (
          <motion.button
            className="expand-btn mb-4 touch-target"
            onClick={() => handleToggleExpand('root')}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isRootExpanded ? 'Collapse children' : 'Expand children'}
          >
            <motion.svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ rotate: isRootExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
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
        {data.rootCouple.children && data.rootCouple.children.length > 0 && !isRootExpanded && (
          <motion.div
            className="generation-badge mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="mr-1">👶</span>
            {visibleChildren?.length || 0} children
          </motion.div>
        )}

        {/* Children Tree */}
        {isRootExpanded && visibleChildren && visibleChildren.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Vertical connector */}
            <div className="flex flex-col items-center mb-6">
              <motion.div
                className="tree-connector-vertical h-12"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.3 }}
                style={{ transformOrigin: 'top' }}
              />
            </div>

            {/* Horizontal connector */}
            {visibleChildren.length > 1 && (
              <motion.div
                className="flex justify-center mb-4"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div
                  className="tree-connector-horizontal relative"
                  style={{
                    width: `calc(${Math.min(visibleChildren.length - 1, 4) * 25}vw)`,
                    maxWidth: '700px',
                    minWidth: '150px',
                  }}
                >
                  {/* Connection dots */}
                  {visibleChildren.map((_, index) => (
                    <motion.div
                      key={index}
                      className="decorative-dot absolute top-1/2 -translate-y-1/2"
                      style={{
                        left: visibleChildren.length > 1
                          ? `${(index / (visibleChildren.length - 1)) * 100}%`
                          : '50%',
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Children Grid */}
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-6 sm:gap-10">
              {visibleChildren.map((child, index) => (
                <motion.div
                  key={child.id}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  {/* Vertical connector */}
                  {visibleChildren.length > 1 && (
                    <motion.div
                      className="tree-connector-vertical h-8 hidden sm:block"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      style={{ transformOrigin: 'top' }}
                    />
                  )}

                  {/* Recursive Component */}
                  <RecursiveTreeNode
                    person={child}
                    generationLevel={1}
                    expandedNodes={expandedNodes}
                    highlightedIds={highlightedIds}
                    searchQuery={searchQuery}
                    genderFilter={genderFilter}
                    generationFilter={generationFilter}
                    tagFilter={tagFilter}
                    onToggleExpand={handleToggleExpand}
                    onSelectPerson={handleSelectPerson}
                    isRootChild
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {((generationFilter !== 'all' && generationFilter !== 0) ||
          (searchQuery !== '' &&
            !showHusband &&
            !showWife &&
            (!visibleChildren || visibleChildren.length === 0))) && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/10
                          flex items-center justify-center">
              <span className="text-5xl">🔍</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No matches found
            </h3>
            <p className="text-white/60">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Profile Modal */}
      <ProfileModal
        person={selectedPerson?.person || null}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        generationLevel={selectedPerson?.generation || 0}
      />

      {/* Footer */}
      <motion.footer
        className="text-center mt-16 sm:mt-24 pt-8 border-t border-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="decorative-line w-24 mx-auto mb-6" />
        <p className="text-white/50 text-sm font-medium">
          {data.familyName} Family Tree
        </p>
        <p className="text-white/30 text-xs mt-1">
          {new Date().getFullYear()} &bull; {totalMembers} Members Across Generations
        </p>
        {data.metadata?.updatedAt && (
          <p className="text-white/20 text-xs mt-2">
            Last updated: {data.metadata.updatedAt}
          </p>
        )}
      </motion.footer>
    </div>
  );
}
