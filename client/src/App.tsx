import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuthContext } from './hooks/useAuthContext';

import About from './pages/About';
import Calendar from './pages/Calendar';
import Home from './pages/Home';
import Login from './pages/Login';
import { NotesPreview } from './pages/NotesPage';
import Pomodoro from './pages/Pomodoro';
import SignUp from './pages/Signup';

// Components
import { Editor } from './components/Editor';
import MyNavbar from './components/MyNavbar';
import MyNotification from './components/MyNotification';

function App() {
    const { user } = useAuthContext();

    return (
        <BrowserRouter>
            <div className="app-container">
                <MyNavbar />
                {user?.isAuthenticated && <MyNotification />}

                <div className="main-content">
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
                                    <Editor isEdit={true} isView={false} isDuplicate={false} />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/notes/add"
                            element={
                                <ProtectedRoute>
                                    <Editor isEdit={false} isView={false} isDuplicate={false} />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/notes/:id"
                            element={
                                <ProtectedRoute>
                                    <Editor isEdit={false} isView={true} isDuplicate={false} />
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
                                    <Editor isEdit={false} isView={false} isDuplicate={true} />
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
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
