import React from 'react';
import { Alert, Button } from 'react-bootstrap';
import { User, Lock } from 'lucide-react';

interface AuthPromptProps {
  action: string;
  onLogin: () => void;
  variant?: 'info' | 'warning';
  className?: string;
}

const AuthPrompt: React.FC<AuthPromptProps> = ({
  action,
  onLogin,
  variant = 'info',
  className = ''
}) => {
  return (
    <Alert variant={variant} className={`text-center ${className}`}>
      <Lock size={24} className="mb-2 text-muted" />
      <h5>Authentication Required</h5>
      <p className="mb-3">
        Please log in to {action}.
      </p>
      <Button variant="primary" onClick={onLogin} className="d-flex align-items-center mx-auto">
        <User size={16} className="me-2" />
        Login to Continue
      </Button>
    </Alert>
  );
};

export default AuthPrompt;