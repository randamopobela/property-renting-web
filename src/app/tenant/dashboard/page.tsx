"use client";

import { useState, useEffect } from "react";
import { getTenantBookingsService } from "@/services/tenant.service";
import { getSalesReportService, getAvailabilityService } from "@/services/report.service"; 
import { Booking } from "@/types/booking.types";
import TenantOrderCard from "@/components/tenant/TenantOrderCard";
import SalesChart from "@/components/tenant/SalesChart"; 
import AvailabilityCalendar from "@/components/tenant/AvailabilityCalendar"; 
import PaginationControls from "@/components/ui/PaginationControls"; 
import { Loader2, LayoutDashboard, DollarSign, TrendingUp, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TenantDashboard() {
  // --- STATE DATA ---
  const [bookings, setBookings] = useState<any[]>([]); 
  const [salesSummary, setSalesSummary] = useState({ totalRevenue: 0, totalTransactions: 0 });
  const [chartData, setChartData] = useState([]);
  const [availabilityData, setAvailabilityData] = useState([]);
  
  // --- STATE PAGINATION & FILTER ---
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("ALL"); // Default: Semua Status
  
  // --- STATE LOADING ---
  const [isLoading, setIsLoading] = useState(true); // Loading awal halaman
  const [isBookingsLoading, setIsBookingsLoading] = useState(false); // Loading khusus saat ganti halaman/filter

  // 1. Fetch Booking (Dipanggil saat Page atau Filter berubah)
  const fetchBookings = async () => {
    setIsBookingsLoading(true);
    try {
      const result = await getTenantBookingsService({ 
          page: page, 
          limit: 5,
          status: statusFilter 
      });


      setBookings(result.data || []);
      
      if (result.meta) {
          setTotalPages(result.meta.totalPages);
      }
    } catch (error) {
      console.error("Gagal ambil booking", error);
    } finally {
      setIsBookingsLoading(false);
    }
  };

  const fetchReports = async () => {
      try {
          const salesResult = await getSalesReportService();
          if (salesResult?.data) {
              setSalesSummary(salesResult.data.summary);
              setChartData(salesResult.data.chartData);
          }
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
  useEffect(() => {
      fetchBookings();
  }, [page, statusFilter]);

  // Handle saat user mengganti filter status
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setStatusFilter(e.target.value);
      setPage(1); // Reset ke halaman 1 setiap kali filter berubah
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER DASHBOARD */}
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
                {/* 1. BAGIAN RINGKASAN KEUANGAN */}
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

                {/* 2. BAGIAN GRAFIK & KALENDER */}
                <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                    <div className="lg:col-span-4">
                        <SalesChart data={chartData} />
                    </div>
                    <div className="lg:col-span-3">
                        <AvailabilityCalendar data={availabilityData} />
                    </div>
                </div>
            </div>
        )}

        {/* 3. BAGIAN DAFTAR PESANAN (Dengan Pagination & Filter) */}
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    Pesanan Masuk
                    {/* Badge jumlah booking saat ini */}
                    {!isBookingsLoading && bookings.length > 0 && (
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">{bookings.length}</span>
                    )}
                </h2>
                
                {/* DROPDOWN FILTER STATUS */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <select 
                        value={statusFilter}
                        onChange={handleFilterChange}
                        className="bg-white border border-gray-300 text-gray-700 text-sm rounded-md focus:ring-teal-500 focus:border-teal-500 block p-2 w-full md:w-48 shadow-sm"
                    >
                        <option value="ALL">Semua Status</option>
                        <option value="PENDING">Menunggu Bayar</option>
                        <option value="AWAITING_CONFIRMATION">Butuh Konfirmasi</option>
                        <option value="PAID">Lunas</option>
                        <option value="COMPLETED">Selesai</option>
                        <option value="CANCELLED">Dibatalkan</option>
                    </select>
                </div>
            </div>
            
            {/* Logic Loading / Kosong / Ada Data */}
            {isLoading || isBookingsLoading ? (
                <div className="flex justify-center py-20 bg-white rounded-xl border border-gray-100">
                    <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
                </div>
            ) : bookings.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                    <p className="text-gray-500">Tidak ada pesanan dengan status ini.</p>
                </div>
            ) : (
                <>
                    {/* LIST KARTU PESANAN */}
                    <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {bookings.map((booking) => (
                            <TenantOrderCard 
                                key={booking.id} 
                                booking={booking} 
                                onSuccess={() => {
                                    fetchBookings(); // Refresh list booking setelah approve/reject
                                    fetchReports();  // Refresh laporan juga
                                }} 
                            />
                        ))}
                    </div>

                    {/* KONTROL PAGINATION */}
                    <div className="mt-4 bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                        <PaginationControls 
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={(newPage) => {
                                setPage(newPage);
                                // Scroll smooth ke atas list pesanan agar user notice data berubah
                                window.scrollTo({ top: 500, behavior: 'smooth' });
                            }}
                            isLoading={isBookingsLoading}
                        />
                    </div>
                </>
            )}
        </div>

      </div>
    </div>
  );
}