import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const revalidate = 60; // Revalidate data setiap 60 detik

async function getAllPosts() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, excerpt, image_url, image_hint, created_at')
    .order('created_at', { ascending: false }); // Urutkan dari yang terbaru

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  return data;
}

export default async function BeritaListPage() {
  const posts = await getAllPosts();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-center mb-10">Berita Terbaru</h1>

      {posts.length === 0 ? (
        <p className="text-center text-lg text-muted-foreground">Belum ada berita yang dipublikasikan.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link href={`/berita/${post.id}`} key={post.id}>
              <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200 ease-in-out">
                {post.image_url && (
                  <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                    <Image
                      src={post.image_url}
                      alt={post.image_hint || post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {new Date(post.created_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-base line-clamp-3">{post.excerpt}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
