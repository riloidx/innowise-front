import { useState, useEffect } from 'react';
import { Container, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService, type OrderResponse } from '../services/orderService';
import { paymentService } from '../services/paymentService';
import { useAuth } from '../context/AuthContext';

const PaymentPage = () => {
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { id } = useParams<{ id: string }>();
  const { userId } = useAuth();
  const navigate = useNavigate();

  const loadOrder = async () => {
    if (!id) return;
    
    setLoading(true);
    setError('');
    try {
      const data = await orderService.getOrderById(parseInt(id));
      
      if (data.status !== 'PENDING') {
        setError('This order cannot be paid. It may already be paid or cancelled.');
      }
      
      setOrder(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const handlePayment = async () => {
    if (!order || !userId) return;

    setProcessing(true);
    setError('');

    try {
      await paymentService.createPayment({
        orderId: order.id,
        userId: userId,
        paymentAmount: order.totalPrice,
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (err: unknown) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error && !order) {
    return (
      <Container>
        <Alert variant="danger">{error}</Alert>
        <Button onClick={() => navigate('/orders')}>Back to Orders</Button>
      </Container>
    );
  }

  if (success) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="success">
          <h4>Payment Successful!</h4>
          <p>Redirecting to orders...</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Button variant="secondary" className="mb-3" onClick={() => navigate('/orders')}>
        Back to Orders
      </Button>

      <Card>
        <Card.Header>
          <h3>Payment for Order #{order?.id}</h3>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          {order && (
            <>
              <div className="mb-3">
                <h5>Order Summary</h5>
                <p><strong>Total Items:</strong> {order.orderItems.length}</p>
                <p><strong>Total Amount:</strong> ${order.totalPrice.toFixed(2)}</p>
              </div>

              <div className="mb-4">
                <h6>Items:</h6>
                <ul>
                  {order.orderItems.map((item) => (
                    <li key={item.id}>
                      {item.name} - Quantity: {item.quantity} - ${(item.price * item.quantity).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>

              <Alert variant="info">
                Click the button below to process your payment of ${order.totalPrice.toFixed(2)}
              </Alert>

              <div className="d-flex gap-2">
                <Button
                  variant="success"
                  onClick={handlePayment}
                  disabled={processing || order.status !== 'PENDING'}
                >
                  {processing ? 'Processing...' : `Pay $${order.totalPrice.toFixed(2)}`}
                </Button>
                <Button variant="secondary" onClick={() => navigate('/orders')}>
                  Cancel
                </Button>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PaymentPage;
