'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';

interface GoogleDriveGalleryProps {
  folderId: string;
  eventTitle: string;
  /** Optional: Individual image IDs from Google Drive for better display */
  imageIds?: string[];
}

/**
 * Google Drive Gallery Component - Mobile-First Design
 *
 * How to use with Google Drive:
 * 1. Create a folder in Google Drive for your event photos
 * 2. Share the folder: Right-click > Share > Change to "Anyone with the link"
 * 3. Copy the folder ID from the URL: https://drive.google.com/drive/folders/FOLDER_ID
 * 4. Pass the FOLDER_ID to this component
 *
 * For individual images (better quality display):
 * 1. Share each image publicly
 * 2. Get the file ID from the share link
 * 3. Pass the IDs in the imageIds array
 */
export default function GoogleDriveGallery({
  folderId,
  eventTitle,
  imageIds = [],
}: GoogleDriveGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'embed'>('embed');
  const [isLoading, setIsLoading] = useState(true);

  // Handle keyboard navigation in lightbox
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!selectedImage || imageIds.length <= 1) return;

      const currentIndex = imageIds.indexOf(selectedImage);
      if (e.key === 'ArrowLeft') {
        const prevIndex = currentIndex === 0 ? imageIds.length - 1 : currentIndex - 1;
        setSelectedImage(imageIds[prevIndex]);
      } else if (e.key === 'ArrowRight') {
        const nextIndex = currentIndex === imageIds.length - 1 ? 0 : currentIndex + 1;
        setSelectedImage(imageIds[nextIndex]);
      } else if (e.key === 'Escape') {
        setSelectedImage(null);
      }
    },
    [selectedImage, imageIds]
  );

  useEffect(() => {
    if (selectedImage) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage, handleKeyDown]);

  // Handle swipe gestures in lightbox
  const handleSwipe = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!selectedImage || imageIds.length <= 1) return;

    const currentIndex = imageIds.indexOf(selectedImage);
    if (info.offset.x < -100 || info.velocity.x < -500) {
      // Swipe left - next image
      const nextIndex = currentIndex === imageIds.length - 1 ? 0 : currentIndex + 1;
      setSelectedImage(imageIds[nextIndex]);
    } else if (info.offset.x > 100 || info.velocity.x > 500) {
      // Swipe right - previous image
      const prevIndex = currentIndex === 0 ? imageIds.length - 1 : currentIndex - 1;
      setSelectedImage(imageIds[prevIndex]);
    }
  };

  // Generate image URL from Google Drive file ID
  const getImageUrl = (fileId: string, size: 'thumbnail' | 'full' = 'full') => {
    if (size === 'thumbnail') {
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`;
    }
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  };

  // Embedded folder view URL
  const embedUrl = `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* View Mode Toggle (only show if we have individual images) */}
      {imageIds.length > 0 && (
        <div className="flex justify-center gap-2" role="group" aria-label="Gallery view mode">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-all touch-target ${
              viewMode === 'grid'
                ? 'bg-amber-500 text-white'
                : 'bg-white/10 text-white/70 active:bg-white/20'
            }`}
            aria-pressed={viewMode === 'grid'}
          >
            Grid View
          </button>
          <button
            onClick={() => setViewMode('embed')}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-all touch-target ${
              viewMode === 'embed'
                ? 'bg-amber-500 text-white'
                : 'bg-white/10 text-white/70 active:bg-white/20'
            }`}
            aria-pressed={viewMode === 'embed'}
          >
            Folder View
          </button>
        </div>
      )}

      {/* Grid View - Individual Images */}
      {viewMode === 'grid' && imageIds.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4"
          role="list"
          aria-label="Photo gallery"
        >
          {imageIds.map((imageId, index) => (
            <motion.div
              key={imageId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(index * 0.03, 0.3) }}
              onClick={() => setSelectedImage(imageId)}
              className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg sm:rounded-xl
                       touch-manipulation"
              role="listitem"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedImage(imageId);
                }
              }}
              aria-label={`View ${eventTitle} photo ${index + 1}`}
            >
              <img
                src={getImageUrl(imageId, 'thumbnail')}
                alt={`${eventTitle} photo ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 sm:group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 sm:group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-white opacity-0 sm:group-hover:opacity-100 transition-opacity"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                  />
                </svg>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Embedded Folder View */}
      {(viewMode === 'embed' || imageIds.length === 0) && (
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/5 rounded-xl z-10">
              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-white/70 text-sm">Loading gallery...</p>
              </div>
            </div>
          )}
          <div className="rounded-lg sm:rounded-xl overflow-hidden bg-white shadow-xl">
            <iframe
              src={embedUrl}
              className="w-full h-[350px] sm:h-[500px] md:h-[600px] border-0"
              onLoad={() => setIsLoading(false)}
              title={`${eventTitle} Photo Gallery`}
              allow="autoplay"
            />
          </div>
          <p className="text-center text-white/50 text-xs sm:text-sm mt-3 sm:mt-4 px-2">
            <span className="hidden sm:inline">Click on any image to view it in full size. You can also download images directly from Google Drive.</span>
            <span className="sm:hidden">Tap images to view full size or download from Drive.</span>
          </p>
        </div>
      )}

      {/* Open in Google Drive Button */}
      <div className="flex justify-center">
        <a
          href={`https://drive.google.com/drive/folders/${folderId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white/10 active:bg-white/20
                   text-white rounded-xl transition-colors text-sm sm:text-base touch-target"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M7.71 3.5L1.15 15l4.58 7.5h13.54l4.58-7.5L17.29 3.5H7.71zm-.86 1h9.3l5.57 9.5H1.28l5.57-9.5zm-.86 10.5h12.02l-3.51 5.75H9.5L5.99 15z" />
          </svg>
          <span className="hidden sm:inline">Open in</span> Google Drive
        </a>
      </div>

      {/* Lightbox for individual images - Mobile optimized with swipe */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-2 sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Image lightbox"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
              drag={imageIds.length > 1 ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleSwipe}
            >
              <img
                src={getImageUrl(selectedImage, 'full')}
                alt="Full size view"
                className="w-full max-h-[80vh] sm:max-h-[85vh] object-contain rounded-lg select-none"
                draggable={false}
              />

              {/* Close button */}
              <motion.button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 w-10 h-10 sm:w-12 sm:h-12
                         bg-black/50 active:bg-black/70 text-white rounded-full
                         flex items-center justify-center transition-colors touch-target z-10"
                whileTap={{ scale: 0.9 }}
                aria-label="Close lightbox"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
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
              </motion.button>

              {/* Navigation arrows - Hidden on mobile (use swipe) */}
              {imageIds.length > 1 && (
                <>
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentIndex = imageIds.indexOf(selectedImage);
                      const prevIndex = currentIndex === 0 ? imageIds.length - 1 : currentIndex - 1;
                      setSelectedImage(imageIds[prevIndex]);
                    }}
                    className="hidden sm:flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2
                             w-10 h-10 sm:w-12 sm:h-12 bg-black/50 active:bg-black/70
                             text-white rounded-full items-center justify-center transition-colors"
                    whileTap={{ scale: 0.9 }}
                    aria-label="Previous image"
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </motion.button>
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentIndex = imageIds.indexOf(selectedImage);
                      const nextIndex = currentIndex === imageIds.length - 1 ? 0 : currentIndex + 1;
                      setSelectedImage(imageIds[nextIndex]);
                    }}
                    className="hidden sm:flex absolute right-2 sm:right-4 top-1/2 -translate-y-1/2
                             w-10 h-10 sm:w-12 sm:h-12 bg-black/50 active:bg-black/70
                             text-white rounded-full items-center justify-center transition-colors"
                    whileTap={{ scale: 0.9 }}
                    aria-label="Next image"
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6"
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
                  </motion.button>
                </>
              )}

              {/* Image counter and swipe hint */}
              {imageIds.length > 1 && (
                <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                  <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-black/50 text-white rounded-full text-xs sm:text-sm">
                    {imageIds.indexOf(selectedImage) + 1} / {imageIds.length}
                  </div>
                  <span className="text-white/50 text-[10px] sm:hidden">Swipe to navigate</span>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
