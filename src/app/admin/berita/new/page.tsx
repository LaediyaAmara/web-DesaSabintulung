
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';

export default function AddNewBeritaPage() {
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
   title: '',
    excerpt: '',
    body: '',
    category: 'berita', // Default category
   image_url: '',
    image_hint: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase.from('posts').insert([formData]);

    if (error) {
      alert('Gagal menambahkan berita: ' + error.message);
      setIsSubmitting(false);
    } else {
      alert('Berita berhasil ditambahkan!');
      router.push('/admin/berita'); // Arahkan kembali ke halaman daftar berita
      router.refresh(); // Refresh data di halaman sebelumnya
    }
  };

  return (
    <div className="container mx-auto py-8">
      <form onSubmit={handleSubmit}>
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Tambah Berita Baru</CardTitle>
                <CardDescription>Isi semua kolom untuk membuat berita baru.</CardDescription>
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
                <Textarea id="excerpt" name="excerpt" value={formData.excerpt} onChange={handleChange} placeholder="Tulis kutipan singkat di sini..." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="body">Isi Berita Lengkap</Label>
                <Textarea id="body" name="body" value={formData.body} onChange={handleChange} rows={10} placeholder="Tulis isi berita lengkap di sini..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="image_url">URL Gambar</Label>                  <Input id="image_url" name="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://example.com/image.jpg" />
               </div>
               <div className="grid gap-2">
                  <Label htmlFor="image_hint">Deskripsi Gambar (Hint)</Label>
                  <Input id="image_hint" name="image_hint" value={formData.image_hint} onChange={handleChange} placeholder="Contoh: Pemandangan sawah" />
                </div>
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Menyimpan...' : 'Simpan Berita'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}



