import API from "@/lib/axiosInstance";
import { Booking } from "@/types/booking.types"; 

// 1. Ambil Daftar Pesanan Tenant
export const getTenantBookingsService = async () => {
  try {
    const response = await API.get<{ message: string; data: Booking[] }>("/tenant/bookings");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 2. Verifikasi Pembayaran (Approve/Reject)
export const verifyPaymentService = async (bookingId: string, action: "APPROVE" | "REJECT") => {
  try {
    const response = await API.post(`/tenant/bookings/${bookingId}/verify`, { action });
    return response.data;
  } catch (error) {
    throw error;
  }
};