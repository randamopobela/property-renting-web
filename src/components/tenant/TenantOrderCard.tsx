"use client";

import { useState } from "react";
import { Booking } from "@/types/booking.types";
import { verifyPaymentService } from "@/services/tenant.service";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "sonner";
import { ExternalLink, Clock, User, MessageSquare } from "lucide-react";
import ReplyModal from "./ReplyModal";

// Helper URL Gambar
  const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const BASE_ROOT_URL = BASE_API_URL.replace("/api", "");

// 👇 PERBAIKAN DI SINI: Gunakan 'Omit' untuk membuang definisi review lama agar tidak konflik
interface ExtendedBooking extends Omit<Booking, 'review'> {
  user?: {
    firstName: string;
    lastName?: string | null;
  };
  // Definisi ulang review sesuai data riil dari backend (bisa null)
  review?: {
    id: string;
    comment: string;
    reply?: string | null;
    rating?: number; // Tambahkan ini agar aman jika backend kirim rating
  } | null;
}

export default function TenantOrderCard({ booking, onSuccess }: { booking: ExtendedBooking, onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi Verifikasi Pembayaran
  const handleVerify = async (action: "APPROVE" | "REJECT") => {
    if (!confirm(`Apakah Anda yakin ingin ${action === "APPROVE" ? "MENERIMA" : "MENOLAK"} pesanan ini?`)) return;

    setIsLoading(true);
    try {
      await verifyPaymentService(booking.id, action);
      toast.success(`Pesanan berhasil di-${action === "APPROVE" ? "terima" : "tolak"}`);
      onSuccess(); // Refresh data dashboard
    } catch (error: any) {
      console.error(error);
      toast.error("Gagal memproses pesanan");
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi Buka Bukti Bayar
 const handleOpenProof = () => {
      // 1. DEBUGGING: Lihat apa isi data sebenarnya di Console
      console.log("🔍 Debug Booking ID:", booking.id);
      console.log("🔍 Debug Payments Data:", booking.payments);

      // 2. LOGIKA AMAN (Robust)
      // Cek apakah payments itu Array (List) atau Object tunggal, lalu ambil yang pertama
      let proofUrl: string | null | undefined = null;

      if (Array.isArray(booking.payments) && booking.payments.length > 0) {
          // Jika Array, ambil index ke-0
          proofUrl = booking.payments[0].proofUrl;
      } else if (booking.payments && typeof booking.payments === 'object') {
          // Jika ternyata Object (kadang terjadi tergantung prisma include), ambil langsung
          // @ts-ignore
          proofUrl = booking.payments.proofUrl;
      }

      console.log("🔍 Detected Proof URL:", proofUrl);

      // 3. VALIDASI
      if (!proofUrl) {
          toast.error(`Bukti bayar tidak terbaca. Cek Console (F12).`);
          return;
      }

      // 4. BUKA LINK
      if (proofUrl.startsWith("http")) {
          // Link Online (seperti placehold.co)
          window.open(proofUrl, '_blank');
      } else {
          // Link Lokal Backend
          const finalUrl = proofUrl.startsWith("/") ? `${BASE_ROOT_URL}${proofUrl}` : `${BASE_ROOT_URL}/${proofUrl}`;
          window.open(finalUrl, '_blank');
      }
  };

  // Helper Warna Badge Status
  const getStatusBadge = (status: string) => {
      switch(status) {
          case 'PENDING': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Menunggu Bayar</Badge>;
          case 'AWAITING_CONFIRMATION': return <Badge className="bg-blue-600 hover:bg-blue-700">Butuh Konfirmasi</Badge>;
          case 'PAID': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Lunas</Badge>;
          case 'COMPLETED': return <Badge variant="outline" className="bg-gray-100 text-gray-600">Selesai</Badge>;
          case 'CANCELLED': return <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200 shadow-none">Dibatalkan</Badge>;
          default: return <Badge variant="outline">{status}</Badge>;
      }
  }

  return (
    <Card className="p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        
        {/* BAGIAN KIRI: Info User & Booking */}
        <div className="space-y-3 flex-1">
          <div className="flex justify-between items-start">
             <div>
                <h3 className="font-bold text-lg text-gray-900">
                    {booking.room?.type} - {booking.room?.property?.name || "Nama Properti"}
                </h3>
                <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                    <User className="h-3 w-3" /> 
                    {booking.user?.firstName ? `${booking.user.firstName} ${booking.user.lastName || ''}` : `Guest (${booking.userId.slice(0,6)})`}
                </p>
             </div>
             <div className="md:hidden">
                {getStatusBadge(booking.status)}
             </div>
          </div>
          
          {/* Detail Tanggal & Harga */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
             <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-teal-600" />
                <span>
                    {format(new Date(booking.checkIn), "dd MMM", { locale: id })} - {format(new Date(booking.checkOut), "dd MMM yyyy", { locale: id })}
                </span>
             </div>
             <div className="w-px h-4 bg-gray-300 hidden sm:block"></div>
             <div>
                Total: <span className="font-bold text-teal-700">Rp {booking.amount.toLocaleString()}</span>
             </div>
          </div>

          {/* BAGIAN REVIEW (Update: Warna Lebih Hijau & Jelas) */}
          {booking.review && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-start gap-3">
                      <MessageSquare className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                      <div className="flex-1 space-y-2">
                          <div>
                            <p className="text-xs font-bold text-green-800 uppercase tracking-wider">Ulasan Tamu</p>
                            <p className="text-sm text-gray-700 italic mt-1">"{booking.review.comment}"</p>
                          </div>
                          
                          {/* Tampilkan Balasan Tenant atau Tombol Balas */}
                          {booking.review.reply ? (
                              <div className="pl-3 border-l-2 border-green-300 mt-3">
                                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Balasan Anda</p>
                                  <p className="text-sm text-gray-600 mt-1">"{booking.review.reply}"</p>
                              </div>
                          ) : (
                              <div className="mt-3">
                                  <ReplyModal 
                                    reviewId={booking.review.id} 
                                    userName={booking.user?.firstName || "Tamu"} 
                                    userComment={booking.review.comment}
                                    onSuccess={onSuccess}
                                  />
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          )}
        </div>

        {/* BAGIAN KANAN: Aksi Tenant (Approve/Reject) */}
        <div className="flex flex-col gap-3 justify-center items-end md:w-48 md:border-l md:border-gray-100 md:pl-6 shrink-0">
           
           <div className="hidden md:block mb-auto">
                {getStatusBadge(booking.status)}
           </div>

           {/* LOGIKA TOMBOL VERIFIKASI */}
           {booking.status === "AWAITING_CONFIRMATION" ? (
             <div className="w-full space-y-2">
                <Button variant="outline" size="sm" className="w-full border-gray-300 hover:bg-gray-50 text-gray-700" onClick={handleOpenProof}>
                    <ExternalLink className="mr-2 h-3 w-3" /> Cek Bukti
                </Button>
                <div className="flex gap-2">
                    <Button 
                        size="sm"
                        className="flex-1 bg-white text-red-600 hover:bg-red-50 border border-red-200 shadow-sm" 
                        onClick={() => handleVerify("REJECT")}
                        disabled={isLoading}
                    >
                        Tolak
                    </Button>
                    <Button 
                        size="sm"
                        className="flex-1 bg-teal-600 hover:bg-teal-700 text-white shadow-sm" 
                        onClick={() => handleVerify("APPROVE")}
                        disabled={isLoading}
                    >
                        Terima
                    </Button>
                </div>
             </div>
           ) : (
             <div className="text-xs text-gray-400 italic mt-auto h-8">
                {/* Spacer jika tidak ada aksi */}
             </div>
           )}
        </div>
      </div>
    </Card>
  );
}