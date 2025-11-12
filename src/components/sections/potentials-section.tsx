import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Mountain, Sprout, Tractor, Tent } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Potential {
  icon: LucideIcon;
  title: string;
  description: string;
}

const potentials: Potential[] = [
  {
    icon: Mountain,
    title: 'Pariwisata Alam',
    description: 'Menawarkan pemandangan alam yang indah, perbukitan, dan udara yang sejuk untuk wisatawan.',
  },
  {
    icon: Sprout,
    title: 'Pertanian',
    description: 'Lahan subur yang menghasilkan padi, sayur-mayur, dan buah-buahan berkualitas tinggi.',
  },
  {
    icon: Tractor,
    title: 'Peternakan',
    description: 'Pengembangan peternakan sapi, kambing, dan ayam untuk memenuhi kebutuhan lokal.',
  },
  {
    icon: Tent,
    title: 'Bumi Perkemahan',
    description: 'Area perkemahan yang luas dan asri, cocok untuk kegiatan luar ruangan dan rekreasi keluarga.',
  },
];

export function PotentialsSection() {
  return (
    <section id="potensi" className="py-16 lg:py-24 bg-secondary">
      <div className="container">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">Potensi Desa</h2>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            Jelajahi berbagai potensi unggulan yang dimiliki oleh Desa Sabintulung.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {potentials.map((potential, index) => (
            <div
              key={index}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <Card className="text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 flex flex-col group h-full">
                <CardHeader className="items-center pt-8">
                  <div className="p-4 bg-primary/10 rounded-full transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                    <potential.icon className="h-8 w-8 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-4 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold mb-2">{potential.title}</h3>
                  <p className="text-muted-foreground flex-grow">{potential.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
