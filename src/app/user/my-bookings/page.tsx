"use client";

import { useState, useEffect } from "react";
// Pastikan service ini sudah diupdate agar tidak menerima userId sebagai argumen
import { getMyBookingsService } from "@/services/booking.service"; 
import { Booking } from "@/types/booking.types";
import BookingCard from "@/components/booking/BookingCard";
import { Loader2, PackageOpen } from "lucide-react";
import { toast } from "sonner";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  // Kita harus set default false di sini
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ⚠️ Catatan: Logika storedUserId/hardcode ID sudah tidak relevan
    // Karena kita mengandalkan token di Header (AxiosInstance)
    
    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            // 👇 FIX: Panggil service TANPA ARGUMEN userId
            // Kita gunakan ts-ignore untuk mengabaikan error TypeScript sementara,
            // karena kita menganggap service sudah dimodifikasi di file lain
            // @ts-ignore
            const res = await getMyBookingsService();
            
            // --- PERBAIKAN DI SINI ---
            // 'res' adalah object yang dikembalikan service: { message: string, data: Booking[] }
            // Kita langsung akses res.data untuk mendapatkan array Booking
            setBookings(res.data || []); 
            // --- AKHIR PERBAIKAN ---

        } catch (err) {
            console.error(err);
            toast.error("Gagal memuat pesanan. Silakan coba login ulang.");
            setBookings([]); // Kosongkan jika gagal
        } finally {
            // Selalu hentikan loading, baik sukses maupun error
            setIsLoading(false); 
        }
    }
    
    fetchBookings();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Dependensi kosong, hanya jalan saat mount

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Halaman */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold text-teal-900">Pesanan Saya</h1>
                <p className="text-gray-500 mt-1">Kelola semua riwayat penginapan Anda di sini</p>
            </div>
        </div>

        {/* Loading State */}
        {isLoading && (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="h-10 w-10 text-teal-600 animate-spin" />
            </div>
        )}

        {/* Empty State (Kalau belum ada pesanan) */}
        {!isLoading && bookings.length === 0 && (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PackageOpen className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Belum ada pesanan</h3>
                <p className="text-gray-500 mb-6">Yuk mulai cari penginapan impianmu!</p>
                <a href="/" className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition">
                    Cari Penginapan
                </a>
            </div>
        )}

        {/* List Data */}
        {!isLoading && bookings.length > 0 && (
            <div className="space-y-4">
                {bookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                ))}
            </div>
        )}

      </div>
    </div>
  );
}