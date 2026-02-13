import api from './api';

export interface OrderItem {
  itemId: number;
  quantity: number;
}

export interface OrderCreateRequest {
  userId: number;
  items: OrderItem[];
}

export interface OrderItemResponse {
  id: number;
  quantity: number;
  itemId: number;
  name: string;
  price: number;
}

export interface OrderResponse {
  id: number;
  status: string;
  deleted: boolean;
  totalPrice: number;
  user: {
    id: number;
    name: string;
    surname: string;
  };
  orderItems: OrderItemResponse[];
}

export interface ItemResponse {
  id: number;
  name: string;
  price: number;
}

export const orderService = {
  getUserOrders: async (userId: number): Promise<OrderResponse[]> => {
    const response = await api.get(`/orders/user/${userId}`);
    return response.data;
  },

  getOrderById: async (id: number): Promise<OrderResponse> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  createOrder: async (data: OrderCreateRequest): Promise<OrderResponse> => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  updateOrder: async (id: number, data: OrderCreateRequest): Promise<OrderResponse> => {
    const response = await api.put(`/orders/${id}`, data);
    return response.data;
  },

  deleteOrder: async (id: number): Promise<void> => {
    await api.delete(`/orders/${id}`);
  },

  getAllItems: async (): Promise<ItemResponse[]> => {
    const response = await api.get('/orders/items');
    return response.data;
  },
};
