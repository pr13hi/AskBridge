import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Plus, X, HelpCircle } from 'lucide-react';
import { apiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import RichTextEditor from '../UI/RichTextEditor';

const AskQuestion: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [] as string[]
  });
  
  const [tagInput, setTagInput] = useState('');
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    
    const loadTags = async () => {
      try {
        const tags = await apiService.getTags();
        setAvailableTags(tags.map(tag => tag.name));
      } catch (err) {
        console.error('Failed to load tags:', err);
      }
    };
    
    loadTags();
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newQuestion = await apiService.createQuestion(
        formData.title.trim(),
        formData.description.trim(),
        formData.tags
      );
      
      navigate(`/questions/${newQuestion.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create question');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const addTag = (tagName: string) => {
    const tag = tagName.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const suggestedTags = availableTags.filter(tag => 
    tag.toLowerCase().includes(tagInput.toLowerCase()) && 
    !formData.tags.includes(tag)
  );

  if (!user) {
    return null;
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={8}>
          <div className="mb-4">
            <h1 className="h2 mb-1">Ask a Question</h1>
            <p className="text-muted">
              Get help from the community by asking a clear, specific question.
            </p>
          </div>

          <Card>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium">
                    Title <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., How to implement JWT authentication in React?"
                    required
                  />
                  <Form.Text className="text-muted">
                    Be specific and clear. Imagine you're asking a friend for help.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium">
                    Description <span className="text-danger">*</span>
                  </Form.Label>
                  <RichTextEditor
                    value={formData.description}
                    onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                    placeholder="Describe your problem in detail. Include any code you've tried, error messages, and what you expected to happen."
                  />
                  <div className="form-text text-muted mt-2">
                    Include relevant code, error messages, and what you've tried.
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium">Tags</Form.Label>
                  
                  {/* Current Tags */}
                  {formData.tags.length > 0 && (
                    <div className="mb-2">
                      {formData.tags.map(tag => (
                        <Badge 
                          key={tag} 
                          bg="primary" 
                          className="me-2 mb-2 d-inline-flex align-items-center"
                        >
                          {tag}
                          <X 
                            size={14} 
                            className="ms-1 cursor-pointer" 
                            onClick={() => removeTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {/* Tag Input */}
                  <div className="d-flex gap-2 mb-2">
                    <Form.Control
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleTagInputKeyPress}
                      placeholder="Add a tag (e.g., javascript, react, python)"
                    />
                    <Button 
                      variant="outline-primary"
                      onClick={() => addTag(tagInput)}
                      disabled={!tagInput.trim()}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  
                  {/* Suggested Tags */}
                  {suggestedTags.length > 0 && tagInput && (
                    <div className="mb-2">
                      <small className="text-muted d-block mb-1">Suggestions:</small>
                      {suggestedTags.slice(0, 5).map(tag => (
                        <Badge
                          key={tag}
                          bg="light"
                          text="dark"
                          className="me-2 mb-1 cursor-pointer"
                          onClick={() => addTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <Form.Text className="text-muted">
                    Add tags to help others find your question. Press Enter or click + to add.
                  </Form.Text>
                </Form.Group>

                <Alert variant="light" className="border mb-4">
                  <HelpCircle size={20} className="me-2" />
                  <strong>Tips for a great question:</strong>
                  <ul className="mb-0 mt-2">
                    <li>Make your title specific and descriptive</li>
                    <li>Include relevant code and error messages</li>
                    <li>Explain what you've already tried</li>
                    <li>Use appropriate tags to help others find your question</li>
                  </ul>
                </Alert>

                <div className="d-flex gap-2">
                  <Button 
                    type="submit" 
                    variant="primary"
                    disabled={loading || !formData.title.trim() || !formData.description.trim()}
                  >
                    {loading ? (
                      <Spinner animation="border" size="sm" className="me-2" />
                    ) : null}
                    Post Question
                  </Button>
                  <Button 
                    variant="outline-secondary"
                    onClick={() => navigate('/')}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AskQuestion;