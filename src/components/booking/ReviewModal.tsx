"use client";

import { useState } from "react";
import { createReviewService } from "@/services/review.service";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Loader2, MessageSquarePlus } from "lucide-react";
import { toast } from "sonner";

interface ReviewModalProps {
  bookingId: string;
  onSuccess: () => void;
}

export default function ReviewModal({ bookingId, onSuccess }: ReviewModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) {
      toast.error("Komentar tidak boleh kosong");
      return;
    }

    setIsLoading(true);
    try {
      await createReviewService({ bookingId, comment });
      toast.success("Ulasan berhasil dikirim!");
      setComment(""); // Reset form
      setIsOpen(false);
      onSuccess(); // Refresh halaman induk
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Gagal mengirim ulasan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full border-teal-600 text-teal-700 hover:bg-teal-50">
          <MessageSquarePlus className="mr-2 h-4 w-4" /> Beri Ulasan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bagaimana pengalaman Anda?</DialogTitle>
          <DialogDescription>
            Ceritakan pengalaman menginap Anda untuk membantu pengguna lain.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* 👇 KITA GUNAKAN HTML STANDAR BIAR PASTI BISA DIKETIK */}
          <textarea
            placeholder="Tulis ulasan Anda di sini..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isLoading}
            className="flex min-h-[120px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading} className="bg-teal-600 hover:bg-teal-700">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Kirim Ulasan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}