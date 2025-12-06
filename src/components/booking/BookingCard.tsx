"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Booking } from "@/types/booking.types";
import { cancelBookingService } from "@/services/booking.service";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Building2, Loader2, FileText } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "sonner";
import ReviewModal from "./ReviewModal"; // Pastikan file ini ada di folder yang sama
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200";
    case "AWAITING_CONFIRMATION": return "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200";
    case "PAID": return "bg-green-100 text-green-800 hover:bg-green-200 border-green-200";
    case "COMPLETED": return "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200";
    case "CANCELLED": return "bg-red-100 text-red-800 hover:bg-red-200 border-red-200";
    default: return "bg-gray-100 text-gray-800";
  }
};

const formatStatus = (status: string) => {
  return status.replace(/_/g, " ");
};

export default function BookingCard({ booking }: { booking: Booking }) {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);

  const handlePay = () => {
    router.push(`/booking/payment/${booking.id}`);
  };

  const handleCancel = async () => {
    const isSure = window.confirm("Apakah Anda yakin ingin membatalkan pesanan ini?");
    if (!isSure) return;

    setIsCancelling(true);
    try {
        await cancelBookingService(booking.id);
        toast.success("Pesanan berhasil dibatalkan");
        window.location.reload();
    } catch (error: any) {
        console.error(error);
        toast.error(error.response?.data?.message || "Gagal membatalkan pesanan");
    } finally {
        setIsCancelling(false);
    }
  };

  const handleReviewSuccess = () => {
      window.location.reload();
  };

  // Logic tampilkan tombol Review (Hanya jika Lunas/Selesai)
  const canReview = booking.status === "PAID" || booking.status === "COMPLETED";

  return (
    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden bg-white">
      <div className="flex flex-col md:flex-row">
        
        {/* Kolom Gambar */}
        <div className="w-full md:w-56 h-48 md:h-auto bg-gray-100 relative shrink-0">
           <img 
             src={booking.room?.property.pictures?.[0]?.url || "https://source.unsplash.com/random/300x300/?hotel"} 
             alt="Property" 
             className="w-full h-full object-cover"
           />
           <div className="absolute top-3 left-3 md:hidden">
             <Badge className={getStatusColor(booking.status)}>{formatStatus(booking.status)}</Badge>
           </div>
        </div>

        {/* Kolom Info */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{booking.room?.property.name || "Nama Properti"}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="h-3.5 w-3.5" /> {booking.room?.property.city || "Kota"}
                    </p>
                </div>
                <Badge variant="outline" className={`hidden md:inline-flex whitespace-nowrap ${getStatusColor(booking.status)}`}>
                    {formatStatus(booking.status)}
                </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 mt-4">
                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                    <Building2 className="h-4 w-4 text-teal-600" />
                    <span className="font-medium">{booking.room?.type}</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                    <CalendarDays className="h-4 w-4 text-teal-600" />
                    <span>
                        {format(new Date(booking.checkIn), "dd MMM yyyy", { locale: id })} - {format(new Date(booking.checkOut), "dd MMM yyyy", { locale: id })}
                    </span>
                </div>
            </div>
          </div>
          
          <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
             <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Pembayaran</div>
             <div className="font-bold text-teal-700 text-lg">
                Rp {booking.amount.toLocaleString()}
             </div>
          </div>
        </div>

        {/* Kolom Aksi */}
        <div className="p-5 bg-gray-50 flex flex-col gap-2 justify-center md:w-60 border-l border-gray-100 shrink-0">
           
           {/* KONDISI 1: MASIH PENDING */}
           {booking.status === "PENDING" && (
               <>
                 <Button 
                   className="w-full bg-teal-600 hover:bg-teal-700 shadow-sm" 
                   onClick={handlePay}
                   disabled={isCancelling}
                 >
                   Bayar Sekarang
                 </Button>
                 
                 <Button 
                   variant="outline" 
                   className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                   onClick={handleCancel}
                   disabled={isCancelling}
                 >
                   {isCancelling ? <Loader2 className="h-4 w-4 animate-spin"/> : "Batalkan Pesanan"}
                 </Button>
               </>
           )}

           {/* KONDISI 2: SUDAH BAYAR (Bisa Review) */}
           {canReview && (
                <div className="space-y-2 w-full">
                    {/* Menggunakan Komponen ReviewModal */}
                    <ReviewModal bookingId={booking.id} onSuccess={handleReviewSuccess} />
                </div>
           )}

           {/* Info Status Lain */}
           {!canReview && booking.status !== "PENDING" && (
               <div className="text-center text-xs text-gray-400 italic mb-2">
                   {booking.status === "AWAITING_CONFIRMATION" ? "Menunggu Konfirmasi Tenant" : 
                    booking.status === "CANCELLED" ? "Pesanan Dibatalkan" : ""}
               </div>
           )}

           {/* TOMBOL DETAIL (MODAL) - Selalu Muncul */}
           <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-white hover:text-teal-700">
                        <FileText className="mr-2 h-4 w-4" /> Lihat Detail
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Detail Pesanan</DialogTitle>
                        <DialogDescription>ID: {booking.id}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500 text-xs">Tamu</p>
                                <p className="font-medium">{booking.guests} Orang</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">Durasi</p>
                                <p className="font-medium">{booking.nights} Malam</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">Check-In</p>
                                <p className="font-medium">{format(new Date(booking.checkIn), "eeee, dd MMMM yyyy", { locale: id })}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">Check-Out</p>
                                <p className="font-medium">{format(new Date(booking.checkOut), "eeee, dd MMMM yyyy", { locale: id })}</p>
                            </div>
                        </div>
                        <div className="bg-gray-100 p-3 rounded-md">
                            <p className="text-xs text-gray-500 mb-1">Total Harga</p>
                            <p className="text-xl font-bold text-teal-700">Rp {booking.amount.toLocaleString()}</p>
                        </div>
                    </div>
                </DialogContent>
           </Dialog>

        </div>

      </div>
    </Card>
  );
}