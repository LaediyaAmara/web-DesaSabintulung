import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function HistorySection() {
  const historyImage = PlaceHolderImages.find(p => p.id === 'history');

  return (
    <section id="sejarah" className="py-16 lg:py-24 bg-background">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="animate-fade-in-up">
            {historyImage && (
              <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={historyImage.imageUrl}
                  alt={historyImage.description}
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 90vw, 45vw"
                  data-ai-hint={historyImage.imageHint}
                />
              </div>
            )}
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary mb-4">
              Sejarah Desa Sabintulung
            </h2>
            <div className="prose prose-lg text-foreground max-w-none">
              <p>
                Desa Sabintulung memiliki sejarah panjang yang berakar dari tradisi dan kearifan lokal masyarakat di sepanjang aliran Sungai Mahakam. Nama 'Sabintulung' sendiri dipercaya berasal dari bahasa Kutai kuno yang berarti 'saling membantu', mencerminkan semangat gotong royong yang telah menjadi ciri khas masyarakatnya sejak dahulu kala.
              </p>
              <p>
                Didirikan secara resmi pada awal abad ke-20, desa ini awalnya merupakan pemukiman kecil para nelayan dan petani. Seiring berjalannya waktu, Desa Sabintulung berkembang menjadi pusat kegiatan ekonomi dan budaya di wilayahnya, dengan tetap menjaga kelestarian alam dan nilai-nilai luhur para pendahulu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
