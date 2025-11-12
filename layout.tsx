import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CrudLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Button variant="outline" asChild className="mb-6">
          <Link href="/admin/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Dasbor</Link>
        </Button>
        {children}
      </div>
    </div>
  );
}