import { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Badge, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { orderService, type OrderResponse } from '../services/orderService';
import { useAuth } from '../context/AuthContext';

const OrdersPage = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userId } = useAuth();
  const navigate = useNavigate();

  const loadOrders = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError('');
    try {
      const data = await orderService.getUserOrders(userId);
      setOrders(data);
    } catch (err: unknown) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [userId]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      await orderService.deleteOrder(id);
      setOrders(orders.filter(order => order.id !== id));
    } catch (err: unknown) {
      setError(err.response?.data?.message || 'Failed to delete order');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      PENDING: 'warning',
      CONFIRMED: 'success',
      CANCELED: 'danger',
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Orders</h2>
        <Button variant="primary" onClick={() => navigate('/orders/create')}>
          Create New Order
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {orders.length === 0 ? (
        <Alert variant="info">No orders found. Create your first order!</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Total Price</th>
              <th>Items</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{getStatusBadge(order.status)}</td>
                <td>${order.totalPrice.toFixed(2)}</td>
                <td>{order.orderItems.length} item(s)</td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    className="me-2"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    View
                  </Button>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => navigate(`/orders/${order.id}/edit`)}
                    disabled={order.status === 'CONFIRMED' || order.status === 'CANCELED'}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="me-2"
                    onClick={() => handleDelete(order.id)}
                    disabled={order.status === 'CONFIRMED' || order.status === 'CANCELED'}
                  >
                    Delete
                  </Button>
                  {order.status === 'PENDING' && (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => navigate(`/orders/${order.id}/pay`)}
                    >
                      Pay
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default OrdersPage;
