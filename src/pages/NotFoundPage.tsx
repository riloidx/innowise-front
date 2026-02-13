import { Container, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '400px' }}>
        <Card.Body className="text-center">
          <h1 className="display-1">404</h1>
          <h3 className="mb-4">Page Not Found</h3>
          <p className="mb-4">The page you are looking for does not exist.</p>
          <Button variant="primary" onClick={() => navigate('/')}>
            Go to Home
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default NotFoundPage;
