'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';

type Post = {
  title: string;
  excerpt: string;
  body: string;
  image_url: string;
  image_hint: string;
  category: string;
};

export default function EditBeritaPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const supabase = createClient();
  const postId = params.id;

  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Post>({
    title: '',
    excerpt: '',
    body: '',
    category: 'berita',
    image_url: '',
    image_hint: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (error || !data) {
        alert('Gagal memuat data berita. Mengarahkan kembali...');
        router.push('/admin/berita');
      } else {
        setFormData({
          title: data.title || '',
          excerpt: data.excerpt || '',
          body: data.body || '',
          category: data.category || 'berita',
          image_url: data.image_url || '',
          image_hint: data.image_hint || '',
        });
      }
      setIsLoading(false);
    };

    fetchPost();
  }, [postId, router, supabase]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    let imageUrl = formData.image_url;

    // Jika ada file baru yang dipilih, unggah dan ganti URL gambar
    if (imageFile) {
      const fileName = `${Date.now()}_${imageFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('posts-images') // Ganti 'posts-images' dengan nama bucket Anda
        .upload(fileName, imageFile);

      if (uploadError) {
        alert('Gagal mengunggah gambar baru: ' + uploadError.message);
        setIsSubmitting(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('posts-images') // Pastikan nama bucket sama
        .getPublicUrl(uploadData.path);

      imageUrl = publicUrlData.publicUrl;

      // Opsional: Hapus gambar lama dari storage jika ada
      if (formData.image_url) {
        const oldImageName = formData.image_url.split('/').pop();
        if (oldImageName) {
          await supabase.storage.from('posts-images').remove([oldImageName]);
        }
      }
    }

    const { error } = await supabase.from('posts').update({ ...formData, image_url: imageUrl }).eq('id', postId);
    
    if (error) {
      alert('Gagal memperbarui berita: ' + error.message);
      setIsSubmitting(false);
    } else {
      alert('Berita berhasil diperbarui!');
      router.push('/admin/berita');
      router.refresh();
    }
  };

  if (isLoading) {
    return <div className="container mx-auto py-8 text-center">Memuat data editor...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <form onSubmit={handleSubmit}>
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Edit Berita</CardTitle>
                <CardDescription>Perbarui detail berita di bawah ini.</CardDescription>
              </div>
              <Button variant="outline" asChild>
                <Link href="/admin/berita">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="title">Judul Berita</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="excerpt">Kutipan (Excerpt)</Label>
                <Textarea id="excerpt" name="excerpt" value={formData.excerpt} onChange={handleChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="body">Isi Berita Lengkap</Label>
                <Textarea id="body" name="body" value={formData.body} onChange={handleChange} rows={10} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="image_url">URL Gambar</Label>
                  <Input id="image_url" name="image_url" value={formData.image_url} onChange={handleChange} readOnly placeholder="URL akan terisi otomatis setelah upload" />
                  {formData.image_url && <img src={formData.image_url} alt="Preview" className="mt-2 rounded-md max-h-40" />}
                  <Label htmlFor="image_file" className="mt-4">Ganti/Upload Gambar</Label>
                  <Input id="image_file" type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} />
                  {imageFile && <p className="text-sm text-muted-foreground">File baru: {imageFile.name}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image_hint">Deskripsi Gambar (Hint)</Label>
                  <Input id="image_hint" name="image_hint" value={formData.image_hint} onChange={handleChange} />
                </div>
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}