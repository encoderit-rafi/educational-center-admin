import { api } from "@/axios";
import type {
  ApiResponse,
  PaginatedResponse,
  Service,
  ServiceFormData,
} from "@/types/barber-shop";

export interface ServiceFilters {
  page?: number;
  per_page?: number;
  search?: string;
  all?: boolean;
  shop_id?: number;
}

export const serviceService = {
  getAll: async (filters?: ServiceFilters): Promise<PaginatedResponse<Service>> => {
    const res = await api.get("/admin/services", { params: filters });
    return res.data;
  },

  create: async (data: ServiceFormData): Promise<ApiResponse<Service>> => {
    const res = await api.post("/admin/services", data);
    return res.data;
  },

  update: async (
    id: number,
    data: ServiceFormData
  ): Promise<ApiResponse<Service>> => {
    const res = await api.put(`/admin/services/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/admin/services/${id}`);
  },

  toggle: async (id: number): Promise<ApiResponse<Service>> => {
    const res = await api.patch(`/admin/services/${id}/toggle`);
    return res.data;
  },
};
