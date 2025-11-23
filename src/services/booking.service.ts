import API from "@/lib/axiosInstance"
import { CreateBookingParams, BookingResponse } from "@/types/booking.types";

export const createBookingService = async (params: CreateBookingParams) => {
  try {
    const response = await API.post<BookingResponse>("/bookings", {
      roomId: params.roomId,
      checkIn: params.checkIn,
      checkOut: params.checkOut,
      guests: params.guests,
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadPaymentProofService = async (bookingId: string, file: File) => {
  try {
    const formData = new FormData();
    formData.append("paymentProof", file); 

    const response = await API.post(`/bookings/${bookingId}/payment`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMyBookingsService = async () => {
  try {
    const response = await API.get<{ message: string; data: any[] }>("/bookings/my-bookings");
    return response.data;
  } catch (error) {
    throw error;
  }
};