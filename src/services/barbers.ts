import { api } from "@/axios";
import type {
  ApiResponse,
  PaginatedResponse,
  Barber,
  Vacation,
  VacationFormData,
  WorkingHours,
} from "@/types/barber-shop";

export interface BarberFilters {
  page?: number;
  per_page?: number;
  search?: string;
  shop_id?: number;
}

export const barberService = {
  getAll: async (filters?: BarberFilters): Promise<PaginatedResponse<Barber>> => {
    const res = await api.get("/admin/barbers", { params: filters });
    return res.data;
  },

  getAllForShop: async (shopId: number): Promise<ApiResponse<Barber[]>> => {
    const res = await api.get(`/admin/barbers?shop_id=${shopId}&unassigned=true`);
    return res.data;
  },

  getById: async (id: number): Promise<ApiResponse<Barber>> => {
    const res = await api.get(`/admin/barbers/${id}`);
    return res.data;
  },

  create: async (data: FormData): Promise<ApiResponse<Barber>> => {
    const res = await api.post("/admin/barbers", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  update: async (id: number, data: FormData): Promise<ApiResponse<Barber>> => {
    const res = await api.post(`/admin/barbers/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/admin/barbers/${id}`);
  },

  toggle: async (id: number): Promise<ApiResponse<Barber>> => {
    const res = await api.patch(`/admin/barbers/${id}/toggle`);
    return res.data;
  },

  syncServices: async (id: number, serviceIds: number[]): Promise<void> => {
    await api.post(`/admin/barbers/${id}/services/sync`, {
      service_ids: serviceIds,
    });
  },

  updateHours: async (
    id: number,
    hours: WorkingHours[]
  ): Promise<void> => {
    await api.put(`/admin/barbers/${id}/hours`, { hours });
  },

  getVacations: async (id: number): Promise<ApiResponse<Vacation[]>> => {
    const res = await api.get(`/admin/barbers/${id}/vacations`);
    return res.data;
  },

  syncVacations: async (id: number, vacationIds: number[]): Promise<void> => {
    await api.post(`/admin/barbers/${id}/vacations/sync`, {
      vacation_ids: vacationIds,
    });
  },

  createVacation: async (
    id: number,
    data: VacationFormData
  ): Promise<ApiResponse<Vacation>> => {
    const res = await api.post(`/admin/barbers/${id}/vacations`, data);
    return res.data;
  },

  deleteVacation: async (barberId: number, vacId: number): Promise<void> => {
    await api.delete(`/admin/barbers/${barberId}/vacations/${vacId}`);
  },
};
