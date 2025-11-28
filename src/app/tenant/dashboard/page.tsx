"use client";

import { useState, useEffect } from "react";
import { getTenantBookingsService } from "@/services/tenant.service";
import { getSalesReportService, getAvailabilityService } from "@/services/report.service"; // Tambahkan getAvailabilityService
import { Booking } from "@/types/booking.types";
import TenantOrderCard from "@/components/tenant/TenantOrderCard";
import SalesChart from "@/components/tenant/SalesChart"; 
import AvailabilityCalendar from "@/components/tenant/AvailabilityCalendar"; // Import Kalender
import { Loader2, LayoutDashboard, DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function TenantDashboard() {
  const [bookings, setBookings] = useState<any[]>([]); 
  const [salesSummary, setSalesSummary] = useState({ totalRevenue: 0, totalTransactions: 0 });
  const [chartData, setChartData] = useState([]);
  const [availabilityData, setAvailabilityData] = useState([]); // State untuk data kalender
  
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch List Booking
  const fetchBookings = async () => {
    try {
      const result = await getTenantBookingsService();
      setBookings(result.data || []);
    } catch (error) {
      console.error("Gagal ambil booking", error);
    }
  };

  // 2. Fetch Report (Sales & Calendar)
  const fetchReports = async () => {
      try {
          // Fetch Sales
          const salesResult = await getSalesReportService();
          if (salesResult?.data) {
              setSalesSummary(salesResult.data.summary);
              setChartData(salesResult.data.chartData);
          }

          // Fetch Availability (Kalender) - TAMBAHAN
          const availResult = await getAvailabilityService();
          if (availResult?.data) {
              setAvailabilityData(availResult.data);
          }

      } catch (error) {
          console.error("Gagal ambil laporan", error);
      }
  };

  useEffect(() => {
    const initData = async () => {
        setIsLoading(true);
        await Promise.all([fetchBookings(), fetchReports()]);
        setIsLoading(false);
    };
    initData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-3">
            <div className="bg-teal-600 p-3 rounded-lg text-white shadow-md">
                <LayoutDashboard className="h-6 w-6" />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Tenant</h1>
                <p className="text-gray-500 text-sm">Kelola pesanan dan pantau pendapatan properti Anda</p>
            </div>
        </div>

        {!isLoading && (
            <div className="flex flex-col gap-8">
                {/* 1. KARTU RINGKASAN */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-0 shadow-sm ring-1 ring-gray-200 bg-white">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Total Pendapatan</CardTitle>
                            <DollarSign className="h-4 w-4 text-teal-600" />
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                            <div className="text-2xl font-bold text-teal-700">
                                Rp {salesSummary?.totalRevenue?.toLocaleString() || "0"}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Bulan ini</p>
                        </CardContent>
                    </Card>
                    
                    <Card className="border-0 shadow-sm ring-1 ring-gray-200 bg-white">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Total Transaksi</CardTitle>
                            <TrendingUp className="h-4 w-4 text-teal-600" />
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                            <div className="text-2xl font-bold text-gray-800">
                                {salesSummary?.totalTransactions || 0}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Pesanan berhasil</p>
                        </CardContent>
                    </Card>
                </div>

                {/* 2. AREA GRAFIK & KALENDER (Grid Layout Baru) */}
                <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                    {/* Grafik Penjualan (Lebar 4 kolom) */}
                    <div className="lg:col-span-4">
                        <SalesChart data={chartData} />
                    </div>
                    
                    {/* Kalender Ketersediaan (Lebar 3 kolom) */}
                    <div className="lg:col-span-3">
                        <AvailabilityCalendar data={availabilityData} />
                    </div>
                </div>
            </div>
        )}

        {/* 3. LIST PESANAN MASUK */}
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                Pesanan Masuk
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">{bookings.length}</span>
            </h2>
            
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
                </div>
            ) : bookings.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                    <p className="text-gray-500">Belum ada pesanan masuk.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {bookings.map((booking) => (
                        <TenantOrderCard 
                            key={booking.id} 
                            booking={booking} 
                            onSuccess={() => {
                                fetchBookings(); 
                                fetchReports();
                            }} 
                        />
                    ))}
                </div>
            )}
        </div>

      </div>
    </div>
  );
}