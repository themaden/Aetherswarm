"use client";

import React from 'react';
import { Fingerprint } from 'lucide-react';
import INFTGalleryGrid from '@/components/gallery/INFTGalleryGrid';
import GalleryHeader from '@/components/gallery/GalleryHeader';

export default function GalleryPage() {
  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="fade-in-up">
        <GalleryHeader />
      </div>

      {/* GALLERY GRID */}
      <div className="fade-in-up fade-in-up-1">
        <INFTGalleryGrid />
      </div>
    </div>
  );
}
