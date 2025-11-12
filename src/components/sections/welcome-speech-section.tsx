import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';

export function WelcomeSpeechSection() {
  const headImage = PlaceHolderImages.find(p => p.id === 'village-head');

  return (
    <section id="sambutan" className="py-16 lg:py-24 bg-secondary/50">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-center">
          <div className="md:col-span-1 flex justify-center animate-fade-in-up">
            {headImage && (
              <div className="relative w-64 h-64 lg:w-80 lg:h-80">
                <Image
                  src={headImage.imageUrl}
                  alt={headImage.description}
                  className="rounded-full object-cover border-8 border-background shadow-2xl"
                  fill
                  sizes="(max-width: 768px) 60vw, (max-width: 1024px) 30vw, 20vw"
                  data-ai-hint={headImage.imageHint}
                />
              </div>
            )}
          </div>
          <div className="md:col-span-2 text-center md:text-left animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary mb-2">
              Sambutan Kepala Desa
            </h2>
            <h3 className="text-xl lg:text-2xl font-semibold mb-1">Hendrikus Amin</h3>
            <p className="text-sm font-medium text-muted-foreground mb-6">KEPALA DESA SABINTULUNG</p>
            <div className="prose prose-lg text-foreground max-w-none text-left">
              <p>
                Selamat datang di website resmi Desa Sabintulung. Website ini dibangun untuk mempermudah sistem dan tatakelola kerja Pemerintah Desa serta mempermudah penyampaian informasi di setiap agenda dan kegiatan Pemerintah Desa kepada masyarakat agar terbangun keterbukaan informasi.
              </p>
              <p>
                Kami berharap situs ini dapat menjadi jembatan antara pemerintah desa dengan masyarakat luas, serta menjadi sumber informasi yang akurat dan terpercaya mengenai potensi, berita, dan layanan di desa kita tercinta.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
