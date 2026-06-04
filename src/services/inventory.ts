import { api } from "@/axios";
import type {
  ApiResponse,
  PaginatedResponse,
  InventoryCategory,
  InventoryCategoryFormData,
  InventorySummary,
  Product,
  ProductFormData,
  Stock,
} from "@/types/barber-shop";

export const inventoryService = {
  // ─── Categories ──────────────────────────────────────────────
  getCategories: async (params?: {
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResponse<InventoryCategory>> => {
    const res = await api.get("/admin/inventory/categories", { params });
    return res.data;
  },

  getCategoryTree: async (): Promise<ApiResponse<InventoryCategory[]>> => {
    const res = await api.get("/admin/inventory/categories/tree");
    return res.data;
  },

  getCategoryById: async (id: number): Promise<ApiResponse<InventoryCategory>> => {
    const res = await api.get(`/admin/inventory/categories/${id}`);
    return res.data;
  },

  createCategory: async (
    data: InventoryCategoryFormData
  ): Promise<ApiResponse<InventoryCategory>> => {
    const res = await api.post("/admin/inventory/categories", data);
    return res.data;
  },

  updateCategory: async (
    id: number,
    data: InventoryCategoryFormData
  ): Promise<ApiResponse<InventoryCategory>> => {
    const res = await api.put(`/admin/inventory/categories/${id}`, data);
    return res.data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await api.delete(`/admin/inventory/categories/${id}`);
  },

  // ─── Products ────────────────────────────────────────────────
  getProducts: async (params?: {
    category_id?: number;
    search?: string;
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResponse<Product>> => {
    const res = await api.get("/admin/inventory/products", { params });
    return res.data;
  },

  getProductById: async (id: number): Promise<ApiResponse<Product>> => {
    const res = await api.get(`/admin/inventory/products/${id}`);
    return res.data;
  },

  getProductByBarcode: async (
    code: string
  ): Promise<ApiResponse<Product>> => {
    const res = await api.get(`/admin/inventory/products/barcode/${code}`);
    return res.data;
  },

  createProduct: async (
    data: ProductFormData
  ): Promise<ApiResponse<Product>> => {
    const res = await api.post("/admin/inventory/products", data);
    return res.data;
  },

  updateProduct: async (
    id: number,
    data: ProductFormData
  ): Promise<ApiResponse<Product>> => {
    const res = await api.put(`/admin/inventory/products/${id}`, data);
    return res.data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`/admin/inventory/products/${id}`);
  },

  // ─── Stock ───────────────────────────────────────────────────
  getStock: async (params?: {
    category_id?: number;
    low_stock?: boolean;
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResponse<Stock>> => {
    const res = await api.get("/admin/inventory/stock", { params });
    return res.data;
  },

  updateStock: async (
    productId: number,
    shopId: number,
    quantity: number
  ): Promise<void> => {
    await api.put(`/admin/inventory/stock/${productId}/${shopId}`, {
      quantity,
    });
  },

  // ─── Summary ──────────────────────────────────────────────────
  getSummary: async (): Promise<ApiResponse<InventorySummary>> => {
    const res = await api.get("/admin/inventory/summary");
    return res.data;
  },
};
