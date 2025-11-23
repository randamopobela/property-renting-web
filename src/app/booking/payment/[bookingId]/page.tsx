"use client";

import { useState, useEffect, use } from "react"; 
import { useRouter } from "next/navigation";
import { uploadPaymentProofService } from "@/services/booking.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Timer, CreditCard, UploadCloud, Copy, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function PaymentPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const router = useRouter();
  
  const resolvedParams = use(params); 
  const bookingId = resolvedParams.bookingId;

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(7200); 

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 1024 * 1024) { // Limit 1MB
        toast.error("Ukuran file maksimal 1MB");
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
      alert("Upload Berhasil! Status Booking: Menunggu Konfirmasi.");
      router.push("/"); 
      
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Gagal upload bukti bayar.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-teal-50 via-cyan-50 to-white py-12 px-4 flex justify-center items-center">
      <Card className="w-full max-w-lg border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
        
        {/* Header Timer */}
        <CardHeader className="text-center bg-teal-600 text-white rounded-t-xl py-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-white/10 skew-y-6 transform origin-bottom-left"></div>
          
          <div className="relative z-10">
            <div className="mx-auto bg-white/20 w-14 h-14 rounded-full flex items-center justify-center mb-4 backdrop-blur-md border border-white/30">
                <Timer className="text-white h-7 w-7 animate-pulse" />
            </div>
            <CardTitle className="text-2xl font-bold">Selesaikan Pembayaran</CardTitle>
            <CardDescription className="text-teal-100 mt-1">
                Lakukan transfer sebelum waktu habis
            </CardDescription>
            <div className="text-4xl font-mono font-bold mt-4 tracking-widest drop-shadow-md">
                {formatTime(timeLeft)}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          {/* Info Rekening */}
          <div className="bg-white border border-teal-100 rounded-xl p-5 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Transfer Manual ke:</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-teal-50 p-2 rounded-md">
                    <CreditCard className="text-teal-600 h-8 w-8" />
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-lg">BCA - StayEase Corp</p>
                  <p className="font-mono text-xl text-teal-700 tracking-wide">123-456-7890</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-400 hover:text-teal-600 hover:bg-teal-50"
                onClick={() => toast.success("No Rekening Disalin!")}
              >
                <Copy className="h-5 w-5" />
              </Button>
            </div>
            <div className="mt-4 pt-4 border-t border-dashed border-gray-200 flex justify-between items-center">
                <span className="text-gray-500 text-sm">Total Tagihan</span>
                {/* Hardcode sementara, nanti ambil dari API Detail Booking */}
                <span className="font-bold text-xl text-gray-800">Rp 1.000.000</span> 
            </div>
          </div>

          {/* Upload Area */}
          <div className="space-y-4">
            <label className="block text-sm font-bold text-gray-700">Upload Bukti Transfer</label>
            
            <div className="border-2 border-dashed border-teal-200 rounded-xl p-8 text-center hover:bg-teal-50/50 transition cursor-pointer relative group">
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
                    <div className="bg-teal-50 p-4 rounded-full mb-3 group-hover:scale-110 transition">
                        <UploadCloud className="h-8 w-8 text-teal-500" />
                    </div>
                    <p className="text-sm font-semibold text-gray-700">Klik atau drag gambar ke sini</p>
                    <p className="text-xs mt-1 text-gray-400">Format JPG, PNG (Max 1MB)</p>
                </div>
              )}
            </div>
          </div>

          <Button 
            className="w-full bg-teal-600 hover:bg-teal-700 h-14 text-lg font-bold shadow-lg shadow-teal-600/20 rounded-xl" 
            onClick={handleUpload}
            disabled={isLoading}
          >
            {isLoading ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Mengupload...</>
            ) : (
                <><CheckCircle2 className="mr-2 h-5 w-5" /> Konfirmasi Pembayaran</>
            )}
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}