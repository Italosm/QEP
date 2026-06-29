"use client";

import { useState } from "react";
import Image from "next/image";
import { User } from "lucide-react";

interface PoliticianImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export function PoliticianImage({
  src,
  alt,
  width,
  height,
  className,
}: PoliticianImageProps) {
  const [imageError, setImageError] = useState(false);

  if (imageError || !src) {
    return (
      <div
        style={{ width, height }}
        className={`flex items-center justify-center rounded-full bg-gray-200 text-gray-500 ${className}`}
      >
        <User size={width * 0.6} />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setImageError(true)}
      unoptimized
    />
  );
}
