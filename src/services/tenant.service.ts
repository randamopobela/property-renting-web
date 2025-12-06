import API from "@/lib/axiosInstance";
import { Booking } from "@/types/booking.types"; 

interface BookingParams {
  page?: number;
  limit?: number;
  status?: string;
}

export const getTenantBookingsService = async (params?: BookingParams) => {
  try {
    const response = await API.get("/tenant/bookings", { params });
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

export const replyReviewService = async (reviewId: string, reply: string) => {
  try {
    const response = await API.post(`/reviews/${reviewId}/reply`, { reply });
    return response.data;
  } catch (error) {
    throw error;
  }
};