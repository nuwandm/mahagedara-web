'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Person, Spouse } from '@/types/family';

interface ProfileModalProps {
  person: Person | Spouse | null;
  isOpen: boolean;
  onClose: () => void;
  generationLevel?: number;
}

/**
 * ProfileModal Component - Premium Design
 *
 * Displays detailed information about a family member in an elegant modal.
 * Features smooth animations, beautiful gradients, and professional layout.
 */
export default function ProfileModal({
  person,
  isOpen,
  onClose,
  generationLevel = 0,
}: ProfileModalProps) {
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
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

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
        >
          <motion.div
            className="modal-content-premium custom-scrollbar"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with gradient */}
            <div
              className={`relative h-36 sm:h-44 bg-gradient-to-br ${genderGradient[gender]}`}
            >
              {/* Decorative pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <pattern id="pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="10" cy="10" r="1" fill="white" />
                  </pattern>
                  <rect x="0" y="0" width="100" height="100" fill="url(#pattern)" />
                </svg>
              </div>

              {/* Close button */}
              <motion.button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full
                         bg-white/20 backdrop-blur-sm text-white
                         flex items-center justify-center
                         hover:bg-white/30 transition-all duration-300
                         touch-target"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>

              {/* Generation badge */}
              <motion.div
                className="absolute top-4 left-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm
                               text-white text-sm font-semibold flex items-center gap-2">
                  <span>{genInfo.icon}</span>
                  {genInfo.label}
                </span>
              </motion.div>

              {/* Deceased banner */}
              {isDeceased && (
                <motion.div
                  className="absolute top-4 left-1/2 -translate-x-1/2"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="px-4 py-2 rounded-full bg-black/30 backdrop-blur-sm
                                 text-white text-sm font-medium flex items-center gap-2">
                    <span>🕊️</span>
                    In Loving Memory
                  </span>
                </motion.div>
              )}

              {/* Photo */}
              <motion.div
                className="absolute -bottom-16 left-1/2 -translate-x-1/2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: 'spring', damping: 20 }}
              >
                <div className="photo-ring p-1.5">
                  <div className="photo-ring-inner w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center">
                    {person.photo ? (
                      <img
                        src={person.photo}
                        alt={person.name}
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : null}
                    <div
                      className={`
                        absolute inset-0 flex items-center justify-center rounded-full
                        bg-gradient-to-br ${genderGradient[gender]} text-white
                        text-4xl font-bold
                        ${person.photo ? 'opacity-0' : 'opacity-100'}
                      `}
                    >
                      {getInitials()}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Content */}
            <div className="pt-20 pb-8 px-6 sm:px-8">
              {/* Name */}
              <motion.h2
                className="text-2xl sm:text-3xl font-bold text-center text-neutral-800 mb-2"
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
                  <p className="text-neutral-600 font-medium">{ageInfo.display}</p>
                  <p className="text-sm text-neutral-500 flex items-center justify-center gap-1">
                    <span>{ageInfo.icon}</span>
                    {ageInfo.age}
                  </p>
                </motion.div>
              )}

              {/* Tags */}
              {person.tags && person.tags.length > 0 && (
                <motion.div
                  className="flex flex-wrap gap-2 justify-center mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {person.tags.map((tag, index) => (
                    <span key={index} className="tag-badge">
                      {tag}
                    </span>
                  ))}
                </motion.div>
              )}

              {/* Decorative line */}
              <div className="decorative-line w-24 mx-auto mb-6" />

              {/* Info Grid */}
              <motion.div
                className="space-y-4"
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
                  <InfoCard icon="🏠" label="Current Location" value={person.location} />
                )}

                {/* Bio */}
                {person.bio && (
                  <motion.div
                    className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50
                             border border-amber-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <span>📖</span>
                      About
                    </h3>
                    <p className="text-neutral-700 leading-relaxed">
                      {person.bio}
                    </p>
                  </motion.div>
                )}
              </motion.div>

              {/* Contact Info */}
              {'email' in person && (person.email || person.phone) && (
                <motion.div
                  className="mt-6 pt-6 border-t border-neutral-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span>📬</span>
                    Contact
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {person.email && (
                      <a
                        href={`mailto:${person.email}`}
                        className="flex-1 min-w-[200px] p-3 rounded-xl bg-blue-50 text-blue-700
                                 hover:bg-blue-100 transition-colors flex items-center gap-3"
                      >
                        <span className="text-xl">📧</span>
                        <span className="truncate">{person.email}</span>
                      </a>
                    )}
                    {person.phone && (
                      <a
                        href={`tel:${person.phone}`}
                        className="flex-1 min-w-[200px] p-3 rounded-xl bg-green-50 text-green-700
                                 hover:bg-green-100 transition-colors flex items-center gap-3"
                      >
                        <span className="text-xl">📱</span>
                        <span>{person.phone}</span>
                      </a>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Close Button */}
              <motion.button
                onClick={onClose}
                className="btn-premium w-full mt-8"
                whileHover={{ scale: 1.02 }}
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
    <div className="flex items-center gap-4 p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100
                  transition-colors">
      <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center
                    text-xl">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">
          {label}
        </p>
        <p className="text-neutral-800 font-medium truncate">{value}</p>
      </div>
    </div>
  );
}
