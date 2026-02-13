import { useState, useEffect } from 'react';
import { Container, Table, Alert, Spinner, Badge } from 'react-bootstrap';
import { paymentService, type PaymentResponse } from '../services/paymentService';
import { useAuth } from '../context/AuthContext';

const PaymentsPage = () => {
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userId } = useAuth();

  useEffect(() => {
    loadPayments();
  }, [userId]);

  const loadPayments = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError('');
    try {
      const data = await paymentService.getUserPayments(userId);
      setPayments(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      SUCCESS: 'success',
      FAILED: 'danger',
      PENDING: 'warning',
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
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
      <h2 className="mb-4">My Payments</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {payments.length === 0 ? (
        <Alert variant="info">No payments found.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Order ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>{payment.orderId}</td>
                <td>${payment.paymentAmount.toFixed(2)}</td>
                <td>{getStatusBadge(payment.status)}</td>
                <td>{formatDate(payment.timestamp)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default PaymentsPage;
