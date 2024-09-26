import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';

import Home from './pages/Home';
import Pomodoro from './pages/Pomodoro';
import Calendar from './pages/Calendar';
import { NotesPreview } from './pages/NotesPage';
import About from './pages/About';
import Login from './pages/Login'
import SignUp from './pages/Signup'

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

import { useAuthContext } from './hooks/useAuthContext';


// Navbar
import MyNavbar from './components/MyNavbar';
import { Editor } from './components/Editor';

function App() {
  const { user } = useAuthContext();

  return (
    <>
      <Router>
        {user ? <MyNavbar /> : null}
        <Routes>
          <Route Component={() => (user ? <Home /> :  <Navigate to="/login" />)} path="/" />
          <Route Component={() => (user ? <Calendar /> : <Navigate to="/login" />)} path="/calendar"></Route>
          <Route Component={() => (user ? <Pomodoro /> : <Navigate to="/login" />)} path="/pomodoro"></Route>
          {/*distingue le due route dell'editor con un boolean*/}
          <Route Component={() => (user ? <Editor isEdit={true} isView={false}/> : <Navigate to="/login" />)} path="/notes/edit/:id"></Route>
          <Route Component={() => (user ? <Editor isEdit={false} isView={false}/> : <Navigate to="/login" />)} path="/notes/add"></Route>
          <Route Component={() => (user ? <Editor isEdit={false} isView={true}/> : <Navigate to="/login" />)} path="/notes/:id"></Route>
          <Route Component={() => (user ? <NotesPreview /> : <Navigate to="/login" />)} path="/notes"></Route>
          {/*<Route Component={() => (user ? <NoteView /> : <Navigate to="/login" />)} path="/notes/:id"></Route>*/}

          <Route Component={() => (user ? <About /> : <Navigate to="/login" />)} path="/account-settings"></Route>

          <Route Component={() => (user ? <About /> : <Navigate to="/login" />)} path="/about"></Route>
          <Route Component={() => (!user ? <Login /> : <Navigate to="/" />)} path="/login"></Route>
          <Route Component={() => (!user ? <SignUp /> : <Navigate to="/" />)} path="/signup"></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
