"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { createBookingService } from "@/services/booking.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CalendarDays, MapPin, Users, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();


  const roomId = searchParams.get("roomId") || "";
  const checkInStr = searchParams.get("checkIn") || "";
  const checkOutStr = searchParams.get("checkOut") || "";
  const guestsStr = searchParams.get("guests") || "1";
  
  // Hardcode harga sementara (karena belum fetch detail room dari F1)
  const basePricePerNight = 1000000; 

  const [isLoading, setIsLoading] = useState(false);

  const startDate = checkInStr ? new Date(checkInStr) : new Date();
  const endDate = checkOutStr ? new Date(checkOutStr) : new Date();
  
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  
  const totalPrice = basePricePerNight * nights;

  const handleConfirmBooking = async () => {
    if (!roomId) {
      toast.error("Terjadi kesalahan: Data kamar tidak ditemukan.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await createBookingService({
        roomId,
        checkIn: startDate,
        checkOut: endDate,
        guests: Number(guestsStr),
      });

      toast.success("Pesanan berhasil dibuat!");
      
      // Arahkan ke halaman pembayaran (Fitur Hari ke-7)
      // Gunakan ID booking yang dikembalikan backend
      router.push(`/booking/payment/${result.data.id}`);

    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Gagal membuat pesanan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-teal-50 via-cyan-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-teal-800 mb-2">Konfirmasi Pesanan</h1>
        <p className="text-gray-600 mb-8">Mohon periksa kembali detail pesanan Anda sebelum melanjutkan.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Kolom Kiri: Detail Properti & Tamu */}
          <div className="md:col-span-2 space-y-6">
            
            {/* CARD 1: INFORMASI PENGINAPAN */}
            {/* Tambahkan 'p-6' agar isinya tidak mepet pinggir */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-md p-6">
              <CardHeader className="p-0 mb-4"> {/* p-0 biar ngikut parent, mb-4 kasih jarak ke content */}
                <CardTitle className="flex items-center gap-2 text-teal-700 text-xl">
                   <MapPin className="h-5 w-5" /> Informasi Penginapan
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-0"> {/* p-0 karena parent sudah p-6 */}
                <div className="flex gap-4">
                  {/* Gambar */}
                  <div className="h-24 w-24 bg-gray-200 rounded-md overflow-hidden shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80" 
                      alt="Room" 
                      className="object-cover h-full w-full"
                    />
                  </div>
                  {/* Teks */}
                  <div className="flex flex-col justify-center">
                    <h3 className="font-bold text-lg text-gray-800">Luxury Room - Villa Indah</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" /> Jakarta Selatan
                    </p>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                      Kamar Tipe Deluxe dengan pemandangan kota, fasilitas lengkap, dan akses mudah.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CARD 2: DATA TAMU */}
            {/* Tambahkan 'p-6' di sini juga */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-md p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="flex items-center gap-2 text-teal-700 text-xl">
                   <Users className="h-5 w-5" /> Data Tamu
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Tambah gap-6 biar lega */}
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Nama Pemesan</label>
                      <Input 
                        value="Guest User (Anda)" 
                        disabled 
                        className="bg-gray-50 border-teal-100 text-gray-700 font-medium" 
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Jumlah Tamu</label>
                      <Input 
                        value={`${guestsStr} Orang`} 
                        disabled 
                        className="bg-gray-50 border-teal-100 text-gray-700 font-medium" 
                      />
                   </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Kolom Kanan: Ringkasan Harga */}
          <div className="md:col-span-1">
            {/* 1. Di Card Induk: Hapus padding (py-0) agar Header bisa mentok ke atas/samping. 
       Hapus gap (gap-0) agar tidak ada jarak aneh antara Header dan Content. */}
<Card className="border-0 shadow-xl bg-white sticky top-20 overflow-hidden py-0 gap-0">
  
  {/* 2. Di Header: Pastikan padding (p-6) ada di sini agar teks judul tidak mepet pinggir */}
  <CardHeader className="bg-teal-600 text-white p-6"> 
    <CardTitle>Rincian Harga</CardTitle>
  </CardHeader>

  {/* 3. Di Content: TAMBAHKAN padding (p-6) di sini. 
       Ini mengembalikan kerapian yang hilang tadi karena py-0 di induk. */}
  <CardContent className="p-6 space-y-6">
    
    {/* Tanggal */}
    <div className="space-y-3">
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500 flex gap-2"><CalendarDays className="h-4 w-4"/> Check-In</span>
        <span className="font-medium">
            {checkInStr ? format(startDate, 'dd MMM yyyy', { locale: id }) : '-'}
        </span>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500 flex gap-2"><CalendarDays className="h-4 w-4"/> Check-Out</span>
        <span className="font-medium">
            {checkOutStr ? format(endDate, 'dd MMM yyyy', { locale: id }) : '-'}
        </span>
      </div>
      <div className="pt-2 border-t border-dashed border-gray-200 flex justify-between text-sm">
        <span>Total Durasi</span>
        <span className="font-bold text-teal-600">{nights} Malam</span>
      </div>
    </div>

    {/* Kalkulasi Harga */}
    <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
      <div className="flex justify-between">
        <span>Harga per malam</span>
        <span>Rp {basePricePerNight.toLocaleString()}</span>
      </div>
      <div className="flex justify-between">
        <span>Biaya Layanan</span>
        <span>Rp 0</span>
      </div>
      <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between items-center">
        <span className="font-bold text-lg">Total</span>
        <span className="font-bold text-xl text-teal-700">
            Rp {totalPrice.toLocaleString()}
        </span>
      </div>
    </div>

    <Button 
        className="w-full bg-teal-600 hover:bg-teal-700 text-lg h-12" 
        onClick={handleConfirmBooking}
        disabled={isLoading}
    >
        {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...</>
        ) : (
            <>Lanjut Pembayaran <ArrowRight className="ml-2 h-4 w-4" /></>
        )}
    </Button>
    
    <p className="text-xs text-center text-gray-400">
        Pembayaran aman dan terpercaya.
    </p>

  </CardContent>
</Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wajib dibungkus Suspense di Next.js 15 saat pakai useSearchParams
export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="p-10 text-center">Loading Checkout...</div>}>
            <CheckoutContent />
        </Suspense>
    )
}