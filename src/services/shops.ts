import { api } from "@/axios";
import type {
  ApiResponse,
  Shop,
  ShopFormData,
} from "@/types/barber-shop";

export const shopService = {
  getAll: async (): Promise<ApiResponse<Shop[]>> => {
    const res = await api.get("/admin/shops");
    return res.data;
  },

  getById: async (id: number): Promise<ApiResponse<Shop>> => {
    const res = await api.get(`/admin/shops/${id}`);
    return res.data;
  },

  create: async (data: ShopFormData): Promise<ApiResponse<Shop>> => {
    const res = await api.post("/admin/shops", data);
    return res.data;
  },

  update: async (
    id: number,
    data: ShopFormData
  ): Promise<ApiResponse<Shop>> => {
    const res = await api.put(`/admin/shops/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/admin/shops/${id}`);
  },

  toggle: async (id: number): Promise<ApiResponse<Shop>> => {
    const res = await api.patch(`/admin/shops/${id}/toggle`);
    return res.data;
  },

  syncBarbers: async (
    id: number,
    barberIds: number[]
  ): Promise<void> => {
    await api.post(`/admin/shops/${id}/barbers/sync`, {
      barber_ids: barberIds,
    });
  },

  syncServices: async (
    id: number,
    serviceIds: number[]
  ): Promise<void> => {
    await api.post(`/admin/shops/${id}/services/sync`, {
      service_ids: serviceIds,
    });
  },

  select: async (id: number): Promise<ApiResponse<Shop>> => {
    const res = await api.post(`/admin/shop/select/${id}`);
    return res.data;
  },

  selectAll: async (): Promise<void> => {
    await api.post("/admin/shop/select/all");
  },

  getSelected: async (): Promise<ApiResponse<Shop | null>> => {
    const res = await api.get("/admin/shop/select/current");
    return res.data;
  },
};
