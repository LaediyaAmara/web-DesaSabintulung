'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';

export default function NewBeritaPage() {
  const router = useRouter();
  const supabase = createClient();

  // State untuk file yang dipilih
  const [imageFile, setImageFile] = useState<File | null>(null);
  // Ref untuk mereset input file
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    body: '',
    category: 'berita', // Default category
    image_url: '',
    image_hint: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    let imageUrl = '';

    // 1. Jika ada file gambar yang dipilih, unggah ke Supabase Storage
    if (imageFile) {
      const fileName = `${Date.now()}_${imageFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('posts-images') // Ganti 'posts-images' dengan nama bucket Anda
        .upload(fileName, imageFile);

      if (uploadError) {
        console.error('Supabase Upload Error:', uploadError);
        alert(`Gagal mengunggah gambar.\n\nPesan Error: ${uploadError.message}\n\nPastikan bucket 'posts-images' ada, bersifat publik, dan policy RLS sudah benar.`);
        setIsSubmitting(false);
        return;
      }

      // 2. Dapatkan URL publik dari gambar yang diunggah
      const { data: publicUrlData } = supabase.storage
        .from('posts-images') // Pastikan nama bucket sama
        .getPublicUrl(uploadData.path);

      imageUrl = publicUrlData.publicUrl;
    }

    const { error } = await supabase.from('posts').insert([{ ...formData, image_url: imageUrl }]);

    if (error) {
      alert('Gagal menambahkan berita: ' + error.message);
      setIsSubmitting(false);
    } else {
      alert('Berita berhasil ditambahkan!');
      router.push('/admin/berita');
      router.refresh(); // Memuat ulang data di halaman daftar berita
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <form onSubmit={handleSubmit}>
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Tambah Berita Baru</CardTitle>
                <CardDescription>Isi detail berita di bawah ini.</CardDescription>
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
                <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="Judul berita yang menarik" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="excerpt">Kutipan (Excerpt)</Label>
                <Textarea id="excerpt" name="excerpt" value={formData.excerpt} onChange={handleChange} placeholder="Ringkasan singkat berita..." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="body">Isi Berita Lengkap</Label>
                <Textarea id="body" name="body" value={formData.body} onChange={handleChange} rows={10} placeholder="Tulis isi berita selengkapnya di sini." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="image_file">Upload Gambar</Label>
                  <Input id="image_file" type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} />
                  {imageFile && <p className="text-sm text-muted-foreground">File dipilih: {imageFile.name}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image_hint">Deskripsi Gambar (Hint)</Label>
                  <Input id="image_hint" name="image_hint" value={formData.image_hint} onChange={handleChange} placeholder="Contoh: Pemandangan sawah" />
                </div>
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Menyimpan...' : 'Simpan & Publikasikan'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}