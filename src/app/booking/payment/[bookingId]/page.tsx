"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { getBookingDetailService, uploadPaymentProofService } from "@/services/booking.service";
import { Booking } from "@/types/booking.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Timer, CreditCard, UploadCloud, Copy, Loader2, CheckCircle2, AlertTriangle, Zap } from "lucide-react"; 
import { toast } from "sonner";

export default function PaymentPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const bookingId = resolvedParams.bookingId;

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [bookingData, setBookingData] = useState<Booking | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);

  // --- LOGIKA FETCH BOOKING & TIMER ---
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const result = await getBookingDetailService(bookingId);
        
        // 👇 DEBUGGING: Sudah dikonfirmasi datanya ada
        // console.log("DATA PAYMENTS:", result.data.payments);
        
        setBookingData(result.data);

        if (!result.data.expireAt) {
            setTimeLeft(0);
            setIsExpired(true);
            return;
        }

        const expireDate = new Date(result.data.expireAt).getTime();
        const now = new Date().getTime();
        
        const diffSeconds = Math.floor((expireDate - now) / 1000);

        if (diffSeconds > 0) {
          setTimeLeft(diffSeconds);
          setIsExpired(false);
        } else {
          setTimeLeft(0);
          setIsExpired(true);
          toast.error("Waktu pembayaran telah habis!");
        }
      } catch (error) {
        console.error("Error fetching booking:", error);
        toast.error("Gagal memuat data pesanan.");
      } finally {
        setIsFetching(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
            setIsExpired(true);
            clearInterval(timer);
            return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // --- HELPER: AMBIL DATA PAYMENT (Handling Array vs Object) ---
  const getPaymentData = () => {
    if (!bookingData?.payments) return null;
    
    // Jika Array, ambil elemen pertama
    if (Array.isArray(bookingData.payments)) {
        return bookingData.payments.length > 0 ? bookingData.payments[0] : null;
    }
    
    // Jika Object, kembalikan langsung
    return bookingData.payments;
  };

  // --- LOGIKA MIDTRANS ---
  const handleMidtransPayment = () => {
    const paymentData = getPaymentData();
    
    // FIX: Ambil snapToken dengan aman (handle any type sementara)
    const snapToken = (paymentData as any)?.snapToken;

    if (!snapToken) {
        toast.error("Token pembayaran otomatis tidak tersedia. Gunakan upload manual.");
        return;
    }

    if (typeof window.snap === 'undefined') {
        toast.error("Sistem pembayaran sedang memuat. Silakan refresh halaman.");
        return;
    }

    window.snap.pay(snapToken, {
        onSuccess: function(result: any) {
            toast.success("Pembayaran Berhasil! Sistem sedang memverifikasi.");
            router.push("/user/my-bookings");
        },
        onPending: function(result: any) {
            toast.info("Menunggu pembayaran...");
            router.push("/user/my-bookings");
        },
        onError: function(result: any) {
            toast.error("Pembayaran Gagal atau Dibatalkan!");
        },
        onClose: function() {
            toast.warning("Anda menutup pop-up sebelum menyelesaikan pembayaran.");
        }
    });
  };

  // --- LOGIKA UPLOAD MANUAL ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 1024 * 1024) {
        toast.error("Ukuran file terlalu besar (Maksimal 1MB)");
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Mohon pilih file bukti pembayaran terlebih dahulu.");
      return;
    }

    setIsLoading(true);
    try {
      await uploadPaymentProofService(bookingId, file);
      toast.success("Bukti pembayaran berhasil dikirim!");
      router.push("/user/my-bookings");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Gagal upload bukti bayar.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 text-teal-600">
            <Loader2 className="h-10 w-10 animate-spin mb-4" />
            <p>Memuat Data Tagihan...</p>
        </div>
    );
  }

  // Cek token menggunakan helper baru
  const paymentData = getPaymentData();
  const hasSnapToken = !!(paymentData as any)?.snapToken;

  return (
    <div className="min-h-screen bg-linear-to-br from-teal-50 via-cyan-50 to-white py-12 px-4 flex justify-center items-center">
      <Card className="w-full max-w-lg border-0 shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden">
        
        {/* HEADER (TIMER) */}
        <CardHeader className={`text-center text-white py-8 relative ${isExpired ? 'bg-gray-600' : 'bg-teal-600'}`}>
          <div className="relative z-10">
            <div className="mx-auto bg-white/20 w-14 h-14 rounded-full flex items-center justify-center mb-4 backdrop-blur-md border border-white/30">
                {isExpired ? <AlertTriangle className="h-7 w-7" /> : <Timer className="h-7 w-7 animate-pulse" />}
            </div>
            <CardTitle className="text-2xl font-bold">
                {isExpired ? "Waktu Habis" : "Selesaikan Pembayaran"}
            </CardTitle>
            <CardDescription className="text-teal-100 mt-1">
                {isExpired ? "Pesanan ini telah kadaluwarsa" : "Pilih metode pembayaran di bawah"}
            </CardDescription>
            <div className={`text-4xl font-mono font-bold mt-4 tracking-widest drop-shadow-md ${isExpired ? 'text-gray-300' : 'text-white'}`}>
                {formatTime(timeLeft)}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          
          {/* INFO BOOKING */}
          <div className="bg-white border border-teal-100 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Properti</p>
                    <p className="font-semibold text-gray-800 line-clamp-1">{bookingData?.room?.property?.name || "Property Name"}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tipe Kamar</p>
                    <p className="font-semibold text-gray-800">{bookingData?.room?.type || "Room Type"}</p>
                </div>
            </div>
            <div className="mt-2 pt-2 border-t border-dashed border-gray-200 flex justify-between items-center">
                <span className="text-gray-500 text-sm">Total Tagihan</span>
                <span className="font-bold text-xl text-teal-800">
                    Rp {bookingData?.amount.toLocaleString() || "0"}
                </span> 
            </div>
          </div>

          {!isExpired && (
            <>
                {/* 🟢 OPSI 1: MIDTRANS (BAYAR OTOMATIS) - BARU */}
                {hasSnapToken && (
                    <div className="border border-teal-500 bg-teal-50 rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-teal-600 p-2 rounded-full text-white">
                                <Zap className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-teal-900">Bayar Otomatis</h3>
                                <p className="text-xs text-teal-700">QRIS, Virtual Account, Kartu Kredit (Verifikasi Instan)</p>
                            </div>
                        </div>
                        <Button 
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold h-12 shadow-md"
                            onClick={handleMidtransPayment}
                        >
                            Bayar Sekarang (Midtrans)
                        </Button>
                    </div>
                )}

                {/* PEMISAH */}
                {hasSnapToken && (
                    <div className="relative flex py-2 items-center">
                        <div className="grow border-t border-gray-200"></div>
                        <span className="shrink-0 mx-4 text-gray-400 text-xs uppercase font-semibold tracking-wider">ATAU Transfer Manual</span>
                        <div className="grow border-t border-gray-200"></div>
                    </div>
                )}

                {/* 🟠 OPSI 2: TRANSFER MANUAL */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <CreditCard className="text-gray-600 h-6 w-6" />
                        <div>
                          <p className="font-bold text-gray-800 text-sm">BCA - StayEase Corp</p>
                          <p className="font-mono text-lg text-gray-700 tracking-wide">123-456-7890</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-gray-400 hover:text-teal-600"
                        onClick={() => toast.success("No Rekening Disalin!")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition cursor-pointer relative group">
                        <input 
                            type="file" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            accept="image/png, image/jpeg, image/jpg"
                            onChange={handleFileChange}
                        />
                        
                        {preview ? (
                            <div className="relative z-10">
                                <img src={preview} alt="Preview" className="max-h-56 mx-auto rounded-lg shadow-md object-contain" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded-lg">
                                    <p className="text-white font-medium text-sm bg-black/50 px-3 py-1 rounded-full">Ganti Gambar</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center text-gray-500 z-10">
                                <div className="bg-gray-100 p-4 rounded-full mb-3 group-hover:scale-110 transition">
                                    <UploadCloud className="h-8 w-8 text-gray-500" />
                                </div>
                                <p className="text-sm font-semibold text-gray-700">Upload Bukti Transfer Manual</p>
                                <p className="text-xs mt-1 text-gray-400">Format JPG, PNG (Max 1MB)</p>
                            </div>
                        )}
                    </div>

                    <Button 
                        className="w-full h-12 text-lg font-bold rounded-xl shadow-sm bg-gray-800 hover:bg-gray-900 text-white"
                        onClick={handleUpload}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Mengupload...</>
                        ) : (
                            <><CheckCircle2 className="mr-2 h-5 w-5" /> Konfirmasi Manual</>
                        )}
                    </Button>
                </div>
            </>
          )}

          {isExpired && (
             <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center text-sm font-medium">
                Pesanan ini sudah tidak dapat dibayar. Silakan buat pesanan baru.
             </div>
          )}

          <div className="text-center">
            <button onClick={() => router.push("/")} className="text-sm text-gray-400 hover:text-teal-600 underline">
                Kembali ke Beranda
            </button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}