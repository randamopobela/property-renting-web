import API from "@/lib/axiosInstance";

export const getAllPropertiesService = async () => {
  const response = await API.get("/properties"); 
  return response.data;
};