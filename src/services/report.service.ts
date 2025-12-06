import API from "@/lib/axiosInstance";

export const getSalesReportService = async (startDate?: string, endDate?: string) => {
  try {
    const params = { start: startDate, end: endDate };
    const response = await API.get("/reports/sales", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAvailabilityService = async () => {
  try {
    const response = await API.get("/reports/calendar");
    return response.data;
  } catch (error) {
    throw error;
  }
};