'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Users, Landmark, BarChart3, Package, Crown, Goal, HandCoins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const dataJenisKelamin = [
  { name: 'Laki-laki', value: 850 },
  { name: 'Perempuan', value: 825 },
];

const dataKelompokUmur = [
  { name: '0-17', 'Jumlah Penduduk': 450 },
  { name: '18-35', 'Jumlah Penduduk': 600 },
  { name: '36-55', 'Jumlah Penduduk': 425 },
  { name: '56+', 'Jumlah Penduduk': 200 },
];

const dataPendidikan = [
  { name: 'SD', 'Jumlah Penduduk': 500 },
  { name: 'SMP', 'Jumlah Penduduk': 450 },
  { name: 'SMA', 'Jumlah Penduduk': 400 },
  { name: 'D3/S1', 'Jumlah Penduduk': 225 },
  { name: 'Lainnya', 'Jumlah Penduduk': 100 },
];

const dataPekerjaan = [
    { name: 'Petani', 'Jumlah Penduduk': 700 },
    { name: 'Nelayan', 'Jumlah Penduduk': 250 },
    { name: 'Wiraswasta', 'Jumlah Penduduk': 150 },
    { name: 'PNS/TNI/Polri', 'Jumlah Penduduk': 50 },
    { name: 'Lainnya', 'Jumlah Penduduk': 525 },
];

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))'];

const infographicTabs = [
  { name: 'Penduduk', icon: Users, active: true },
  { name: 'APBDes', icon: Landmark, active: false },
  { name: 'Stunting', icon: BarChart3, active: false },
  { name: 'Bansos', icon: HandCoins, active: false },
  { name: 'IDM', icon: Crown, active: false },
  { name: 'SDGs', icon: Goal, active: false },
];

const AnimatedNumber = ({ value }: { value: number }) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    const animationDuration = 1000; // 1 second
    const frameDuration = 1000 / 60; // 60 fps
    const totalFrames = Math.round(animationDuration / frameDuration);
    const step = value / totalFrames;

    let currentFrame = 0;
    const counter = setInterval(() => {
      currentFrame++;
      const nextValue = step * currentFrame;
      setCurrentValue(nextValue > value ? value : nextValue);

      if (currentFrame === totalFrames) {
        clearInterval(counter);
      }
    }, frameDuration);

    return () => clearInterval(counter);
  }, [value]);

  return <>{Math.floor(currentValue).toLocaleString('id-ID')}</>;
};

const populationStats = [
    {
      id: 'total-population',
      title: 'Total Penduduk',
      value: 1675,
    },
    {
      id: 'family-head',
      title: 'Kepala Keluarga',
      value: 436,
    },
    {
      id: 'female-population',
      title: 'Perempuan',
      value: 825,
    },
    {
      id: 'male-population',
      title: 'Laki-Laki',
      value: 850,
    },
];

export default function InfografisPendudukPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow py-12 md:py-16">
        <div className="container">
          <div className="text-left mb-8 animate-fade-in-up">
            <h1 className="text-3xl md:text-5xl font-bold text-primary">INFOGRAFIS</h1>
            <h2 className="text-3xl md:text-5xl font-bold">DESA SABINTULUNG</h2>
          </div>

          <div className="border-b mb-8">
            <div className="flex justify-center md:justify-start space-x-4 md:space-x-8 overflow-x-auto pb-2">
              {infographicTabs.map((tab) => (
                <Button
                  key={tab.name}
                  variant="ghost"
                  className={`flex flex-col items-center h-auto px-2 py-2 text-center transition-colors duration-300 ${
                    tab.active
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  <tab.icon className="h-6 w-6 md:h-8 md:w-8 mb-1" />
                  <span className="text-xs md:text-sm font-semibold">{tab.name}</span>
                </Button>
              ))}
            </div>
          </div>
          
          <div className="mb-16">
            <h3 className="text-2xl md:text-4xl font-bold text-primary mb-6 text-center animate-fade-in-up">Jumlah Penduduk dan Kepala Keluarga</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {populationStats.map((stat, index) => {
                 const image = PlaceHolderImages.find(p => p.id === stat.id);
                 return(
                  <div key={stat.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 150}ms`}}>
                    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                       <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                         {image && (
                           <div className="relative h-24 w-24 mb-4">
                              <Image 
                                src={image.imageUrl}
                                alt={stat.title}
                                width={96}
                                height={96}
                                className="object-contain rounded-full bg-primary/10 p-2"
                                data-ai-hint={image.imageHint}
                              />
                           </div>
                         )}
                         <div className="text-center">
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.title}</p>
                            <p className="text-3xl font-bold text-primary">
                              <AnimatedNumber value={stat.value} /> <span className="text-2xl font-medium">Jiwa</span>
                            </p>
                         </div>
                       </CardContent>
                    </Card>
                  </div>
                 )
              })}
            </div>
          </div>


          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="animate-fade-in-up" style={{ animationDelay: '450ms' }}>
              <CardHeader>
                <CardTitle>Penduduk Berdasarkan Jenis Kelamin</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={dataJenisKelamin} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                       {dataJenisKelamin.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} Jiwa`, name]}/>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="animate-fade-in-up" style={{ animationDelay: '600ms' }}>
              <CardHeader>
                <CardTitle>Penduduk Berdasarkan Kelompok Umur</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dataKelompokUmur}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => `${value} Jiwa`} />
                        <Legend />
                        <Bar dataKey="Jumlah Penduduk" fill="hsl(var(--primary))" />
                    </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="animate-fade-in-up" style={{ animationDelay: '750ms' }}>
              <CardHeader>
                <CardTitle>Penduduk Berdasarkan Pendidikan</CardTitle>
              </CardHeader>
              <CardContent>
                 <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dataPendidikan}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => `${value} Jiwa`} />
                        <Legend />
                        <Bar dataKey="Jumlah Penduduk" fill="hsl(var(--primary))" />
                    </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
             <Card className="animate-fade-in-up" style={{ animationDelay: '900ms' }}>
              <CardHeader>
                <CardTitle>Penduduk Berdasarkan Pekerjaan</CardTitle>
              </CardHeader>
              <CardContent>
                 <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dataPekerjaan}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => `${value} Jiwa`} />
                        <Legend />
                        <Bar dataKey="Jumlah Penduduk" fill="hsl(var(--primary))" />
                    </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
