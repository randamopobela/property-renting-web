export type BookingStatus = 
  | 'PENDING' 
  | 'AWAITING_CONFIRMATION' 
  | 'PAID' 
  | 'CANCELLED' 
  | 'PROCESSING' 
  | 'COMPLETED';

export interface Booking {
  id: string;
  userId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  amount: number;
  status: BookingStatus;
  expireAt: string | null;
  createdAt: string;
  
  room?: {
    type: string;
    property: {
      name: string;
      city: string;
      pictures?: { url: string }[];
    };
  };
  payments?: {
    id: string;
    proofUrl: string;
    status: string;
  }[];
}

export interface BookingResponse {
  message: string;
  data: Booking;
}

export interface CreateBookingParams {
  roomId: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
}