"use client";

import { useState, useEffect } from "react";
import { getTenantBookingsService } from "@/services/tenant.service";
import { Booking } from "@/types/booking.types";
import TenantOrderCard from "@/components/tenant/TenantOrderCard";
import { Loader2, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";

export default function TenantDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const result = await getTenantBookingsService();
      setBookings(result.data);
    } catch (error) {
      console.error(error);
      // Jangan toast error dulu jika 401/403 (mungkin belum login tenant)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div className="flex items-center gap-3 mb-8">
            <div className="bg-teal-600 p-3 rounded-lg text-white shadow-md">
                <LayoutDashboard className="h-6 w-6" />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Tenant</h1>
                <p className="text-gray-500 text-sm">Kelola pesanan masuk properti Anda</p>
            </div>
        </div>

        {isLoading ? (
            <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            </div>
        ) : bookings.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                <p className="text-gray-500">Belum ada pesanan masuk.</p>
            </div>
        ) : (
            <div className="grid gap-4">
                {bookings.map((booking) => (
                    <TenantOrderCard 
                        key={booking.id} 
                        booking={booking} 
                        onSuccess={fetchBookings} // Refresh data setelah approve/reject
                    />
                ))}
            </div>
        )}

      </div>
    </div>
  );
}