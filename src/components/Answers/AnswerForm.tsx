import React, { useState } from 'react';
import { Card, Button, Alert, Spinner, Form } from 'react-bootstrap';
import { Send } from 'lucide-react';
import { apiService } from '../../services/api';
import { Answer } from '../../types';
import RichTextEditor from '../UI/RichTextEditor';

interface AnswerFormProps {
  questionId: number;
  onAnswerSubmitted: (answer: Answer) => void;
}

const AnswerForm: React.FC<AnswerFormProps> = ({ questionId, onAnswerSubmitted }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Please provide an answer');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newAnswer = await apiService.createAnswer(questionId, content.trim());
      onAnswerSubmitted(newAnswer);
      setContent('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post answer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Body>
        <h4 className="h5 mb-3">Your Answer</h4>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Write your answer here... You can include code snippets, explanations, and examples."
            />
            <div className="form-text text-muted mt-2">
              Use clear explanations and include code examples when helpful.
            </div>
          </Form.Group>
          
          <div className="d-flex justify-content-end">
            <Button 
              type="submit" 
              variant="primary"
              disabled={loading || !content.trim()}
              className="d-flex align-items-center"
            >
              {loading ? (
                <Spinner animation="border" size="sm" className="me-2" />
              ) : (
                <Send size={16} className="me-2" />
              )}
              Post Answer
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AnswerForm;