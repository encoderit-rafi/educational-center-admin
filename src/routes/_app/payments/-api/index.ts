import api from '@/lib/axios'
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type { PaymentsResponse, Payment, RefundsResponse } from '../-types'

export interface PaymentListParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: string
}

export function useGetPayments(params?: PaymentListParams) {
  return queryOptions({
    queryKey: ['payments', params],
    queryFn: async (): Promise<PaymentsResponse> => {
      const res = await api.get('/admin/payments', {
        params: {
          page: params?.page,
          limit: params?.limit,
          sort_by: params?.sortBy,
          sort_order: params?.sortOrder,
        },
      })
      return res.data.data
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })
}

export function useGetPayment(id: string) {
  return queryOptions({
    queryKey: ['payment', id],
    queryFn: async (): Promise<Payment> => {
      const res = await api.get(`/admin/payments/${id}`)
      return res.data.data
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })
}

function buildRefundPayload(data: { paymentId: string; amount: number; reason?: string }) {
  const payload: Record<string, unknown> = {
    payment_id: data.paymentId,
    amount: data.amount,
  }
  if (data.reason) payload.reason = data.reason
  return payload
}

export function useGetRefunds() {
  return queryOptions({
    queryKey: ['refunds'],
    queryFn: async (): Promise<RefundsResponse> => {
      const res = await api.get('/admin/refunds')
      return res.data.data
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })
}

export function useCreateRefund() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { paymentId: string; amount: number; reason?: string }) => {
      const res = await api.post('/admin/refunds', buildRefundPayload(data))
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['payments'] })
      await queryClient.invalidateQueries({ queryKey: ['refunds'] })
    },
  })
}
