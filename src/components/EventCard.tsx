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

export default function EventCard({ event, onClick }: EventCardProps) {
  const eventDate = new Date(event.date);
  const isUpcoming = event.status === 'upcoming';
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const daysUntilEvent = Math.ceil(
    (eventDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-2xl bg-white/95 shadow-xl transition-all duration-300 hover:shadow-2xl">
        {/* Status Badge */}
        <div
          className={`absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            isUpcoming
              ? 'bg-green-500 text-white'
              : 'bg-amber-500 text-white'
          }`}
        >
          {isUpcoming ? 'Upcoming' : 'Past Event'}
        </div>

        {/* Event Type Icon Header */}
        <div
          className={`h-32 bg-gradient-to-r ${eventTypeColors[event.type]} flex items-center justify-center`}
        >
          <span className="text-6xl">{eventTypeIcons[event.type]}</span>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-amber-600 transition-colors">
            {event.title}
          </h3>

          {/* Date */}
          <div className="flex items-center gap-2 text-gray-600 mb-3">
            <svg
              className="w-5 h-5"
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
            <span className="text-sm">{formattedDate}</span>
          </div>

          {/* Countdown for upcoming events */}
          {isUpcoming && daysUntilEvent > 0 && (
            <div className="mb-3 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
              <span className="text-green-700 font-semibold text-sm">
                {daysUntilEvent} days to go!
              </span>
            </div>
          )}

          {/* Location */}
          {event.location && (
            <div className="flex items-center gap-2 text-gray-600 mb-3">
              <svg
                className="w-5 h-5"
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
              <span className="text-sm">{event.location}</span>
            </div>
          )}

          {/* Description */}
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {event.description}
          </p>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {event.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            {event.attendeeCount && (
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <svg
                  className="w-4 h-4"
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
                <span>{event.attendeeCount} attendees</span>
              </div>
            )}

            {/* View Photos button for past events */}
            {event.status === 'past' && event.googleDriveFolderId && (
              <span className="text-amber-600 font-medium text-sm flex items-center gap-1">
                View Photos
                <svg
                  className="w-4 h-4"
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
          </div>
        </div>
      </div>
    </motion.div>
  );
}
