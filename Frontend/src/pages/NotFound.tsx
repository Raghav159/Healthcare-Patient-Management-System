// src/pages/NotFound.tsx
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { AlertCircle } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <AlertCircle className="h-16 w-16 text-error mb-4" />
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/">
        <Button className="btn-primary">Go to Home</Button>
      </Link>
    </div>
  );
};