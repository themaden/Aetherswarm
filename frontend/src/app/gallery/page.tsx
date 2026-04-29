"use client";

import React from 'react';
import { Fingerprint } from 'lucide-react';
import iNFTGalleryGrid from '@/components/gallery/iNFTGalleryGrid';
import GalleryHeader from '@/components/gallery/GalleryHeader';

export default function GalleryPage() {
  return (
    <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
      {/* HEADER */}
      <GalleryHeader />

      {/* GALLERY GRID */}
      <iNFTGalleryGrid />
    </div>
  );
}
