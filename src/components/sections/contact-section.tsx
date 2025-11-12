'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Nama harus memiliki setidaknya 2 karakter.',
  }),
  email: z.string().email({
    message: 'Format email tidak valid.',
  }),
  message: z.string().min(10, {
    message: 'Pesan harus memiliki setidaknya 10 karakter.',
  }),
});

export function ContactSection() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: 'Pesan Terkirim!',
      description: 'Terima kasih telah menghubungi kami. Kami akan segera merespon pesan Anda.',
      variant: 'default',
    });
    form.reset();
  }

  return (
    <section id="kontak" className="py-16 lg:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">Hubungi Kami</h2>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            Punya pertanyaan atau masukan? Jangan ragu untuk menghubungi kami.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Lengkap</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alamat Email</FormLabel>
                          <FormControl>
                            <Input placeholder="email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pesan Anda</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tuliskan pesan Anda di sini..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full transition-transform hover:scale-105" variant="default">
                      Kirim Pesan
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-col justify-center space-y-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <h3 className="text-2xl font-bold">Informasi Kontak & Lokasi</h3>
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-primary/10 rounded-md mt-1">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Alamat</h4>
                <p className="text-muted-foreground">Jl. Raya Sabintulung No. 1, Kec. Muara Kaman, <br/>Kab. Kutai Kartanegara, Kalimantan Timur</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-primary/10 rounded-md mt-1">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Telepon</h4>
                <p className="text-muted-foreground">(0541) 123-4567</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-primary/10 rounded-md mt-1">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Email</h4>
                <p className="text-muted-foreground">kontak@sabintulung.desa.id</p>
              </div>
            </div>
            <div className="mt-4 rounded-lg overflow-hidden shadow-lg border hover:shadow-xl transition-shadow duration-300">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.289475982245!2d116.79001387496517!3d-0.4555891995707011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2df780a84e68e4c7%3A0x6b5a31c5f3e5e4d2!2sSabintulung!5e0!3m2!1sen!2sid!4v1716382833442!5m2!1sen!2sid"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Peta Lokasi Desa Sabintulung"
                ></iframe>
              </div>
          </div>
        </div>
      </div>
    </section>
  );
}
