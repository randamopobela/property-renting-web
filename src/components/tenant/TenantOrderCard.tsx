"use client";

import { useState } from "react";
import { Booking } from "@/types/booking.types";
import { verifyPaymentService } from "@/services/tenant.service";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "sonner";
import { CheckCircle, XCircle, Eye, Loader2 } from "lucide-react";

// Helper URL Gambar (Sesuaikan dengan URL Backend Anda)
// Jika Backend di localhost:8000, maka gambar ada di http://localhost:8000/images/namafile.jpg
const BASE_IMAGE_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:8000";

export default function TenantOrderCard({ booking, onSuccess }: { booking: Booking, onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async (action: "APPROVE" | "REJECT") => {
    if (!confirm(`Apakah Anda yakin ingin ${action === "APPROVE" ? "MENERIMA" : "MENOLAK"} pesanan ini?`)) return;

    setIsLoading(true);
    try {
      await verifyPaymentService(booking.id, action);
      toast.success(`Pesanan berhasil di-${action === "APPROVE" ? "terima" : "tolak"}`);
      onSuccess(); // Refresh data di halaman induk
    } catch (error: any) {
      console.error(error);
      toast.error("Gagal memproses pesanan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-5 border border-gray-200 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        
        {/* Info User & Booking */}
        <div className="space-y-2 flex-1">
          <div className="flex justify-between items-start">
             <h3 className="font-bold text-lg text-gray-800">
                {booking.room?.type} - {booking.room?.property?.name}
             </h3>
             <Badge variant="outline" className="uppercase text-xs">
                {booking.status.replace(/_/g, " ")}
             </Badge>
          </div>
          
          <div className="text-sm text-gray-600 space-y-1">
             <p>👤 Tamu: <span className="font-medium text-black">User ID: {booking.userId.slice(0,8)}...</span></p>
             <p>📅 Tanggal: {format(new Date(booking.checkIn), "dd MMM")} - {format(new Date(booking.checkOut), "dd MMM yyyy")}</p>
             <p>💰 Total: <span className="font-bold text-teal-700">Rp {booking.amount.toLocaleString()}</span></p>
          </div>
        </div>

        {/* Aksi Tenant */}
        <div className="flex flex-col gap-2 justify-center md:w-48">
           
           {/* Tombol Lihat Bukti Bayar (Hanya jika status AWAITING_CONFIRMATION) */}
           {booking.status === "AWAITING_CONFIRMATION" && booking.payments?.[0] && (
             <Dialog>
               <DialogTrigger asChild>
                 <Button variant="outline" className="w-full">
                    <Eye className="mr-2 h-4 w-4" /> Cek Bukti
                 </Button>
               </DialogTrigger>
               <DialogContent>
                 <DialogHeader>
                   <DialogTitle>Bukti Pembayaran</DialogTitle>
                 </DialogHeader>
                 <div className="mt-4">
                    <img 
                        src={`${BASE_IMAGE_URL}${booking.payments[0].proofUrl}`} 
                        alt="Bukti Bayar" 
                        className="w-full rounded-md border border-gray-200"
                    />
                    <div className="flex gap-3 mt-6">
                        <Button 
                            className="flex-1 bg-red-500 hover:bg-red-600" 
                            onClick={() => handleVerify("REJECT")} 
                            disabled={isLoading}
                        >
                            Tolak
                        </Button>
                        <Button 
                            className="flex-1 bg-green-600 hover:bg-green-700" 
                            onClick={() => handleVerify("APPROVE")}
                            disabled={isLoading}
                        >
                            Terima
                        </Button>
                    </div>
                 </div>
               </DialogContent>
             </Dialog>
           )}

           {/* Status Lain */}
           {booking.status === "PAID" && (
               <div className="text-center p-2 bg-green-50 text-green-700 rounded-md text-sm font-medium border border-green-200">
                  <CheckCircle className="inline h-4 w-4 mr-1"/> Lunas
               </div>
           )}
           {booking.status === "CANCELLED" && (
               <div className="text-center p-2 bg-red-50 text-red-700 rounded-md text-sm font-medium border border-red-200">
                  <XCircle className="inline h-4 w-4 mr-1"/> Dibatalkan
               </div>
           )}

        </div>
      </div>
    </Card>
  );
}