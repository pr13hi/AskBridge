import React from 'react';
import { Form, Row, Col, Button, InputGroup } from 'react-bootstrap';
import { Search, X } from 'lucide-react';
import { FilterOptions } from '../../types';

interface QuestionFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableTags: string[];
}

const QuestionFilters: React.FC<QuestionFiltersProps> = ({
  filters,
  onFiltersChange,
  availableTags
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value });
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tag = e.target.value || undefined;
    onFiltersChange({ ...filters, tag });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sort = e.target.value as FilterOptions['sort'];
    onFiltersChange({ ...filters, sort });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = filters.search || filters.tag || filters.sort !== 'newest';

  return (
    <div className="bg-light p-4 rounded mb-4">
      <Row className="g-3">
        <Col md={6}>
          <Form.Label className="fw-medium">Search Questions</Form.Label>
          <InputGroup>
            <InputGroup.Text>
              <Search size={16} />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by title or description..."
              value={filters.search || ''}
              onChange={handleSearchChange}
            />
          </InputGroup>
        </Col>
        
        <Col md={3}>
          <Form.Label className="fw-medium">Filter by Tag</Form.Label>
          <Form.Select value={filters.tag || ''} onChange={handleTagChange}>
            <option value="">All tags</option>
            {availableTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </Form.Select>
        </Col>
        
        <Col md={3}>
          <Form.Label className="fw-medium">Sort by</Form.Label>
          <div className="d-flex gap-2">
            <Form.Select value={filters.sort || 'newest'} onChange={handleSortChange}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="unanswered">Unanswered</option>
            </Form.Select>
            {hasActiveFilters && (
              <Button 
                variant="outline-secondary" 
                onClick={clearFilters}
                className="d-flex align-items-center"
                title="Clear filters"
              >
                <X size={16} />
              </Button>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default QuestionFilters;