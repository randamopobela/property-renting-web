"use client";

import { useState } from "react";
import { replyReviewService } from "@/services/tenant.service";
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
import { Loader2, MessageSquareReply } from "lucide-react";
import { toast } from "sonner";

interface ReplyModalProps {
  reviewId: string;
  userName: string;
  userComment: string;
  onSuccess: () => void;
}

export default function ReplyModal({ reviewId, userName, userComment, onSuccess }: ReplyModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reply, setReply] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!reply.trim()) {
      toast.error("Balasan tidak boleh kosong");
      return;
    }

    setIsLoading(true);
    try {
      await replyReviewService(reviewId, reply);
      toast.success("Balasan berhasil dikirim!");
      setIsOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Gagal mengirim balasan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="border-teal-600 text-teal-700 hover:bg-teal-50">
          <MessageSquareReply className="mr-2 h-3 w-3" /> Balas Ulasan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Balas Ulasan {userName}</DialogTitle>
          <DialogDescription>
            Berikan tanggapan profesional atas ulasan tamu Anda.
          </DialogDescription>
        </DialogHeader>
        
        {/* Tampilkan Komentar User */}
        <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700 italic border border-gray-200 mb-2">
            "{userComment}"
        </div>

        <div className="grid gap-4 py-2">
          <textarea
            placeholder="Tulis balasan Anda..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            disabled={isLoading}
            className="flex min-h-[100px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading} className="bg-teal-600 hover:bg-teal-700">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Kirim Balasan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}