import API from "@/lib/axiosInstance"
import { CreateBookingParams, BookingResponse } from "../types/booking";

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