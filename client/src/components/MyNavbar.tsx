import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';

const MyNavbar = () => {
    const { user } = useAuthContext();
    const logout= useLogout();
    const handleLogout = () => {
        logout();
    }

    return (
        <Navbar bg='primary'>
          <Navbar.Brand>Selfie</Navbar.Brand>
          <Nav>
            {user && (
              <>
                <Nav.Link as={Link} style={{color:'black'}} to="/">
                  Home
                </Nav.Link>
            
                <Nav.Link as={Link} style={{color:'black'}} to="/about">
                  About
                </Nav.Link>
              </>
            )}

            {!user && (
              <>
                <Nav.Link as={Link} style={{color:'black'}} to="/login">
                  Login
                </Nav.Link>

                <Nav.Link as={Link} style={{color:'black'}} to="/signup">
                  Sign Up
                </Nav.Link>
              </>
            )}

            {user && (<Nav.Item>
              <span>{user.email}</span>
              <Button onClick={handleLogout}>Logout</Button>
            </Nav.Item>)}
          </Nav>
        </Navbar>
    );

};


export default MyNavbar;


