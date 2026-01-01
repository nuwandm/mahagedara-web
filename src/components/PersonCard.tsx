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
 * PersonCard Component - Mobile-First Premium Design
 *
 * Displays an individual family member with elegant styling,
 * smooth animations, and professional visual hierarchy.
 * Fully optimized for touch interactions and mobile devices.
 */
export default function PersonCard({
  person,
  isHighlighted = false,
  isRootMember = false,
  onClick,
  size = 'medium',
}: PersonCardProps) {
  // Responsive size configurations - Mobile first approach
  const sizeConfig = {
    small: {
      card: 'w-[120px] sm:w-[140px]',
      photo: 'w-14 h-14 sm:w-16 sm:h-16',
      ring: 'p-[2px]',
      name: 'text-xs sm:text-sm',
      age: 'text-[10px] sm:text-xs',
      padding: 'p-3',
      tagSize: 'text-[9px] sm:text-[10px] px-1.5 py-0.5',
    },
    medium: {
      card: 'w-[140px] sm:w-[160px] md:w-[180px]',
      photo: 'w-16 h-16 sm:w-20 sm:h-20',
      ring: 'p-[3px]',
      name: 'text-sm sm:text-base',
      age: 'text-[10px] sm:text-xs',
      padding: 'p-3 sm:p-4',
      tagSize: 'text-[10px] sm:text-xs px-2 py-0.5',
    },
    large: {
      card: 'w-[160px] sm:w-[180px] md:w-[200px]',
      photo: 'w-20 h-20 sm:w-24 sm:h-24',
      ring: 'p-[3px]',
      name: 'text-base sm:text-lg',
      age: 'text-xs sm:text-sm',
      padding: 'p-4 sm:p-5',
      tagSize: 'text-xs px-2.5 py-1',
    },
  };

  const config = sizeConfig[size];

  // Gender-based gradient colors for visual distinction
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
      return { years: `${person.birthYear} - ${person.deathYear}`, age: `${age} yrs` };
    }
    if (person.birthYear) {
      const age = currentYear - person.birthYear;
      return { years: `b. ${person.birthYear}`, age: `${age} yrs` };
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
        select-none-touch
      `}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      aria-label={`View profile of ${person.name}${isDeceased ? ', deceased' : ''}`}
    >
      {/* Photo Container with Gradient Ring */}
      <div className="relative mb-2 sm:mb-3">
        {/* Animated glow effect - only on larger screens */}
        <motion.div
          className={`absolute -inset-1.5 sm:-inset-2 rounded-full bg-gradient-to-br ${genderGradient[gender]} opacity-20 blur-md hidden sm:block`}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.35, 0.2],
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
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
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
                font-bold text-lg sm:text-xl
                ${person.photo ? 'opacity-0' : 'opacity-100'}
              `}
              aria-hidden="true"
            >
              {getInitials()}
            </div>
          </div>
        </div>

        {/* Deceased indicator */}
        {isDeceased && (
          <div
            className="absolute -top-0.5 -right-0.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full
                       bg-neutral-600 flex items-center justify-center
                       border-2 border-white shadow-md"
            title="In Loving Memory"
            aria-label="Deceased"
          >
            <span className="text-white text-[10px] sm:text-xs" aria-hidden="true">✝</span>
          </div>
        )}

        {/* Root member crown */}
        {isRootMember && (
          <div
            className="absolute -top-2.5 left-1/2 -translate-x-1/2"
            aria-label="Family founder"
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center">
              <span className="text-lg sm:text-xl filter drop-shadow-md" aria-hidden="true">👑</span>
            </div>
          </div>
        )}

        {/* Living indicator */}
        {!isDeceased && (
          <div
            className="absolute bottom-0 right-0 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full
                       bg-green-400 border-2 border-white shadow-sm"
            aria-label="Living"
          />
        )}
      </div>

      {/* Name */}
      <h3
        className={`
          ${config.name} font-bold text-neutral-800 text-center
          line-clamp-2 leading-tight mb-0.5
        `}
      >
        {person.name}
      </h3>

      {/* Age/Lifespan */}
      {ageInfo && (
        <p className={`${config.age} text-neutral-500 font-medium text-center`}>
          {ageInfo.age}
        </p>
      )}

      {/* Tags (show first 2) */}
      {person.tags && person.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 justify-center mt-1.5 sm:mt-2" role="list" aria-label="Tags">
          {person.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className={`tag-badge ${config.tagSize}`}
              role="listitem"
            >
              {tag}
            </span>
          ))}
          {person.tags.length > 2 && (
            <span className="text-[10px] text-neutral-400 self-center" aria-label={`${person.tags.length - 2} more tags`}>
              +{person.tags.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Tap indicator - visible on touch devices */}
      <div
        className="absolute bottom-1.5 right-1.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full
                   bg-amber-100/80 flex items-center justify-center opacity-60"
        aria-hidden="true"
      >
        <svg
          className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </motion.div>
  );
}
