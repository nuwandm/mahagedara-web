'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <main className="min-h-screen">
      {/* Header */}
      <header className="relative py-12 px-4 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
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
              <span>Back to Family Tree</span>
            </Link>
          </div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Family <span className="text-gradient-gold">Events</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Celebrate our family milestones, reunions, and special moments together.
              Browse past memories and mark your calendar for upcoming gatherings.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center gap-8 mt-8"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient-gold">{upcomingCount}</div>
              <div className="text-white/50 text-sm">Upcoming Events</div>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient-gold">{pastCount}</div>
              <div className="text-white/50 text-sm">Past Events</div>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient-gold">{events.length}</div>
              <div className="text-white/50 text-sm">Total Events</div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Filters */}
      <section className="px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              {/* Status Filter */}
              <div className="flex items-center gap-4">
                <span className="text-white/70 text-sm font-medium">Status:</span>
                <div className="flex gap-2">
                  {(['all', 'upcoming', 'past'] as FilterType[]).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setStatusFilter(filter)}
                      className={`filter-chip ${statusFilter === filter ? 'active' : ''}`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div className="flex items-center gap-4">
                <span className="text-white/70 text-sm font-medium">Type:</span>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as EventType)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white border border-white/20 focus:border-amber-500 focus:outline-none"
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
      <section className="px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {filteredEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-white mb-2">No events found</h3>
              <p className="text-white/50">
                Try adjusting your filters to see more events.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
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

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl my-8 rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Header */}
              <div className="p-8 border-b border-white/10">
                <div className="flex items-start gap-4 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      selectedEvent.status === 'upcoming'
                        ? 'bg-green-500 text-white'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    {selectedEvent.status === 'upcoming' ? 'Upcoming' : 'Past Event'}
                  </span>
                  <span className="px-3 py-1 bg-white/10 text-white/70 rounded-full text-xs font-medium">
                    {eventTypeLabels[selectedEvent.type]}
                  </span>
                </div>

                <h2 className="text-3xl font-bold text-white mb-4">
                  {selectedEvent.title}
                </h2>

                <div className="flex flex-wrap gap-6 text-white/70">
                  <div className="flex items-center gap-2">
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
                    <span>
                      {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  {selectedEvent.location && (
                    <div className="flex items-center gap-2">
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
                      <span>{selectedEvent.location}</span>
                    </div>
                  )}

                  {selectedEvent.organizer && (
                    <div className="flex items-center gap-2">
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span>Organized by {selectedEvent.organizer}</span>
                    </div>
                  )}

                  {selectedEvent.attendeeCount && (
                    <div className="flex items-center gap-2">
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
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>{selectedEvent.attendeeCount} attendees</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="p-8 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3">About This Event</h3>
                <p className="text-white/70 leading-relaxed">
                  {selectedEvent.description}
                </p>

                {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedEvent.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Photo Gallery */}
              {selectedEvent.status === 'past' && selectedEvent.googleDriveFolderId && (
                <div className="p-8">
                  <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <svg
                      className="w-6 h-6 text-amber-500"
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
                <div className="p-8 bg-gradient-to-r from-amber-500/10 to-orange-500/10">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Don&apos;t miss this event!
                      </h3>
                      <p className="text-white/60 text-sm">
                        Mark your calendar and join us for this special occasion.
                      </p>
                    </div>
                    <button className="btn-premium whitespace-nowrap">
                      Add to Calendar
                    </button>
                  </div>
                </div>
              )}
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
