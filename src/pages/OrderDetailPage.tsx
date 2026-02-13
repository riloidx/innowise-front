import { useState, useEffect } from "react";
import {
  Container,
  Card,
  Table,
  Button,
  Alert,
  Spinner,
  Badge,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { orderService, type OrderResponse } from "../services/orderService";

const OrderDetailPage = () => {
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const loadOrder = async () => {
    if (!id) return;

    setLoading(true);
    setError("");
    try {
      const data = await orderService.getOrderById(parseInt(id));
      setOrder(data);
    } catch (err: unknown) {
      setError(err.response?.data?.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id, loadOrder]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container>
        <Alert variant="danger">{error || "Order not found"}</Alert>
        <Button onClick={() => navigate("/orders")}>Back to Orders</Button>
      </Container>
    );
  }

  return (
    <Container>
      <Button
        variant="secondary"
        className="mb-3"
        onClick={() => navigate("/orders")}
      >
        Back to Orders
      </Button>

      <Card>
        <Card.Header>
          <h3>Order #{order.id}</h3>
        </Card.Header>
        <Card.Body>
          <div className="mb-3">
            <strong>Status:</strong>{" "}
            <Badge bg={order.status === "CONFIRMED" ? "success" : order.status === "CANCELED" ? "danger" : "warning"}>
              {order.status}
            </Badge>
          </div>
          <div className="mb-3">
            <strong>Customer:</strong> {order.user.name} {order.user.surname}
          </div>
          <div className="mb-3">
            <strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}
          </div>

          <h5 className="mt-4">Order Items</h5>
          <Table striped bordered>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          {order.status === "PENDING" && (
            <Button
              variant="success"
              onClick={() => navigate(`/orders/${order.id}/pay`)}
            >
              Pay Now
            </Button>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OrderDetailPage;
