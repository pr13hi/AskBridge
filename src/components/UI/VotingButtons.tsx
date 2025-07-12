import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface VotingButtonsProps {
  votes: number;
  userVote?: 'up' | 'down' | null;
  onVote: (voteType: 'up' | 'down') => Promise<void>;
  onAuthRequired: () => void;
  size?: 'sm' | 'lg';
}

const VotingButtons: React.FC<VotingButtonsProps> = ({
  votes,
  userVote,
  onVote,
  onAuthRequired,
  size = 'sm'
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<'up' | 'down' | null>(null);

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!user) {
      onAuthRequired();
      return;
    }

    setLoading(voteType);
    try {
      await onVote(voteType);
    } catch (error) {
      console.error('Voting failed:', error);
    } finally {
      setLoading(null);
    }
  };

  const buttonSize = size === 'lg' ? 'sm' : 'sm';
  const iconSize = size === 'lg' ? 20 : 16;

  return (
    <div className="voting-buttons d-flex flex-column align-items-center">
      <Button
        variant={userVote === 'up' ? 'success' : 'outline-secondary'}
        size={buttonSize}
        onClick={() => handleVote('up')}
        disabled={loading !== null}
        className="vote-button mb-1"
      >
        {loading === 'up' ? (
          <Spinner animation="border" size="sm" />
        ) : (
          <ChevronUp size={iconSize} />
        )}
      </Button>
      
      <div className={`vote-count fw-bold ${size === 'lg' ? 'fs-5' : 'small'} text-center`}>
        {votes}
      </div>
      
      <Button
        variant={userVote === 'down' ? 'danger' : 'outline-secondary'}
        size={buttonSize}
        onClick={() => handleVote('down')}
        disabled={loading !== null}
        className="vote-button mt-1"
      >
        {loading === 'down' ? (
          <Spinner animation="border" size="sm" />
        ) : (
          <ChevronDown size={iconSize} />
        )}
      </Button>
    </div>
  );
};

export default VotingButtons;