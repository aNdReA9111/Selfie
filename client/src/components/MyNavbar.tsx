import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { NavDropdown } from 'react-bootstrap';
import { BsHouseDoor, BsCalendar3, BsStickyFill, BsClock, BsInfoCircle, BsPersonCircle } from 'react-icons/bs';
import logo from '../assets/logo.png';
import { generateColorFromString } from '../utils/colorUtils';
import '../css/navbar.css';

const MyNavbar = () => {
  const { user } = useAuthContext();
  const logout = useLogout();

  const handleLogout = () => {
      logout();
  }

  return (
      <Navbar bg="danger" variant="dark" expand="lg" className="py-1">
        <Container fluid>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <img
              src={logo}
              height="20"
              width="100"
              className="d-inline-block align-top me-2"
              alt="Selfie Logo"
            />
            Selfie
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {user && (
                <>
                  <Nav.Link as={Link} to="/" className="text-white d-flex align-items-center">
                    <BsHouseDoor className="me-1" /> Home
                  </Nav.Link>

                  <Nav.Link as={Link} to="/calendar" className="text-white d-flex align-items-center">
                    <BsCalendar3 className="me-1" /> Calendario
                  </Nav.Link>

                  <Nav.Link as={Link} to="/notes" className="text-white d-flex align-items-center">
                    <BsStickyFill className="me-1" /> Notes
                  </Nav.Link>

                  <Nav.Link as={Link} to="/pomodoro" className="text-white d-flex align-items-center">
                    <BsClock className="me-1" /> Pomodoro
                  </Nav.Link>

                  <Nav.Link as={Link} to="/about" className="text-white d-flex align-items-center">
                    <BsInfoCircle className="me-1" /> About
                  </Nav.Link>
                </>
              )}

              {!user && (
                <>
                  <Nav.Link as={Link} to="/login" className="text-white">
                    Login
                  </Nav.Link>

                  <Nav.Link as={Link} to="/signup" className="text-white">
                    Sign Up
                  </Nav.Link>
                </>
              )}
            </Nav>
            
            {user && (
              <Nav>
                <NavDropdown 
                  title={
                    <span className="text-white d-flex align-items-center">
                      <div 
                        className="avatar-circle" 
                        style={{ 
                          backgroundColor: generateColorFromString(user.username)
                        }}
                      >
                        {user.username[0].toUpperCase()}
                      </div>
                      Account
                    </span>
                  } 
                  id="basic-nav-dropdown" 
                  align="end"
                  className="custom-dropdown"
                >
                  <NavDropdown.Item as={Link} to="/account-settings">
                    Impostazioni account
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
  );
};

export default MyNavbar;
