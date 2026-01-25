import { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert, Table } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { orderService, type ItemResponse, type OrderItem } from '../services/orderService';
import { useAuth } from '../context/AuthContext';

const OrderFormPage = () => {
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { userId } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const loadItems = async () => {
    try {
      const data = await orderService.getAllItems();
      setItems(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load items');
    }
  };

  const loadOrder = async () => {
    if (!id) return;
    try {
      const order = await orderService.getOrderById(parseInt(id));
      setSelectedItems(
        order.orderItems.map((item) => ({
          itemId: item.itemId,
          quantity: item.quantity,
        }))
      );
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load order');
    }
  };

  useEffect(() => {
    loadItems();
    if (isEdit) {
      loadOrder();
    }
  }, [id, isEdit]);

  const handleQuantityChange = (itemId: number, quantity: number) => {
    const existing = selectedItems.find((item) => item.itemId === itemId);
    
    if (quantity <= 0) {
      setSelectedItems(selectedItems.filter((item) => item.itemId !== itemId));
    } else if (existing) {
      setSelectedItems(
        selectedItems.map((item) =>
          item.itemId === itemId ? { ...item, quantity } : item
        )
      );
    } else {
      setSelectedItems([...selectedItems, { itemId, quantity }]);
    }
  };

  const getQuantity = (itemId: number) => {
    return selectedItems.find((item) => item.itemId === itemId)?.quantity || 0;
  };

  const calculateTotal = () => {
    return selectedItems.reduce((total, selectedItem) => {
      const item = items.find((i) => i.id === selectedItem.itemId);
      return total + (item?.price || 0) * selectedItem.quantity;
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedItems.length === 0) {
      setError('Please select at least one item');
      return;
    }

    if (!userId) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = { userId, items: selectedItems };
      
      if (isEdit && id) {
        await orderService.updateOrder(parseInt(id), orderData);
      } else {
        await orderService.createOrder(orderData);
      }
      
      navigate('/orders');
    } catch (err: unknown) {
      setError(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} order`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Button variant="secondary" className="mb-3" onClick={() => navigate('/orders')}>
        Back to Orders
      </Button>

      <Card>
        <Card.Header>
          <h3>{isEdit ? 'Edit Order' : 'Create New Order'}</h3>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <h5 className="mb-3">Select Items</h5>
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
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>
                      <Form.Control
                        type="number"
                        min="0"
                        value={getQuantity(item.id)}
                        onChange={(e) =>
                          handleQuantityChange(item.id, parseInt(e.target.value) || 0)
                        }
                        style={{ width: '100px' }}
                      />
                    </td>
                    <td>${(item.price * getQuantity(item.id)).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="text-end">
                    <strong>Total:</strong>
                  </td>
                  <td>
                    <strong>${calculateTotal().toFixed(2)}</strong>
                  </td>
                </tr>
              </tfoot>
            </Table>

            <div className="d-flex gap-2">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : isEdit ? 'Update Order' : 'Create Order'}
              </Button>
              <Button variant="secondary" onClick={() => navigate('/orders')}>
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OrderFormPage;
