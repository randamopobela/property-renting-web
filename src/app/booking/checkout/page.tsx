"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { id } from "date-fns/locale"; // Locale Indonesia
import { createBookingService, getRoomDetailService } from "@/services/booking.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CalendarDays, MapPin, Users, Loader2, ArrowRight, UserCircle2 } from "lucide-react";
import { toast } from "sonner";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Ambil Data dari URL
  const roomId = searchParams.get("roomId") || "";
  const checkInStr = searchParams.get("checkIn") || "";
  const checkOutStr = searchParams.get("checkOut") || "";
  const guestsStr = searchParams.get("guests") || "1";

  const [isLoading, setIsLoading] = useState(false);
  const [roomData, setRoomData] = useState<any>(null); 

  // 2. Logika Harga & Durasi
  const basePricePerNight = roomData?.basePrice || 0;

  // Parse Tanggal
  const startDate = checkInStr ? new Date(checkInStr) : new Date();
  const endDate = checkOutStr ? new Date(checkOutStr) : new Date();
  
  // Hitung Durasi Malam
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  
  const totalPrice = basePricePerNight * nights;

  // 3. Fetch Data Kamar
  useEffect(() => {
    if (roomId) {
        getRoomDetailService(roomId)
            .then((res) => {
                setRoomData(res.data);
            })
            .catch((err) => {
                console.error("Gagal ambil harga kamar", err);
                toast.error("Gagal memuat info kamar");
            });
    }
  }, [roomId]);

  // 4. Handle Submit Booking
  const handleConfirmBooking = async () => {
    if (!roomId) {
      toast.error("Terjadi kesalahan: Data kamar tidak ditemukan.");
      return;
    }

    if (basePricePerNight === 0) {
        toast.error("Sedang memuat data harga, mohon tunggu sebentar...");
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
      router.push(`/booking/payment/${result.data.id}`);

    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Gagal membuat pesanan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-teal-900 mb-2">Konfirmasi Pesanan</h1>
        <p className="text-gray-500 mb-8">Pastikan detail pesanan Anda sudah benar.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* === KOLOM KIRI (INFO UTAMA) === */}
          <div className="md:col-span-2 space-y-6">
            
            {/* CARD 1: INFO PENGINAPAN */}
            <Card className="border-0 shadow-sm bg-white p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="flex items-center gap-2 text-teal-700 text-lg">
                   <MapPin className="h-5 w-5" /> Informasi Penginapan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex gap-4">
                  <div className="h-28 w-28 bg-gray-200 rounded-lg overflow-hidden shrink-0 shadow-sm">
                    <img 
                      src={roomData?.property?.pictures?.[0]?.url || "https://source.unsplash.com/random/300x300/?hotel"} 
                      alt="Room" 
                      className="object-cover h-full w-full"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="font-bold text-xl text-gray-800">
                        {roomData ? `${roomData.type} - ${roomData.property.name}` : "Memuat..."}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="h-4 w-4" /> {roomData?.property?.city || "Loading City..."}
                    </p>
                    <div className="mt-3 inline-block bg-teal-50 text-teal-700 text-xs px-2 py-1 rounded-md font-medium">
                        Kapasitas: {roomData?.capacity || 2} Orang
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* CARD 2: DATA TAMU (YANG HILANG TADI) */}
            <Card className="border-0 shadow-sm bg-white p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="flex items-center gap-2 text-teal-700 text-lg">
                   <Users className="h-5 w-5" /> Data Pemesan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex gap-2 items-center">
                        <UserCircle2 className="h-4 w-4" /> Nama Pemesan
                      </label>
                      <Input 
                        value="Guest User (Anda)" 
                        disabled 
                        className="bg-gray-50 border-gray-200 text-gray-700 font-medium" 
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex gap-2 items-center">
                        <Users className="h-4 w-4" /> Jumlah Tamu
                      </label>
                      <Input 
                        value={`${guestsStr} Orang`} 
                        disabled 
                        className="bg-gray-50 border-gray-200 text-gray-700 font-medium" 
                      />
                   </div>
                </div>
                <p className="text-xs mt-4 bg-yellow-50 text-yellow-700 p-3 rounded-md border border-yellow-100">
                    ⚠️ Pastikan data di atas sudah benar. Tiket akan dikirimkan ke email akun Anda.
                </p>
              </CardContent>
            </Card>

          </div>

          {/* === KOLOM KANAN (RINCIAN HARGA & TANGGAL) === */}
          <div className="md:col-span-1">
            <Card className="border-0 shadow-lg bg-teal-600 text-white sticky top-24 overflow-hidden">
              
              <CardHeader className="p-6 border-b border-teal-500">
                <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" /> Rincian Harga
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                
                {/* Bagian Tanggal (YANG HILANG TADI) */}
                <div className="space-y-4 text-teal-50">
                  <div className="flex justify-between items-center text-sm">
                    <span className="opacity-80">Check-In</span>
                    <span className="font-semibold text-white">
                        {checkInStr ? format(startDate, 'dd MMM yyyy', { locale: id }) : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="opacity-80">Check-Out</span>
                    <span className="font-semibold text-white">
                        {checkOutStr ? format(endDate, 'dd MMM yyyy', { locale: id }) : '-'}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-teal-500 flex justify-between text-sm">
                    <span className="opacity-80">Total Durasi</span>
                    <span className="font-bold bg-white text-teal-700 px-2 py-0.5 rounded text-xs">
                        {nights} Malam
                    </span>
                  </div>
                </div>

                {/* Kalkulasi Harga */}
                <div className="bg-white text-gray-800 p-4 rounded-lg space-y-3 text-sm shadow-md">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Harga per malam</span>
                    <span className="font-medium">Rp {basePricePerNight.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Pajak & Layanan</span>
                    <span className="font-medium text-green-600">Gratis</span>
                  </div>
                  <div className="border-t border-dashed border-gray-300 pt-3 mt-2 flex justify-between items-center">
                    <span className="font-bold text-lg">Total Bayar</span>
                    <span className="font-bold text-xl text-teal-700">
                        Rp {totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                <Button 
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold text-lg h-12 shadow-md" 
                    onClick={handleConfirmBooking}
                    disabled={isLoading || basePricePerNight === 0}
                >
                    {isLoading ? (
                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Memproses...</>
                    ) : (
                        <>Lanjut Pembayaran <ArrowRight className="ml-2 h-5 w-5" /></>
                    )}
                </Button>
                
                <p className="text-[10px] text-center text-teal-200 opacity-80">
                    Dengan melanjutkan, Anda menyetujui Syarat & Ketentuan StayEase.
                </p>

              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-teal-600"/></div>}>
            <CheckoutContent />
        </Suspense>
    )
}