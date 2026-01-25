import { Container, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/orders');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '500px' }}>
        <Card.Body className="text-center">
          <h1 className="mb-4">Welcome</h1>
          <p className="mb-4">Please login or register to continue</p>
          <div className="d-flex gap-2 justify-content-center">
            <Button variant="primary" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button variant="outline-primary" onClick={() => navigate('/register')}>
              Register
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default HomePage;
