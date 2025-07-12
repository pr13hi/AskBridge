import React from 'react';
import { Card } from 'react-bootstrap';
import { formatDistanceToNow } from 'date-fns';
import { User } from 'lucide-react';
import { Answer } from '../../types';
import VotingButtons from '../UI/VotingButtons';

interface AnswerCardProps {
  answer: Answer;
  onVote: (voteType: 'up' | 'down') => Promise<void>;
  onAuthRequired: () => void;
}

const AnswerCard: React.FC<AnswerCardProps> = ({ answer, onVote, onAuthRequired }) => {
  return (
    <Card className="mb-3 answer-card">
      <Card.Body className="d-flex">
        <div className="me-3">
          <VotingButtons
            votes={answer.votes}
            userVote={answer.user_vote}
            onVote={onVote}
            onAuthRequired={onAuthRequired}
          />
        </div>
        
        <div className="flex-grow-1">
        <div className="answer-content mb-3">
          {answer.content.split('\n').map((paragraph, index) => {
            // Handle code blocks
            if (paragraph.startsWith('```')) {
              return null; // Skip opening code block markers
            }
            
            // Check if this is a code block content
            const isCodeBlock = paragraph.trim().startsWith('//') || 
                               paragraph.includes('const ') || 
                               paragraph.includes('function ') ||
                               paragraph.includes('class ') ||
                               paragraph.includes('def ') ||
                               paragraph.includes('import ') ||
                               paragraph.includes('from ');
            
            if (isCodeBlock) {
              return (
                <pre key={index} className="bg-light p-3 rounded">
                  <code>{paragraph}</code>
                </pre>
              );
            }
            
            return paragraph.trim() ? (
              <p key={index} className="mb-2">
                {paragraph}
              </p>
            ) : null;
          })}
        </div>
        
        <div className="d-flex justify-content-between align-items-center text-muted small border-top pt-3">
          <div className="d-flex align-items-center">
            <User size={14} className="me-1" />
            <span>{answer.user?.name || 'Anonymous'}</span>
          </div>
          <span>
            {formatDistanceToNow(new Date(answer.created_at), { addSuffix: true })}
          </span>
        </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default AnswerCard;