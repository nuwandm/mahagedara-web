'use client';

import { useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, PanInfo, useAnimation } from 'framer-motion';
import { Person, Spouse } from '@/types/family';

interface ProfileModalProps {
  person: Person | Spouse | null;
  isOpen: boolean;
  onClose: () => void;
  generationLevel?: number;
}

/**
 * ProfileModal Component - Mobile-First Premium Design
 *
 * Displays detailed information about a family member.
 * Features bottom sheet behavior on mobile with swipe to dismiss,
 * smooth animations, and professional layout.
 */
export default function ProfileModal({
  person,
  isOpen,
  onClose,
  generationLevel = 0,
}: ProfileModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  // Handle escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      // Focus the modal for accessibility
      modalRef.current?.focus();
      // Start the open animation
      controls.start({ opacity: 1, y: 0 });
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown, controls]);

  // Handle swipe to dismiss on mobile
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    } else {
      controls.start({ y: 0 });
    }
  };

  if (!person) return null;

  // Gender-based colors
  const genderGradient = {
    male: 'from-blue-500 via-blue-600 to-indigo-700',
    female: 'from-pink-500 via-rose-600 to-purple-700',
    other: 'from-amber-500 via-orange-600 to-red-700',
  };

  const gender = person.gender || 'other';
  const isDeceased = 'deathYear' in person && person.deathYear;

  // Calculate age or lifespan
  const getAgeInfo = () => {
    const currentYear = new Date().getFullYear();
    if (person.birthYear) {
      if (isDeceased && person.deathYear) {
        const age = person.deathYear - person.birthYear;
        return {
          display: `${person.birthYear} - ${person.deathYear}`,
          age: `Lived ${age} years`,
          icon: '🕊️',
        };
      }
      const age = currentYear - person.birthYear;
      return {
        display: `Born ${person.birthYear}`,
        age: `${age} years old`,
        icon: '🎂',
      };
    }
    return null;
  };

  // Get initials for placeholder
  const getInitials = () => {
    const names = person.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return names[0][0] || '?';
  };

  const ageInfo = getAgeInfo();

  // Generation label
  const getGenerationLabel = () => {
    if (generationLevel === 0) return { label: 'Family Founder', icon: '👑' };
    if (generationLevel === 1) return { label: '1st Generation', icon: '🌟' };
    if (generationLevel === 2) return { label: '2nd Generation', icon: '✨' };
    if (generationLevel === 3) return { label: '3rd Generation', icon: '💫' };
    return { label: `${generationLevel}th Generation`, icon: '⭐' };
  };

  const genInfo = getGenerationLabel();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-backdrop-premium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="presentation"
        >
          <motion.div
            ref={modalRef}
            className="modal-content-premium custom-scrollbar overflow-y-auto"
            initial={{ opacity: 0, y: '100%' }}
            animate={controls}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={handleDragEnd}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            tabIndex={-1}
          >
            {/* Mobile drag handle */}
            <div className="sm:hidden sticky top-0 z-10 bg-gradient-to-b from-white via-white to-transparent pb-2">
              <div className="modal-drag-handle" />
            </div>

            {/* Header with gradient */}
            <div
              className={`relative h-32 sm:h-40 bg-gradient-to-br ${genderGradient[gender]}`}
            >
              {/* Decorative pattern */}
              <div className="absolute inset-0 opacity-10" aria-hidden="true">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <pattern id="profile-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="10" cy="10" r="1" fill="white" />
                  </pattern>
                  <rect x="0" y="0" width="100" height="100" fill="url(#profile-pattern)" />
                </svg>
              </div>

              {/* Close button */}
              <motion.button
                onClick={onClose}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 rounded-full
                         bg-white/20 backdrop-blur-sm text-white
                         flex items-center justify-center
                         active:bg-white/30 transition-all duration-200
                         touch-target z-20"
                whileTap={{ scale: 0.9 }}
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>

              {/* Generation badge */}
              <motion.div
                className="absolute top-3 left-3 sm:top-4 sm:left-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/20 backdrop-blur-sm
                             text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5"
                  aria-label={`Generation: ${genInfo.label}`}
                >
                  <span aria-hidden="true">{genInfo.icon}</span>
                  <span className="hidden sm:inline">{genInfo.label}</span>
                  <span className="sm:hidden">Gen {generationLevel}</span>
                </span>
              </motion.div>

              {/* Deceased banner */}
              {isDeceased && (
                <motion.div
                  className="absolute bottom-3 left-1/2 -translate-x-1/2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span
                    className="px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm
                               text-white text-xs font-medium flex items-center gap-1.5"
                    aria-label="In Loving Memory"
                  >
                    <span aria-hidden="true">🕊️</span>
                    In Loving Memory
                  </span>
                </motion.div>
              )}

              {/* Photo */}
              <motion.div
                className="absolute -bottom-14 sm:-bottom-16 left-1/2 -translate-x-1/2"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: 'spring', damping: 20 }}
              >
                <div className="photo-ring p-1">
                  <div className="photo-ring-inner w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
                    {person.photo ? (
                      <img
                        src={person.photo}
                        alt=""
                        className="w-full h-full object-cover rounded-full"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : null}
                    <div
                      className={`
                        absolute inset-0 flex items-center justify-center rounded-full
                        bg-gradient-to-br ${genderGradient[gender]} text-white
                        text-3xl sm:text-4xl font-bold
                        ${person.photo ? 'opacity-0' : 'opacity-100'}
                      `}
                      aria-hidden="true"
                    >
                      {getInitials()}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Content */}
            <div className="pt-16 sm:pt-20 pb-6 sm:pb-8 px-4 sm:px-6">
              {/* Name */}
              <motion.h2
                id="modal-title"
                className="text-xl sm:text-2xl font-bold text-center text-neutral-800 mb-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {person.name}
              </motion.h2>

              {/* Age info */}
              {ageInfo && (
                <motion.div
                  className="text-center mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-neutral-600 font-medium text-sm">{ageInfo.display}</p>
                  <p className="text-xs text-neutral-500 flex items-center justify-center gap-1">
                    <span aria-hidden="true">{ageInfo.icon}</span>
                    {ageInfo.age}
                  </p>
                </motion.div>
              )}

              {/* Tags */}
              {person.tags && person.tags.length > 0 && (
                <motion.div
                  className="flex flex-wrap gap-1.5 sm:gap-2 justify-center mb-5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  role="list"
                  aria-label="Tags"
                >
                  {person.tags.map((tag, index) => (
                    <span key={index} className="tag-badge text-xs" role="listitem">
                      {tag}
                    </span>
                  ))}
                </motion.div>
              )}

              {/* Decorative line */}
              <div className="decorative-line w-20 mx-auto mb-5" aria-hidden="true" />

              {/* Info Grid */}
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {/* Occupation */}
                {'occupation' in person && person.occupation && (
                  <InfoCard icon="💼" label="Occupation" value={person.occupation} />
                )}

                {/* Birth Place */}
                {'birthPlace' in person && person.birthPlace && (
                  <InfoCard icon="📍" label="Birth Place" value={person.birthPlace} />
                )}

                {/* Location */}
                {'location' in person && person.location && (
                  <InfoCard icon="🏠" label="Location" value={person.location} />
                )}

                {/* Bio */}
                {person.bio && (
                  <motion.div
                    className="mt-4 p-3 sm:p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50
                             border border-amber-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <span aria-hidden="true">📖</span>
                      About
                    </h3>
                    <p className="text-neutral-700 leading-relaxed text-sm">
                      {person.bio}
                    </p>
                  </motion.div>
                )}
              </motion.div>

              {/* Contact Info */}
              {'email' in person && (person.email || person.phone) && (
                <motion.div
                  className="mt-5 pt-5 border-t border-neutral-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <span aria-hidden="true">📬</span>
                    Contact
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {person.email && (
                      <a
                        href={`mailto:${person.email}`}
                        className="p-3 rounded-xl bg-blue-50 text-blue-700
                                 active:bg-blue-100 transition-colors flex items-center gap-2.5
                                 touch-target"
                      >
                        <span className="text-lg" aria-hidden="true">📧</span>
                        <span className="truncate text-sm font-medium">{person.email}</span>
                      </a>
                    )}
                    {person.phone && (
                      <a
                        href={`tel:${person.phone}`}
                        className="p-3 rounded-xl bg-green-50 text-green-700
                                 active:bg-green-100 transition-colors flex items-center gap-2.5
                                 touch-target"
                      >
                        <span className="text-lg" aria-hidden="true">📱</span>
                        <span className="text-sm font-medium">{person.phone}</span>
                      </a>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Close Button - More prominent on mobile */}
              <motion.button
                onClick={onClose}
                className="btn-premium w-full mt-6"
                whileTap={{ scale: 0.98 }}
              >
                Close Profile
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Helper component for info cards
function InfoCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-neutral-50 active:bg-neutral-100
                  transition-colors">
      <div
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-sm flex items-center justify-center
                  text-lg sm:text-xl flex-shrink-0"
        aria-hidden="true"
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-wider font-semibold">
          {label}
        </p>
        <p className="text-neutral-800 font-medium text-sm truncate">{value}</p>
      </div>
    </div>
  );
}
