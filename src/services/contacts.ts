import { api } from "@/axios";
import type { PaginatedResponse, Contact } from "@/types/barber-shop";

export interface ContactFilters {
  search?: string;
  page?: number;
  per_page?: number;
}

export const contactService = {
  getAll: async (
    filters: ContactFilters
  ): Promise<PaginatedResponse<Contact>> => {
    const res = await api.get("/admin/contacts", { params: filters });
    return res.data;
  },

  getById: async (id: number): Promise<{ data: Contact }> => {
    const res = await api.get(`/admin/contacts/${id}`);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/admin/contacts/${id}`);
  },
};
