import { api } from "@/axios";
import type {
  ApiResponse,
  ShopSettings,
  WorkingHours,
  SetShopHoursPayload,
  Holiday,
  HolidayFormData,
  ShopVacation,
  VacationFormData,
} from "@/types/barber-shop";

export const settingsService = {
  // ─── General ─────────────────────────────────────────────────
  get: async (): Promise<ApiResponse<ShopSettings>> => {
    const res = await api.get("/admin/settings");
    return res.data;
  },

  update: async (data: ShopSettings): Promise<ApiResponse<ShopSettings>> => {
    const res = await api.put("/admin/settings", data);
    return res.data;
  },

  // ─── Hours ───────────────────────────────────────────────────
  getHours: async (
    shopId?: number | null
  ): Promise<ApiResponse<WorkingHours[]>> => {
    const res = await api.get("/admin/settings/hours", {
      params: shopId ? { shop_id: shopId } : undefined,
    });
    return res.data;
  },

  updateHours: async (payload: SetShopHoursPayload): Promise<ApiResponse<WorkingHours[]>> => {
    const res = await api.put("/admin/settings/hours", payload);
    return res.data;
  },

  getShopHours: async (
    shopId: number
  ): Promise<ApiResponse<WorkingHours[]>> => {
    const res = await api.get(`/admin/shops/${shopId}/shop-hours`);
    return res.data;
  },

  // ─── Holidays ────────────────────────────────────────────────
  getHolidays: async (): Promise<ApiResponse<Holiday[]>> => {
    const res = await api.get("/admin/settings/holidays");
    return res.data;
  },

  createHoliday: async (
    data: HolidayFormData
  ): Promise<ApiResponse<Holiday>> => {
    const res = await api.post("/admin/settings/holidays", data);
    return res.data;
  },

  updateHoliday: async (
    id: number,
    data: HolidayFormData
  ): Promise<ApiResponse<Holiday>> => {
    const res = await api.put(`/admin/settings/holidays/${id}`, data);
    return res.data;
  },

  deleteHoliday: async (id: number): Promise<void> => {
    await api.delete(`/admin/settings/holidays/${id}`);
  },

  // ─── Vacations ───────────────────────────────────────────────
  getVacations: async (): Promise<ApiResponse<ShopVacation[]>> => {
    const res = await api.get("/admin/settings/vacations");
    return res.data;
  },

  createVacation: async (
    data: VacationFormData
  ): Promise<ApiResponse<ShopVacation>> => {
    const res = await api.post("/admin/settings/vacations", data);
    return res.data;
  },

  updateVacation: async (
    id: number,
    data: VacationFormData
  ): Promise<ApiResponse<ShopVacation>> => {
    const res = await api.put(`/admin/settings/vacations/${id}`, data);
    return res.data;
  },

  deleteVacation: async (id: number): Promise<void> => {
    await api.delete(`/admin/settings/vacations/${id}`);
  },
};
