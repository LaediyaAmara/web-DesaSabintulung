import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

// Definisikan tipe data untuk sebuah post, sesuaikan dengan skema tabel 'posts' di Supabase
type Post = {
  id: number;
  title: string;
  excerpt: string | null;
  image_url: string | null;
  image_hint: string | null;
  // tambahkan properti lain jika diperlukan
};

async function getNews() {
  const supabase = createClient();
  // Beri tahu Supabase tipe data yang kita harapkan untuk mendapatkan 'autocomplete' dan keamanan tipe
  const { data } = await supabase
    .from<Post>('posts')
    .select('id, title, excerpt, image_url, image_hint')
    .eq('category', 'berita')
    .order('created_at', { ascending: false })
    .limit(3);
  return data || [];
}

export async function NewsSection() {
  const newsItems = await getNews();
  return (
    <section id="berita" className="py-16 lg:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">Berita & Pengumuman</h2>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            Ikuti perkembangan dan informasi terbaru dari Desa Sabintulung.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item, index) => {
            // Menggunakan image_url dari database, atau fallback ke placeholder
            const image = {
              imageUrl: item.image_url || PlaceHolderImages.find(p => p.id === `news-${index + 1}`)?.imageUrl || '/placeholder.jpg',
              description: item.title,
              imageHint: item.image_hint || 'Gambar berita',
            };
            return (
              <div
                key={item.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 flex flex-col group h-full">
                  {image.imageUrl && (
                    <div className="relative w-full h-48 overflow-hidden">
                      <Image
                        src={image.imageUrl}
                        alt={image.description}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 30vw"
                        data-ai-hint={image.imageHint}
                      />
                    </div>
                  )}
                  <CardContent className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3 flex-grow">{item.excerpt}</p>
                    <Button variant="link" asChild className="p-0 h-auto text-primary font-semibold self-start mt-auto group-hover:text-accent transition-colors">
                      <Link href={`/berita/${item.id}`}>
                        Baca Selengkapnya <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
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
