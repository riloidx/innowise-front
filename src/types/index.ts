export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  birthDate: string;
  active: boolean;
}

export interface OrderItem {
  itemId: number;
  quantity: number;
}

export interface OrderItemResponse {
  id: number;
  quantity: number;
  itemId: number;
  name: string;
  price: number;
}

export interface Order {
  id: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELED';
  deleted: boolean;
  totalPrice: number;
  user: {
    id: number;
    name: string;
    surname: string;
  };
  orderItems: OrderItemResponse[];
}

export interface Item {
  id: number;
  name: string;
  price: number;
}

export interface Payment {
  id: string;
  orderId: number;
  userId: number;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  timestamp: string;
  paymentAmount: number;
}
