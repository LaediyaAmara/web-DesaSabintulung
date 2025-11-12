import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function HeroSection() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-village');

  return (
    <section className="relative h-[70vh] md:h-[90vh] w-full flex items-center justify-center text-white overflow-hidden">
      {heroImage && (
         <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover scale-105 animate-zoom-in"
          priority
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 text-center p-4 max-w-4xl">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-headline text-white drop-shadow-lg animate-fade-in-down">
          Selamat Datang di Desa Sabintulung
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-gray-200 drop-shadow-md animate-fade-in-up [animation-delay:0.3s]">
          Menjelajahi keindahan alam, kearifan lokal, dan potensi luar biasa dari desa kami.
        </p>
      </div>
    </section>
  );
}
