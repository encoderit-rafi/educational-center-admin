import { api } from "@/axios";
import type { ApiResponse, PaginatedResponse, Appointment } from "@/types/barber-shop";
import type { User } from "@/hooks/useCurrentUser";

export interface UserFilters {
  search?: string;
  page?: number;
  per_page?: number;
}

export interface UserFormData {
  name: string;
  email: string;
  phone?: string | null;
  password?: string;
  password_confirmation?: string;
  role?: string;
  selected_shop_id?: number | null;
}

export const userService = {
  getByRole: async (
    role: string,
    filters: UserFilters
  ): Promise<PaginatedResponse<User>> => {
    const res = await api.get(`/admin/users/${role}`, { params: filters });
    return res.data;
  },

  getById: async (id: number): Promise<ApiResponse<User>> => {
    const res = await api.get(`/admin/users/show/${id}`);
    return res.data;
  },

  create: async (data: UserFormData): Promise<ApiResponse<User>> => {
    const res = await api.post("/admin/users", data);
    return res.data;
  },

  update: async (
    id: number,
    data: Partial<UserFormData>
  ): Promise<ApiResponse<User>> => {
    const res = await api.put(`/admin/users/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
  },

  getAppointments: async (
    id: number,
    params?: { page?: number; per_page?: number }
  ): Promise<PaginatedResponse<Appointment>> => {
    const res = await api.get(`/admin/customers/${id}/appointments`, { params });
    return res.data;
  },
};
