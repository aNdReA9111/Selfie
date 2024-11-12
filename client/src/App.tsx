import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuthContext } from './hooks/useAuthContext';

import Home from './pages/Home';
import Pomodoro from './pages/Pomodoro';
import Calendar from './pages/Calendar';
import { NotesPreview } from './pages/NotesPage';
import About from './pages/About';
import Login from './pages/Login'
import SignUp from './pages/Signup'

// Components
import MyNavbar from './components/MyNavbar';
import { Editor } from './components/Editor';
import MyNotification from './components/MyNotification';

function App() {
  const { user } = useAuthContext();

  return (
    <BrowserRouter>
      {/* Mostra la navbar solo se l'utente è autenticato */}
      {user?.isAuthenticated && <MyNavbar />}

      <MyNotification />
      <Routes>
        {/* Route protette (richiedono autenticazione) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <Calendar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pomodoro"
          element={
            <ProtectedRoute>
              <Pomodoro />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes/edit/:id"
          element={
            <ProtectedRoute>
              <Editor isEdit={true} isView={false} isDuplicate={false}/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes/add"
          element={
            <ProtectedRoute>
              <Editor isEdit={false} isView={false} isDuplicate={false}/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes/:id"
          element={
            <ProtectedRoute>
              <Editor isEdit={false} isView={true} isDuplicate={false}/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <NotesPreview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes/duplicate/:id"
          element={
            <ProtectedRoute>
              <Editor isEdit={false} isView={false} isDuplicate={true}/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/account-settings"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />

        {/* Route pubbliche (accessibili solo se NON autenticati) */}
        <Route
          path="/login"
          element={
            <ProtectedRoute requireAuth={false}>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <ProtectedRoute requireAuth={false}>
              <SignUp />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
