import { Spinner, Container } from 'react-bootstrap';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner = ({ message = 'Loading...' }: LoadingSpinnerProps) => {
  return (
    <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
      <Spinner animation="border" role="status" variant="primary" />
      <p className="mt-3">{message}</p>
    </Container>
  );
};

export default LoadingSpinner;
