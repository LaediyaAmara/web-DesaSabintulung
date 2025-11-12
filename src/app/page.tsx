import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/sections/hero-section';
import { WelcomeSpeechSection } from '@/components/sections/welcome-speech-section';
import { HistorySection } from '@/components/sections/history-section';
import { NewsSection } from '@/components/sections/news-section';
import { PotentialsSection } from '@/components/sections/potentials-section';
import { GovernmentSection } from '@/components/sections/government-section';
import { ContactSection } from '@/components/sections/contact-section';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <WelcomeSpeechSection />
        <HistorySection />
        <NewsSection />
        <PotentialsSection />
        <GovernmentSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
