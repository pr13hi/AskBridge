import React, { useState } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, LogOut, MessageSquare } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../Auth/AuthModal';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <Navbar bg="white" expand="lg" className="border-bottom" sticky="top">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
            <MessageSquare className="me-2" size={24} />
            StackIt
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Questions</Nav.Link>
              {user && (
                <Nav.Link as={Link} to="/ask">Ask Question</Nav.Link>
              )}
            </Nav>
            
            <Nav className="align-items-center">
              {user ? (
                <>
                  <div className="d-flex align-items-center me-3">
                    <User size={18} className="me-1" />
                    <span className="fw-medium">{user.name}</span>
                  </div>
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    onClick={handleLogout}
                    className="d-flex align-items-center"
                  >
                    <LogOut size={16} className="me-1" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button 
                  variant="primary"
                  onClick={() => setShowAuthModal(true)}
                  className="d-flex align-items-center"
                >
                  <User size={16} className="me-1" />
                  Login
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <AuthModal 
        show={showAuthModal} 
        onHide={() => setShowAuthModal(false)} 
      />
    </>
  );
};

export default Header;