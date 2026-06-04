import { api } from "@/axios";
import type { ApiResponse } from "@/types/barber-shop";

export interface RoleWithPermissions {
  id: number;
  name: string;
  permissions: string[];
}

export interface PermissionGroup {
  group: string;
  permissions: string[];
}

export interface PermissionItem {
  id: number;
  name: string;
}

export interface PermissionGroupWithIds {
  group: string;
  permissions: PermissionItem[];
}

export const rolesService = {
  getRoles: async (): Promise<ApiResponse<RoleWithPermissions[]>> => {
    const res = await api.get("/admin/roles");
    return res.data;
  },

  getPermissions: async (): Promise<ApiResponse<PermissionGroup[]>> => {
    const res = await api.get("/admin/permissions");
    return res.data;
  },

  syncPermissions: async (
    roleId: number,
    permissions: string[]
  ): Promise<ApiResponse<RoleWithPermissions>> => {
    const res = await api.put(`/admin/roles/${roleId}/permissions`, {
      permissions,
    });
    return res.data;
  },

  getAllPermissions: async (): Promise<ApiResponse<PermissionGroupWithIds[]>> => {
    const res = await api.get("/admin/permissions");
    return res.data;
  },

  createRole: async (
    name: string
  ): Promise<ApiResponse<RoleWithPermissions>> => {
    const res = await api.post("/admin/roles", { name });
    return res.data;
  },

  updatePermissionGroup: async (
    id: number,
    group: string
  ): Promise<ApiResponse<{ id: number; name: string; group: string }>> => {
    const res = await api.put(`/admin/permissions/${id}`, { group });
    return res.data;
  },
};
