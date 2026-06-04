import api from '@/lib/axios';
import { useMutation, useQuery } from '@tanstack/react-query';

export interface ZohoStatusResponse {
  success: boolean;
  message: string;
  data: {
    connected: boolean;
    oauthConfigured: boolean;
    booksConfigured: boolean;
    encryptionConfigured: boolean;
    redirectUri: string;
  };
}

export function useZohoStatus() {
  return useQuery<ZohoStatusResponse>({
    queryKey: ['zohoStatus'],
    queryFn: async () => {
      const res = await api.get('/admin/zoho/status');
      return res.data;
    },
  });
}

export function useZohoAuthUrl() {
  return useMutation({
    mutationFn: async () => {
      const res = await api.get('/admin/zoho/auth-url');
      return res.data;
    },
  });
}

export function useZohoDisconnect() {
  return useMutation({
    mutationFn: async () => {
      const res = await api.post('/admin/zoho/disconnect');
      return res.data;
    },
  });
}

