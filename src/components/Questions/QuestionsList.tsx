import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert, Button } from 'react-bootstrap';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Question, FilterOptions, PaginationInfo } from '../../types';
import { apiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import QuestionCard from './QuestionCard';
import QuestionFilters from './QuestionFilters';
import Pagination from '../UI/Pagination';
import LoadingSpinner from '../UI/LoadingSpinner';

const QuestionsList: React.FC = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({ sort: 'newest' });
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  const loadQuestions = async (page: number = 1) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await apiService.getQuestions(page, filters);
      setQuestions(response.data);
      setPagination(response.pagination || null);
    } catch (err) {
      setError('Failed to load questions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      const tags = await apiService.getTags();
      setAvailableTags(tags.map(tag => tag.name));
    } catch (err) {
      console.error('Failed to load tags:', err);
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  useEffect(() => {
    loadQuestions(1);
  }, [filters]);

  const handlePageChange = (page: number) => {
    loadQuestions(page);
  };

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">
          {error}
          <Button 
            variant="outline-danger" 
            size="sm" 
            className="ms-2"
            onClick={() => loadQuestions()}
          >
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h2 mb-1">Questions</h1>
              {pagination && (
                <p className="text-muted mb-0">
                  {pagination.total_items} questions found
                </p>
              )}
            </div>
            {user && (
              <Button 
                as={Link} 
                to="/ask" 
                variant="primary"
                className="d-flex align-items-center"
              >
                <Plus size={18} className="me-1" />
                Ask Question
              </Button>
            )}
          </div>

          <QuestionFilters
            filters={filters}
            onFiltersChange={setFilters}
            availableTags={availableTags}
          />

          {loading ? (
            <LoadingSpinner />
          ) : questions.length === 0 ? (
            <Alert variant="info" className="text-center py-5">
              <h4>No questions found</h4>
              <p className="mb-3">
                {filters.search || filters.tag 
                  ? 'Try adjusting your search criteria.' 
                  : 'Be the first to ask a question!'
                }
              </p>
              {user && (
                <Button as={Link} to="/ask" variant="primary">
                  Ask the First Question
                </Button>
              )}
            </Alert>
          ) : (
            <>
              <div className="questions-list">
                {questions.map(question => (
                  <QuestionCard key={question.id} question={question} />
                ))}
              </div>

              {pagination && pagination.total_pages > 1 && (
                <Pagination 
                  pagination={pagination} 
                  onPageChange={handlePageChange} 
                />
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default QuestionsList;