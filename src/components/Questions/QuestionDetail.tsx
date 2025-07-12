import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Alert, Breadcrumb } from 'react-bootstrap';
import { formatDistanceToNow } from 'date-fns';
import { User, MessageSquare, ChevronLeft, Lock } from 'lucide-react';
import { Question, Answer } from '../../types';
import { apiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import AnswerCard from '../Answers/AnswerCard';
import AnswerForm from '../Answers/AnswerForm';
import VotingButtons from '../UI/VotingButtons';
import AuthPrompt from '../UI/AuthPrompt';
import AuthModal from '../Auth/AuthModal';
import LoadingSpinner from '../UI/LoadingSpinner';

const QuestionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const loadQuestion = async () => {
    if (!id) return;
    
    setLoading(true);
    setError('');
    
    try {
      const [questionData, answersData] = await Promise.all([
        apiService.getQuestion(parseInt(id)),
        apiService.getAnswers(parseInt(id))
      ]);
      
      setQuestion(questionData);
      setAnswers(answersData);
    } catch (err) {
      setError('Failed to load question');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestion();
  }, [id]);

  const handleAnswerSubmitted = (newAnswer: Answer) => {
    setAnswers(prev => [...prev, newAnswer]);
    if (question) {
      setQuestion(prev => prev ? { ...prev, answer_count: prev.answer_count + 1 } : null);
    }
  };

  const handleQuestionVote = async (voteType: 'up' | 'down') => {
    if (!question) return;
    
    try {
      const updatedQuestion = await apiService.voteQuestion(question.id, voteType);
      setQuestion(updatedQuestion);
    } catch (error) {
      console.error('Failed to vote on question:', error);
    }
  };

  const handleAnswerVote = async (answerId: number, voteType: 'up' | 'down') => {
    try {
      const updatedAnswer = await apiService.voteAnswer(answerId, voteType);
      setAnswers(prev => prev.map(answer => 
        answer.id === answerId ? updatedAnswer : answer
      ));
    } catch (error) {
      console.error('Failed to vote on answer:', error);
    }
  };

  const handleAuthRequired = () => {
    setShowAuthModal(true);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !question) {
    return (
      <Container className="py-4">
        <Alert variant="danger">
          {error || 'Question not found'}
          <div className="mt-3">
            <Button as={Link} to="/" variant="primary">
              Back to Questions
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <Breadcrumb className="mb-4">
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>
              Questions
            </Breadcrumb.Item>
            <Breadcrumb.Item active>
              {question.title}
            </Breadcrumb.Item>
          </Breadcrumb>

          <Button 
            as={Link} 
            to="/" 
            variant="link" 
            className="text-decoration-none mb-3 p-0"
          >
            <ChevronLeft size={16} className="me-1" />
            Back to Questions
          </Button>

          {/* Question */}
          <Card className="mb-4">
            <Card.Body className="d-flex">
              <div className="me-3">
                <VotingButtons
                  votes={question.votes}
                  userVote={question.user_vote}
                  onVote={handleQuestionVote}
                  onAuthRequired={handleAuthRequired}
                  size="lg"
                />
              </div>
              
              <div className="flex-grow-1">
              <h1 className="h3 mb-3">{question.title}</h1>
              
              <div className="mb-4">
                <p className="mb-3 question-content">
                  {question.description}
                </p>
                
                <div className="d-flex flex-wrap gap-1 mb-3">
                  {question.tags.map(tag => (
                    <Badge key={tag.id} bg="secondary" className="tag-badge">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="d-flex justify-content-between align-items-center border-top pt-3">
                <div className="d-flex align-items-center text-muted">
                  <User size={16} className="me-1" />
                  <span className="me-3">{question.user?.name || 'Anonymous'}</span>
                  <span>
                    asked {formatDistanceToNow(new Date(question.created_at), { addSuffix: true })}
                  </span>
                </div>
                
                <div className="d-flex align-items-center text-muted">
                  <MessageSquare size={16} className="me-1" />
                  <span>{answers.length} {answers.length === 1 ? 'answer' : 'answers'}</span>
                </div>
              </div>
              </div>
            </Card.Body>
          </Card>

          {/* Answers */}
          <div className="mb-4">
            <h3 className="h4 mb-3">
              {answers.length > 0 ? `${answers.length} Answers` : 'No Answers Yet'}
            </h3>
            
            {answers.length === 0 ? (
              <Alert variant="info" className="text-center py-4">
                <MessageSquare size={48} className="mb-3 text-muted" />
                <h5>No answers yet</h5>
                <p className="mb-0">Be the first to answer this question!</p>
              </Alert>
            ) : (
              <div className="answers-list">
                {answers.map(answer => (
                  <AnswerCard 
                    key={answer.id} 
                    answer={answer} 
                    onVote={(voteType) => handleAnswerVote(answer.id, voteType)}
                    onAuthRequired={handleAuthRequired}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Answer Form */}
          {user ? (
            <AnswerForm 
              questionId={question.id} 
              onAnswerSubmitted={handleAnswerSubmitted}
            />
          ) : (
            <AuthPrompt 
              action="post an answer"
              onLogin={() => setShowAuthModal(true)}
            />
          )}
          
          <AuthModal 
            show={showAuthModal} 
            onHide={() => setShowAuthModal(false)} 
          />
        </Col>
      </Row>
    </Container>
  );
};

export default QuestionDetail;