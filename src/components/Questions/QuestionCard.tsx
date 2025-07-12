import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, User, ChevronUp } from 'lucide-react';
import { Question } from '../../types';

interface QuestionCardProps {
  question: Question;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  return (
    <Card className="mb-3 question-card">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="flex-grow-1">
            <Link 
              to={`/questions/${question.id}`} 
              className="text-decoration-none"
            >
              <Card.Title className="h5 mb-2 text-primary question-title">
                {question.title}
              </Card.Title>
            </Link>
            
            <Card.Text className="text-muted mb-3 question-description">
              {question.description.length > 200 
                ? `${question.description.substring(0, 200)}...` 
                : question.description
              }
            </Card.Text>
            
            <div className="d-flex flex-wrap gap-1 mb-3">
              {question.tags.map(tag => (
                <Badge 
                  key={tag.id} 
                  bg="secondary" 
                  className="tag-badge"
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="text-end ms-3 question-stats d-flex flex-column align-items-end">
            <div className="d-flex align-items-center mb-2">
              <ChevronUp size={16} className="me-1 text-success" />
              <span className="badge bg-light text-dark">
                {question.votes} votes
              </span>
            </div>
            <div className="d-flex align-items-center mb-2">
              <MessageSquare size={16} className="me-1 text-muted" />
              <span className="badge bg-light text-dark">
                {question.answer_count} {question.answer_count === 1 ? 'answer' : 'answers'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="d-flex justify-content-between align-items-center text-muted small">
          <div className="d-flex align-items-center">
            <User size={14} className="me-1" />
            <span>{question.user?.name || 'Anonymous'}</span>
          </div>
          <span>
            {formatDistanceToNow(new Date(question.created_at), { addSuffix: true })}
          </span>
        </div>
      </Card.Body>
    </Card>
  );
};

export default QuestionCard;