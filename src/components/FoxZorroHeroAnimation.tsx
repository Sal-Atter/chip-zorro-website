import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import repairVideo from '../assets/video/fox_zorro_magic_sword.mp4';

interface FoxZorroHeroAnimationProps {
  onBookNow: (damage?: string) => void;
}

export const FoxZorroHeroAnimation: React.FC<FoxZorroHeroAnimationProps> = ({ onBookNow }) => {
  const [viewMode, setViewMode] = useState<'video' | 'slider'>('video');
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Pause the loop when the slider tab is shown, resume on the video tab
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (viewMode === 'video') {
      void video.play().catch(() => { /* autoplay blocked */ });
    } else {
      video.pause();
    }
  }, [viewMode]);

  return (
    <div className="w-full">
      <div className="bg-white/[0.04] border border-white/10 rounded-3xl shadow-card-dark overflow-hidden backdrop-blur-md">
        <div className="flex items-center px-4 sm:px-5 pt-4 pb-3">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-night-950/80 border border-white/10">
            <button
              type="button"
              onClick={() => setViewMode('video')}
              className={`px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-bold rounded-lg transition-all cursor-pointer ${
                viewMode === 'video'
                  ? 'bg-ember-600 text-white shadow-ember'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              3D Rescue
            </button>
            <button
              type="button"
              onClick={() => setViewMode('slider')}
              className={`px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-bold rounded-lg transition-all cursor-pointer ${
                viewMode === 'slider'
                  ? 'bg-ember-600 text-white shadow-ember'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Before / After
            </button>
          </div>
        </div>

        {viewMode === 'video' && (
          <motion.div
            key="video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="px-4 sm:px-5 pb-5"
          >
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-card-dark bg-night-950">
              <video
                ref={videoRef}
                src={repairVideo}
                muted
                loop
                autoPlay
                playsInline
                preload="auto"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        )}

        {viewMode === 'slider' && (
          <motion.div
            key="slider"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="px-4 sm:px-5 pb-5"
          >
            <BeforeAfterSlider />
          </motion.div>
        )}
      </div>
    </div>
  );
};
