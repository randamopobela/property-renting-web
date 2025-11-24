"use client";

import { useState } from "react";
import { Booking } from "@/types/booking.types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Pastikan rekan Anda sudah install Badge shadcn
import { CalendarDays, MapPin, Building2, Loader2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { cancelBookingService } from "@/services/booking.service";
import { toast } from "sonner";

// Helper untuk warna status
const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "AWAITING_CONFIRMATION": return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "PAID": return "bg-green-100 text-green-800 hover:bg-green-200";
    case "CANCELLED": return "bg-red-100 text-red-800 hover:bg-red-200";
    default: return "bg-gray-100 text-gray-800";
  }
};

// Helper format status text
const formatStatus = (status: string) => {
  return status.replace(/_/g, " ");
};

export default function BookingCard({ booking }: { booking: Booking }) {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);

  // Handle tombol aksi
  const handleAction = () => {
    if (booking.status === "PENDING") {
      router.push(`/booking/payment/${booking.id}`); // Lanjut Bayar
    } else {
      // Nanti bisa ke halaman detail (Hari ke-9/10)
      alert("Halaman detail booking belum dibuat.");
    }
  };

  const handlePay = () => {
    router.push(`/booking/payment/${booking.id}`);
  };

  const handleCancel = async () => {
    // Konfirmasi sederhana pakai window.confirm dulu (bisa diganti Modal nanti)
    const isSure = window.confirm("Apakah Anda yakin ingin membatalkan pesanan ini?");
    if (!isSure) return;

    setIsCancelling(true);
    try {
        await cancelBookingService(booking.id);
        toast.success("Pesanan berhasil dibatalkan");
        window.location.reload();
    } catch (error: any) {
        console.error(error);
        toast.error("Gagal membatalkan pesanan");
    } finally {
        setIsCancelling(false);
    }
  };
  const handleDetail = () => {
      alert("Fitur Detail Booking (Akan dikerjakan nanti)");
  };

  return (
    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
      <div className="flex flex-col md:flex-row">
        
        {/* Kolom Gambar (Kiri) */}
        <div className="w-full md:w-48 h-48 md:h-auto bg-gray-200 relative">
           <img 
             src={booking.room?.property.pictures?.[0]?.url || "https://source.unsplash.com/random/300x300/?hotel"} 
             alt="Property" 
             className="w-full h-full object-cover"
           />
           <div className="absolute top-2 left-2 md:hidden">
             <Badge className={getStatusColor(booking.status)}>{formatStatus(booking.status)}</Badge>
           </div>
        </div>

        {/* Kolom Info (Tengah) */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-bold text-lg text-gray-800">{booking.room?.property.name || "Nama Properti"}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {booking.room?.property.city || "Kota"}
                    </p>
                </div>
                <Badge className={`hidden md:inline-flex ${getStatusColor(booking.status)}`}>
                    {formatStatus(booking.status)}
                </Badge>
            </div>

            <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-teal-600" />
                    <span className="font-medium">{booking.room?.type}</span>
                </div>
                <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-teal-600" />
                    <span>
                        {format(new Date(booking.checkIn), "dd MMM yyyy", { locale: id })} - 
                        {format(new Date(booking.checkOut), "dd MMM yyyy", { locale: id })}
                    </span>
                    <span className="text-gray-400">({booking.nights} Malam)</span>
                </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
             <div className="text-xs text-gray-500">Total Harga</div>
             <div className="font-bold text-teal-700 text-lg">
                Rp {booking.amount.toLocaleString()}
             </div>
          </div>
        </div>

        {/* Kolom Aksi (Kanan) */}
        <div className="p-4 md:p-6 bg-gray-50 flex flex-col gap-3 justify-center md:w-56 border-l border-gray-100 shrink-0">
           {booking.status === "PENDING" ? (
               <>
                 {/* Tombol Bayar */}
                 <Button 
                   className="w-full bg-teal-600 hover:bg-teal-700 shadow-sm" 
                   onClick={handlePay}
                   disabled={isCancelling}
                 >
                   Bayar Sekarang
                 </Button>
                 
                 {/* Tombol Cancel (Baru) */}
                 <Button 
                   variant="outline" 
                   className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                   onClick={handleCancel}
                   disabled={isCancelling}
                 >
                   {isCancelling ? <Loader2 className="h-4 w-4 animate-spin"/> : "Batalkan"}
                 </Button>
               </>
           ) : (
               /* Tombol Detail untuk status selain Pending */
               <Button variant="outline" className="w-full" onClick={handleDetail}>
                 Lihat Detail
               </Button>
           )}
        </div>

      </div>
    </Card>
  );
}