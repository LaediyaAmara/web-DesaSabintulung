import Link from 'next/link';
import { Leaf, Menu, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const MainNavLinks = () => (
  <>
    <Link
      href="/"
      className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
    >
      Beranda
    </Link>
    <Link
      href="/#berita"
      className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
    >
      Berita
    </Link>
    <Link
      href="/#potensi"
      className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
    >
      Potensi
    </Link>
    <Link
      href="/#pemerintahan"
      className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
    >
      Pemerintahan
    </Link>
  </>
);

const AllNavLinks = () => (
  <>
    <MainNavLinks />
    <Link
      href="/infografis/penduduk"
      className="text-sm font-medium text-muted-foreground hover:text-primary hover:bg-transparent p-0 flex items-center"
    >
      Infografis
    </Link>
    <Link
      href="/#kontak"
      className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
    >
      Kontak
    </Link>
  </>
);


export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline sm:inline-block">
              Desa Sabintulung
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="hidden md:flex items-center space-x-6">
            <AllNavLinks />
          </nav>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="p-4">
                  <nav className="flex flex-col space-y-4 pt-6">
                    <AllNavLinks />
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
