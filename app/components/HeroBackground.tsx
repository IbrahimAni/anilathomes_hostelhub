import React from 'react';
import Image from 'next/image';

interface HeroBackgroundProps {
  src: string;
  alt: string;
  priority?: boolean;
}

const HeroBackground = ({ src, alt, priority = true }: HeroBackgroundProps) => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        quality={90}
        className="object-cover object-center"
        data-testid="hero-background-image"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
    </div>
  );
};

export default HeroBackground;