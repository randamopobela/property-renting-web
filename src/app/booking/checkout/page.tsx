"use client";

import { useState, Suspense, useEffect } from "react"; // <--- Jangan lupa import useEffect
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { id } from "date-fns/locale";
// Import service baru (Pastikan Anda sudah buat getRoomDetailService di service file)
import { createBookingService, getRoomDetailService } from "@/services/booking.service"; 
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

  const [isLoading, setIsLoading] = useState(false);

  // 👇 1. DEKLARASIKAN STATE ROOM DATA DI SINI (INI YANG HILANG TADI)
  const [roomData, setRoomData] = useState<any>(null); 

  // 👇 2. LOGIKA HARGA DINAMIS (JANGAN HARDCODE LAGI)
  const basePricePerNight = roomData?.basePrice || 0; // Default 0 sampai data loading selesai

  // Logic hitung durasi
  const startDate = checkInStr ? new Date(checkInStr) : new Date();
  const endDate = checkOutStr ? new Date(checkOutStr) : new Date();
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  
  const totalPrice = basePricePerNight * nights;

  // 👇 3. FETCH DATA KAMAR SAAT HALAMAN DIBUKA
  useEffect(() => {
    if (roomId) {
        getRoomDetailService(roomId)
            .then((res) => {
                setRoomData(res.data); // Simpan data ke state
            })
            .catch((err) => {
                console.error("Gagal ambil harga kamar", err);
                toast.error("Gagal memuat info kamar");
            });
    }
  }, [roomId]);

  // Handle Submit Booking
  const handleConfirmBooking = async () => {
    if (!roomId) {
      toast.error("Terjadi kesalahan: Data kamar tidak ditemukan.");
      return;
    }

    // Validasi tambahan: Jangan biarkan booking kalau harga masih 0 (loading)
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
    <div className="min-h-screen bg-linear-to-br from-teal-50 via-cyan-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-teal-800 mb-2">Konfirmasi Pesanan</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {/* Kolom Kiri: Detail Properti */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-md p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="flex items-center gap-2 text-teal-700 text-xl">
                   <MapPin className="h-5 w-5" /> Informasi Penginapan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex gap-4">
                  <div className="h-24 w-24 bg-gray-200 rounded-md overflow-hidden shrink-0">
                    {/* Gambar Dinamis dari API (Optional) */}
                    <img 
                      src={roomData?.property?.pictures?.[0]?.url || "https://source.unsplash.com/random/200x200/?hotel"} 
                      alt="Room" 
                      className="object-cover h-full w-full"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    {/* 👇 NAMA PROPERTY DINAMIS */}
                    <h3 className="font-bold text-lg text-gray-800">
                        {roomData ? `${roomData.type} - ${roomData.property.name}` : "Memuat..."}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" /> {roomData?.property?.city || "..."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* ... Card Data Tamu (Tetap sama) ... */}
          </div>

          {/* Kolom Kanan: Ringkasan Harga */}
          <div className="md:col-span-1">
            <Card className="border-0 shadow-xl bg-white sticky top-20 overflow-hidden py-0 gap-0">
              <CardHeader className="bg-teal-600 text-white p-6">
                <CardTitle>Rincian Harga</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* ... Bagian Tanggal (Tetap sama) ... */}

                {/* Kalkulasi Harga Dinamis */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Harga per malam</span>
                    {/* Tampilkan Harga Asli */}
                    <span>Rp {basePricePerNight.toLocaleString()}</span>
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
                    disabled={isLoading || basePricePerNight === 0} // Disable kalau loading
                >
                    {isLoading ? "Memproses..." : "Lanjut Pembayaran"}
                </Button>
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
        <Suspense fallback={<div className="p-10 text-center">Loading Checkout...</div>}>
            <CheckoutContent />
        </Suspense>
    )
}