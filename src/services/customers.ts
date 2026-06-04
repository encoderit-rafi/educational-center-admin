import { api } from "@/axios";
import type {
  ApiResponse,
  PaginatedResponse,
  Customer,
  CustomerFormData,
  Appointment,
} from "@/types/barber-shop";

export interface CustomerFilters {
  search?: string;
  page?: number;
  per_page?: number;
}

export const customerService = {
  getAll: async (
    filters: CustomerFilters
  ): Promise<PaginatedResponse<Customer>> => {
    const res = await api.get("/admin/customers", { params: filters });
    return res.data;
  },

  getById: async (id: number): Promise<ApiResponse<Customer>> => {
    const res = await api.get(`/admin/customers/${id}`);
    return res.data;
  },

  create: async (data: CustomerFormData): Promise<ApiResponse<Customer>> => {
    const res = await api.post("/admin/customers", data);
    return res.data;
  },

  update: async (
    id: number,
    data: Partial<CustomerFormData>
  ): Promise<ApiResponse<Customer>> => {
    const res = await api.put(`/admin/customers/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/admin/customers/${id}`);
  },

  getAppointments: async (
    id: number,
    params?: { page?: number }
  ): Promise<PaginatedResponse<Appointment>> => {
    const res = await api.get(`/admin/customers/${id}/appointments`, {
      params,
    });
    return res.data;
  },
};
