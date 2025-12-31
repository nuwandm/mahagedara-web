'use client';

import { motion } from 'framer-motion';
import { Person, Spouse } from '@/types/family';

interface PersonCardProps {
  person: Person | Spouse;
  isHighlighted?: boolean;
  isRootMember?: boolean;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
}

/**
 * PersonCard Component - Premium Design
 *
 * Displays an individual family member with elegant styling,
 * smooth animations, and professional visual hierarchy.
 */
export default function PersonCard({
  person,
  isHighlighted = false,
  isRootMember = false,
  onClick,
  size = 'medium',
}: PersonCardProps) {
  // Determine card dimensions based on size
  const sizeConfig = {
    small: {
      card: 'w-32 sm:w-36',
      photo: 'w-16 h-16 sm:w-18 sm:h-18',
      ring: 'p-0.5',
      name: 'text-xs sm:text-sm',
      padding: 'p-3 sm:p-4',
    },
    medium: {
      card: 'w-40 sm:w-48',
      photo: 'w-20 h-20 sm:w-24 sm:h-24',
      ring: 'p-1',
      name: 'text-sm sm:text-base',
      padding: 'p-4 sm:p-5',
    },
    large: {
      card: 'w-48 sm:w-56',
      photo: 'w-24 h-24 sm:w-28 sm:h-28',
      ring: 'p-1',
      name: 'text-base sm:text-lg',
      padding: 'p-5 sm:p-6',
    },
  };

  const config = sizeConfig[size];

  // Gender-based gradient colors
  const genderGradient = {
    male: 'from-blue-400 via-blue-500 to-indigo-600',
    female: 'from-pink-400 via-rose-500 to-purple-600',
    other: 'from-amber-400 via-orange-500 to-red-600',
  };

  const gender = person.gender || 'other';
  const isDeceased = 'deathYear' in person && person.deathYear;

  // Calculate age or lifespan
  const getAgeDisplay = () => {
    const currentYear = new Date().getFullYear();
    if (isDeceased && person.birthYear) {
      const age = person.deathYear! - person.birthYear;
      return { years: `${person.birthYear} - ${person.deathYear}`, age: `${age} years` };
    }
    if (person.birthYear) {
      const age = currentYear - person.birthYear;
      return { years: `Born ${person.birthYear}`, age: `${age} years` };
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

  const ageInfo = getAgeDisplay();

  return (
    <motion.div
      className={`
        person-card ${config.card} ${config.padding} flex flex-col items-center
        ${isHighlighted ? 'highlighted' : ''}
        ${isRootMember ? 'root-member' : ''}
        touch-target group
      `}
      onClick={onClick}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      }}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.();
        }
      }}
      aria-label={`View profile of ${person.name}`}
    >
      {/* Photo Container with Gradient Ring */}
      <div className="relative mb-3 sm:mb-4">
        {/* Animated glow effect */}
        <motion.div
          className={`absolute -inset-2 rounded-full bg-gradient-to-br ${genderGradient[gender]} opacity-30 blur-lg`}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Gradient Ring */}
        <div className={`photo-ring ${config.ring}`}>
          <div className={`photo-ring-inner ${config.photo}`}>
            {person.photo ? (
              <img
                src={person.photo}
                alt={person.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : null}

            {/* Initials Fallback */}
            <div
              className={`
                absolute inset-0 flex items-center justify-center
                bg-gradient-to-br ${genderGradient[gender]} text-white
                font-bold text-xl sm:text-2xl
                ${person.photo ? 'opacity-0' : 'opacity-100'}
              `}
            >
              {getInitials()}
            </div>
          </div>
        </div>

        {/* Deceased indicator */}
        {isDeceased && (
          <motion.div
            className="absolute -top-1 -right-1 w-7 h-7 rounded-full
                       bg-neutral-700 flex items-center justify-center
                       border-2 border-white shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            title="In Loving Memory"
          >
            <span className="text-white text-xs">✝</span>
          </motion.div>
        )}

        {/* Root member crown */}
        {isRootMember && (
          <motion.div
            className="absolute -top-3 left-1/2 -translate-x-1/2"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <span className="text-2xl filter drop-shadow-lg">👑</span>
            </div>
          </motion.div>
        )}

        {/* Online/Living indicator */}
        {!isDeceased && (
          <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full
                         bg-green-400 border-2 border-white shadow-md" />
        )}
      </div>

      {/* Name */}
      <h3
        className={`
          ${config.name} font-bold text-neutral-800 text-center
          line-clamp-2 leading-tight mb-1
        `}
      >
        {person.name}
      </h3>

      {/* Age/Lifespan */}
      {ageInfo && (
        <div className="text-center mb-2">
          <p className="text-xs text-neutral-500 font-medium">
            {ageInfo.age}
          </p>
        </div>
      )}

      {/* Tags (show first 2) */}
      {person.tags && person.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 justify-center mt-auto">
          {person.tags.slice(0, 2).map((tag, index) => (
            <motion.span
              key={index}
              className="tag-badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
            >
              {tag}
            </motion.span>
          ))}
          {person.tags.length > 2 && (
            <span className="text-xs text-neutral-400 self-center">
              +{person.tags.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Hover indicator */}
      <motion.div
        className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100
                   transition-opacity duration-300"
        initial={false}
      >
        <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
          <svg
            className="w-3 h-3 text-amber-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </motion.div>
    </motion.div>
  );
}
