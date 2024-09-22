import React from 'react';

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';

import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { NavDropdown } from 'react-bootstrap';

import { useEvents, IEvent } from '../hooks/useEvents'

const MyNavbar = () => {
  const { user } = useAuthContext();
  const logout = useLogout();
  const { events, setEvents } = useEvents();

  const handleLogout = () => {
      logout();
  }

  function handleRemoveNotification(_id: string): void {
    fetch(`http://localhost:4000/api/events/delete/${user._id}/${_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
    }).then(async response => {
        if (!response.ok)
          throw new Error(response.statusText);
        
        const data = await response.json();
        setEvents(events.filter(ev => ev._id !== data._id));

      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }

  return (
      <Navbar className="bg-danger justify-content-between">
        <Navbar.Brand>Selfie</Navbar.Brand>
        <Nav className="mr-auto">
          {user && (
            <>
              <Nav.Link as={Link} style={{color:'white'}} to="/" >
                Home
              </Nav.Link>

              <Nav.Link as={Link} style={{color:'white'}} to="/calendar" >
                Calendario
              </Nav.Link>

              <Nav.Link as={Link} style={{color:'white'}} to="/pomodoro" >
                Pomodoro
              </Nav.Link>
                
              <Nav.Link as={Link} style={{color:'white'}} to="/about" >
                About
              </Nav.Link>
            </>
          )}

          {!user && (
            <>
              <Nav.Link as={Link} style={{color:'white'}} to="/login" >
                Login
              </Nav.Link>

              <Nav.Link as={Link} style={{color:'white'}} to="/signup" >
                Sign Up
              </Nav.Link>
            </>
          )}
        </Nav>
        {user && (
          <Nav className="ml-3">
            <Nav.Item>
              <NavDropdown title="Account" id="basic-nav-dropdown" align="end">
                <NavDropdown.Item as={Link} to="/account-settings">Impostazioni account</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav.Item>

            <Nav.Item>
              <NavDropdown title="Notifica" id="basic-nav-dropdown" align="end">
                  {
                    Array.isArray(events) && events.map((ev : IEvent, index : number) => (
                      <React.Fragment key={index}>
                        <div className="d-flex align-items-center justify-content-between px-3 py-2">
                          <Nav.Item className="flex-grow-1">
                            {ev.titolo}
                          </Nav.Item>
                          <button 
                            className="btn btn-danger btn-sm ml-2" 
                            onClick={() => handleRemoveNotification(ev._id)}
                            title={""}
                          > 
                          </button>
                        </div>
                        {
                          index < events.length - 1 && <NavDropdown.Divider />
                        }
                      </React.Fragment>
                    ))
                  }
              </NavDropdown>
            </Nav.Item>
          </Nav>
        )}
      </Navbar>
  );

};

export default MyNavbar;
