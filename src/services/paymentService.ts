import api from './api';

export interface PaymentCreateRequest {
  orderId: number;
  userId: number;
  paymentAmount: number;
}

export interface PaymentResponse {
  id: string;
  orderId: number;
  userId: number;
  status: string;
  timestamp: string;
  paymentAmount: number;
}

export const paymentService = {
  getUserPayments: async (userId: number): Promise<PaymentResponse[]> => {
    const response = await api.get(`/payments/user/${userId}`);
    return response.data;
  },

  createPayment: async (data: PaymentCreateRequest): Promise<PaymentResponse> => {
    const response = await api.post('/payments', data);
    return response.data;
  },
};
