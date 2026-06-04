import { api } from "@/axios";
import type {
  ApiResponse,
  Appointment,
  AppointmentFormData,
  PaginatedResponse,
} from "@/types/barber-shop";

export interface AvailableSlot {
  time: string;
  available: boolean;
}

export interface AvailableSlotsResponse {
  date: string;
  slots: AvailableSlot[];
}

export interface AppointmentFilters {
  date_from?: string;
  date_to?: string;
  barber_id?: number;
  service_id?: number;
  status?: string;
  search?: string;
  page?: number;
  per_page?: number;
  recurring_group_id?: string;
}

export const appointmentService = {
  getAll: async (
    filters: AppointmentFilters
  ): Promise<PaginatedResponse<Appointment>> => {
    const res = await api.get("/admin/appointments", { params: filters });
    return res.data;
  },

  getById: async (id: number): Promise<ApiResponse<Appointment>> => {
    const res = await api.get(`/admin/appointments/${id}`);
    return res.data;
  },

  create: async (
    data: AppointmentFormData
  ): Promise<ApiResponse<Appointment>> => {
    const res = await api.post("/admin/appointments", data);
    return res.data;
  },

  update: async (
    id: number,
    data: Partial<AppointmentFormData>
  ): Promise<ApiResponse<Appointment>> => {
    const res = await api.put(`/admin/appointments/${id}`, data);
    return res.data;
  },

  getAvailableSlots: async (params: {
    barber_id: number;
    service_id: number;
    date: string;
    shop_id?: number;
  }): Promise<AvailableSlotsResponse> => {
    const res = await api.get("/availability/slots", { params });
    return res.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/admin/appointments/${id}`);
  },

  updateStatus: async (
    id: number,
    status: string,
    sendEmail?: boolean
  ): Promise<ApiResponse<Appointment>> => {
    const res = await api.patch(`/admin/appointments/${id}/status`, { 
      status,
      ...(sendEmail !== undefined && { send_email: sendEmail })
    });
    return res.data;
  },
};
