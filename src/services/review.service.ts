import API from "@/lib/axiosInstance";
import { CreateReviewParams, ReviewResponse } from "@/types/review.types";

export const createReviewService = async (params: CreateReviewParams) => {
  try {
    const response = await API.post<ReviewResponse>("/reviews", params);
    return response.data;
  } catch (error) {
    throw error;
  }
};