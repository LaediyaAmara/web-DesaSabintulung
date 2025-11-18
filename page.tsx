'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, MoreHorizontal, Trash2, Edit } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';



type Post = {
  id: number;
  title: string;
  excerpt: string | null;
  created_at: string;
};

export default function AdminBeritaPage() {
  const supabase = createClient();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from<Post>('posts')
        .select('id, title, excerpt, created_at')
        .eq('category', 'berita')
        .order('created_at', { ascending: false });

      if (data) {
        setPosts(data);
      } else if (error) {
        console.error('Error fetching posts:', error);
        // Anda bisa menambahkan state untuk menampilkan pesan error di UI
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
      const { error } = await supabase.from('posts').delete().match({ id });
      if (!error) {
        setPosts(posts.filter((post) => post.id !== id));
      } else {
        alert('Gagal menghapus berita: ' + error.message);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Kelola Berita</CardTitle>
            <CardDescription>Tambah, edit, atau hapus berita dan pengumuman.</CardDescription>
          </div>
          <Button asChild>
            <Link href="/admin/berita/new"><PlusCircle className="mr-2 h-4 w-4" /> Tambah Berita</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Judul</TableHead>
              <TableHead className="hidden md:table-cell">Kutipan</TableHead>
              <TableHead className="hidden sm:table-cell">Tanggal</TableHead>
              <TableHead><span className="sr-only">Aksi</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center">Memuat data...</TableCell></TableRow>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell className="hidden md:table-cell">{post.excerpt}</TableCell>
                  <TableCell className="hidden sm:table-cell">{new Date(post.created_at).toLocaleDateString('id-ID')}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild><Link href={`/admin/berita/${post.id}`}>Edit</Link></DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(post.id)}>
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={4} className="text-center">Belum ada berita.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}