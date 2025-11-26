import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export const revalidate = 3600; // Revalidate every hour

async function getPost(id: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    notFound();
  }

  return data;
}

export default async function BeritaDetailPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <article className="prose lg:prose-xl dark:prose-invert mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{post.title}</h1>
          <p className="text-muted-foreground">
            Dipublikasikan pada {new Date(post.created_at).toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {post.image_url && (
          <div className="relative w-full h-80 rounded-lg overflow-hidden my-8 shadow-lg">
            <Image
              src={post.image_url}
              alt={post.image_hint || post.title}
              fill
              className="object-cover"
              priority
            />
            {post.image_hint && (
              <p className="text-center text-sm text-muted-foreground mt-2">{post.image_hint}</p>
            )}
          </div>
        )}

        {/* The 'prose' class will style this HTML content */}
        <div dangerouslySetInnerHTML={{ __html: post.body.replace(/\n/g, '<br />') }} />
      </article>
    </div>
  );
}