'use client';

import { motion } from 'framer-motion';
import { FamilyEvent } from '@/types/family';

interface EventCardProps {
  event: FamilyEvent;
  onClick: () => void;
}

const eventTypeIcons: Record<FamilyEvent['type'], string> = {
  celebration: '🎉',
  reunion: '👨‍👩‍👧‍👦',
  wedding: '💒',
  birthday: '🎂',
  memorial: '🕯️',
  holiday: '🎄',
  other: '📅',
};

const eventTypeColors: Record<FamilyEvent['type'], string> = {
  celebration: 'from-amber-400 to-orange-500',
  reunion: 'from-blue-400 to-indigo-500',
  wedding: 'from-pink-400 to-rose-500',
  birthday: 'from-purple-400 to-violet-500',
  memorial: 'from-gray-400 to-slate-500',
  holiday: 'from-green-400 to-emerald-500',
  other: 'from-cyan-400 to-teal-500',
};

/**
 * EventCard Component - Mobile-First Design
 *
 * Displays an event card with touch-optimized interactions,
 * smooth animations, and responsive layout.
 */
export default function EventCard({ event, onClick }: EventCardProps) {
  const eventDate = new Date(event.date);
  const isUpcoming = event.status === 'upcoming';

  // Shorter date format on mobile
  const formattedDateMobile = eventDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const formattedDateDesktop = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const daysUntilEvent = Math.ceil(
    (eventDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="group cursor-pointer select-none touch-manipulation"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`${event.title} - ${isUpcoming ? 'Upcoming' : 'Past'} ${event.type} event on ${formattedDateDesktop}`}
    >
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-white/95 shadow-lg
                    transition-all duration-300 active:shadow-md sm:hover:shadow-2xl sm:hover:-translate-y-2">
        {/* Status Badge */}
        <div
          className={`absolute top-2 right-2 sm:top-4 sm:right-4 z-10 px-2 py-0.5 sm:px-3 sm:py-1
                    rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
            isUpcoming
              ? 'bg-green-500 text-white'
              : 'bg-amber-500 text-white'
          }`}
        >
          {isUpcoming ? 'Upcoming' : 'Past'}
        </div>

        {/* Event Type Icon Header */}
        <div
          className={`h-24 sm:h-32 bg-gradient-to-r ${eventTypeColors[event.type]} flex items-center justify-center`}
          aria-hidden="true"
        >
          <span className="text-4xl sm:text-6xl">{eventTypeIcons[event.type]}</span>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {/* Title */}
          <h3 className="text-base sm:text-xl font-bold text-gray-800 mb-1.5 sm:mb-2
                       group-active:text-amber-600 sm:group-hover:text-amber-600 transition-colors
                       line-clamp-2">
            {event.title}
          </h3>

          {/* Date */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-600 mb-2 sm:mb-3">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-xs sm:text-sm">
              <span className="sm:hidden">{formattedDateMobile}</span>
              <span className="hidden sm:inline">{formattedDateDesktop}</span>
            </span>
          </div>

          {/* Countdown for upcoming events */}
          {isUpcoming && daysUntilEvent > 0 && (
            <div className="mb-2 sm:mb-3 px-2 sm:px-3 py-1.5 sm:py-2 bg-green-50 rounded-lg border border-green-200">
              <span className="text-green-700 font-semibold text-xs sm:text-sm">
                {daysUntilEvent} {daysUntilEvent === 1 ? 'day' : 'days'} to go!
              </span>
            </div>
          )}

          {/* Location */}
          {event.location && (
            <div className="flex items-center gap-1.5 sm:gap-2 text-gray-600 mb-2 sm:mb-3">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-xs sm:text-sm truncate">{event.location}</span>
            </div>
          )}

          {/* Description */}
          <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 mb-3 sm:mb-4">
            {event.description}
          </p>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4" role="list" aria-label="Event tags">
              {event.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-indigo-50 text-indigo-600 rounded-full
                           text-[10px] sm:text-xs font-medium"
                  role="listitem"
                >
                  #{tag}
                </span>
              ))}
              {event.tags.length > 2 && (
                <span className="text-[10px] sm:text-xs text-gray-400 self-center">
                  +{event.tags.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100">
            {event.attendeeCount ? (
              <div className="flex items-center gap-1 text-gray-500 text-xs sm:text-sm">
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{event.attendeeCount}</span>
              </div>
            ) : (
              <div />
            )}

            {/* View Photos button for past events */}
            {event.status === 'past' && event.googleDriveFolderId && (
              <span className="text-amber-600 font-medium text-xs sm:text-sm flex items-center gap-1">
                <span className="hidden sm:inline">View</span> Photos
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4"
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
              </span>
            )}

            {/* Tap indicator for mobile */}
            <div
              className="w-6 h-6 rounded-full bg-amber-100/80 flex items-center justify-center opacity-50 sm:opacity-0"
              aria-hidden="true"
            >
              <svg
                className="w-3 h-3 text-amber-600"
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
          </div>
        </div>
      </div>
    </motion.article>
  );
}
