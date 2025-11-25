export interface CreateReviewParams {
  bookingId: string;
  comment: string;
}

export interface ReviewResponse {
  message: string;
  data: {
    id: string;
    comment: string;
    bookingId: string;
  };
}