'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, PanInfo, useAnimation } from 'framer-motion';
import Link from 'next/link';
import { EventCard, GoogleDriveGallery } from '@/components';
import { FamilyEvent } from '@/types/family';
import eventsData from '@/data/eventsData.json';

type FilterType = 'all' | 'upcoming' | 'past';
type EventType = FamilyEvent['type'] | 'all';

const eventTypeLabels: Record<FamilyEvent['type'], string> = {
  celebration: 'Celebration',
  reunion: 'Reunion',
  wedding: 'Wedding',
  birthday: 'Birthday',
  memorial: 'Memorial',
  holiday: 'Holiday',
  other: 'Other',
};

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<FamilyEvent | null>(null);
  const [statusFilter, setStatusFilter] = useState<FilterType>('all');
  const [typeFilter, setTypeFilter] = useState<EventType>('all');
  const modalRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  // Handle escape key for modal
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedEvent) {
        setSelectedEvent(null);
      }
    },
    [selectedEvent]
  );

  useEffect(() => {
    if (selectedEvent) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      modalRef.current?.focus();
      // Start the open animation
      controls.start({ opacity: 1, y: 0 });
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedEvent, handleKeyDown, controls]);

  // Handle swipe to dismiss on mobile
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      setSelectedEvent(null);
    } else {
      controls.start({ y: 0 });
    }
  };

  const events = eventsData.events as FamilyEvent[];

  // Filter events based on selected filters
  const filteredEvents = useMemo(() => {
    return events
      .filter((event) => {
        if (statusFilter !== 'all' && event.status !== statusFilter) return false;
        if (typeFilter !== 'all' && event.type !== typeFilter) return false;
        return true;
      })
      .sort((a, b) => {
        // Sort upcoming first, then by date
        if (a.status === 'upcoming' && b.status === 'past') return -1;
        if (a.status === 'past' && b.status === 'upcoming') return 1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  }, [events, statusFilter, typeFilter]);

  const upcomingCount = events.filter((e) => e.status === 'upcoming').length;
  const pastCount = events.filter((e) => e.status === 'past').length;

  return (
    <main className="min-h-screen pb-safe">
      {/* Header */}
      <header className="relative py-8 sm:py-12 px-4 overflow-hidden pt-safe">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-40 -right-40 w-60 sm:w-80 h-60 sm:h-80 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-60 sm:w-80 h-60 sm:h-80 rounded-full bg-indigo-500/10 blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Navigation */}
          <nav className="flex items-center justify-between mb-6 sm:mb-8">
            <Link
              href="/"
              className="nav-link flex items-center gap-2 touch-target"
              aria-label="Back to Family Tree"
            >
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span className="hidden sm:inline">Back to Family Tree</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </nav>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
              Family <span className="text-gradient-gold">Events</span>
            </h1>
            <p className="text-white/60 text-sm sm:text-lg max-w-2xl mx-auto px-2">
              Celebrate our family milestones, reunions, and special moments together.
              <span className="hidden sm:inline"> Browse past memories and mark your calendar for upcoming gatherings.</span>
            </p>
          </motion.div>

          {/* Stats - Horizontal scroll on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center gap-4 sm:gap-8 mt-6 sm:mt-8 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0"
            role="group"
            aria-label="Event statistics"
          >
            <div className="text-center flex-shrink-0 min-w-[80px]">
              <div className="text-2xl sm:text-3xl font-bold text-gradient-gold">{upcomingCount}</div>
              <div className="text-white/50 text-xs sm:text-sm">Upcoming</div>
            </div>
            <div className="w-px bg-white/20 flex-shrink-0" aria-hidden="true" />
            <div className="text-center flex-shrink-0 min-w-[80px]">
              <div className="text-2xl sm:text-3xl font-bold text-gradient-gold">{pastCount}</div>
              <div className="text-white/50 text-xs sm:text-sm">Past</div>
            </div>
            <div className="w-px bg-white/20 flex-shrink-0" aria-hidden="true" />
            <div className="text-center flex-shrink-0 min-w-[80px]">
              <div className="text-2xl sm:text-3xl font-bold text-gradient-gold">{events.length}</div>
              <div className="text-white/50 text-xs sm:text-sm">Total</div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Filters */}
      <section className="px-4 py-4 sm:py-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-4 sm:p-6"
          >
            <div className="flex flex-col gap-4 sm:gap-6 sm:flex-row sm:items-center sm:justify-between">
              {/* Status Filter */}
              <fieldset className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <legend className="text-white/70 text-xs sm:text-sm font-medium mb-2 sm:mb-0">
                  Status:
                </legend>
                <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 -mx-1 px-1" role="group">
                  {(['all', 'upcoming', 'past'] as FilterType[]).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setStatusFilter(filter)}
                      className={`filter-chip whitespace-nowrap touch-target ${statusFilter === filter ? 'active' : ''}`}
                      aria-pressed={statusFilter === filter}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Type Filter */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label htmlFor="type-filter" className="text-white/70 text-xs sm:text-sm font-medium">
                  Type:
                </label>
                <select
                  id="type-filter"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as EventType)}
                  className="w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-xl bg-white/10 text-white
                           border border-white/20 focus:border-amber-500 focus:outline-none
                           text-sm touch-target appearance-none cursor-pointer"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white' stroke-width='2'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px', paddingRight: '40px' }}
                >
                  <option value="all">All Types</option>
                  {Object.entries(eventTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="px-4 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          {filteredEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 sm:py-16"
            >
              <div className="text-5xl sm:text-6xl mb-4" aria-hidden="true">📅</div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No events found</h3>
              <p className="text-white/50 text-sm sm:text-base">
                Try adjusting your filters to see more events.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.05, 0.3) }}
                >
                  <EventCard
                    event={event}
                    onClick={() => setSelectedEvent(event)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Event Detail Modal - Mobile Bottom Sheet */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-backdrop-premium"
            onClick={() => setSelectedEvent(null)}
            role="presentation"
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, y: '100%' }}
              animate={controls}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="modal-content-premium custom-scrollbar overflow-y-auto max-h-[90vh] sm:max-h-[85vh]
                        sm:my-8 sm:max-w-4xl bg-gradient-to-b from-slate-900 to-slate-950"
              onClick={(e) => e.stopPropagation()}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.5 }}
              onDragEnd={handleDragEnd}
              role="dialog"
              aria-modal="true"
              aria-labelledby="event-modal-title"
              tabIndex={-1}
            >
              {/* Mobile drag handle */}
              <div className="sm:hidden sticky top-0 z-10 bg-gradient-to-b from-slate-900 via-slate-900 to-transparent pb-2">
                <div className="modal-drag-handle" />
              </div>

              {/* Close Button */}
              <motion.button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-10 h-10
                         bg-black/50 active:bg-black/70 text-white rounded-full
                         flex items-center justify-center transition-colors touch-target"
                whileTap={{ scale: 0.9 }}
                aria-label="Close event details"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>

              {/* Header */}
              <div className="p-4 sm:p-8 border-b border-white/10">
                <div className="flex flex-wrap items-start gap-2 mb-3 sm:mb-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase ${
                      selectedEvent.status === 'upcoming'
                        ? 'bg-green-500 text-white'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    {selectedEvent.status === 'upcoming' ? 'Upcoming' : 'Past Event'}
                  </span>
                  <span className="px-2.5 py-1 bg-white/10 text-white/70 rounded-full text-[10px] sm:text-xs font-medium">
                    {eventTypeLabels[selectedEvent.type]}
                  </span>
                </div>

                <h2
                  id="event-modal-title"
                  className="text-xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 pr-10"
                >
                  {selectedEvent.title}
                </h2>

                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-6 text-white/70 text-sm">
                  <div className="flex items-center gap-2">
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
                      {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  {selectedEvent.location && (
                    <div className="flex items-center gap-2">
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
                      <span className="text-xs sm:text-sm">{selectedEvent.location}</span>
                    </div>
                  )}

                  {selectedEvent.organizer && (
                    <div className="flex items-center gap-2">
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span className="text-xs sm:text-sm">By {selectedEvent.organizer}</span>
                    </div>
                  )}

                  {selectedEvent.attendeeCount && (
                    <div className="flex items-center gap-2">
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
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-xs sm:text-sm">{selectedEvent.attendeeCount} attendees</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="p-4 sm:p-8 border-b border-white/10">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">About This Event</h3>
                <p className="text-white/70 leading-relaxed text-sm sm:text-base">
                  {selectedEvent.description}
                </p>

                {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4" role="list" aria-label="Event tags">
                    {selectedEvent.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 sm:px-3 py-0.5 sm:py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs sm:text-sm"
                        role="listitem"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Photo Gallery */}
              {selectedEvent.status === 'past' && selectedEvent.googleDriveFolderId && (
                <div className="p-4 sm:p-8">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Event Photos
                  </h3>
                  <GoogleDriveGallery
                    folderId={selectedEvent.googleDriveFolderId}
                    eventTitle={selectedEvent.title}
                  />
                </div>
              )}

              {/* Upcoming Event Actions */}
              {selectedEvent.status === 'upcoming' && (
                <div className="p-4 sm:p-8 bg-gradient-to-r from-amber-500/10 to-orange-500/10">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                    <div className="text-center sm:text-left">
                      <h3 className="text-base sm:text-lg font-semibold text-white">
                        Don&apos;t miss this event!
                      </h3>
                      <p className="text-white/60 text-xs sm:text-sm">
                        Mark your calendar and join us.
                      </p>
                    </div>
                    <motion.button
                      className="btn-premium whitespace-nowrap w-full sm:w-auto"
                      whileTap={{ scale: 0.98 }}
                    >
                      Add to Calendar
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Close Button - Mobile */}
              <div className="p-4 sm:hidden">
                <motion.button
                  onClick={() => setSelectedEvent(null)}
                  className="btn-premium w-full"
                  whileTap={{ scale: 0.98 }}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-8 text-center text-white/40 text-sm">
        <p>Family Events &bull; Preserving Our Memories Together</p>
      </footer>
    </main>
  );
}
