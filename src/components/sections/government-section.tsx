import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const governmentOfficials = [
  {
    id: 'gov-1',
    name: 'Bapak Ahmad',
    title: 'Kepala Desa',
  },
  {
    id: 'gov-2',
    name: 'Ibu Siti',
    title: 'Sekretaris Desa',
  },
  {
    id: 'gov-3',
    name: 'Bapak Budi',
    title: 'Bendahara Desa',
  },
];

export function GovernmentSection() {
  return (
    <section id="pemerintahan" className="py-16 lg:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">Pemerintahan Desa</h2>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            Kenali lebih dekat aparatur yang mengabdi untuk kemajuan Desa Sabintulung.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {governmentOfficials.map((official, index) => {
            const image = PlaceHolderImages.find(p => p.id === official.id);
            return (
              <div
                key={official.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <Card className="text-center overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
                  {image && (
                    <div className="relative w-full aspect-square overflow-hidden">
                      <Image
                        src={image.imageUrl}
                        alt={`Potret ${official.name}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        data-ai-hint={image.imageHint}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold">{official.name}</h3>
                    <p className="text-muted-foreground">{official.title}</p>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
