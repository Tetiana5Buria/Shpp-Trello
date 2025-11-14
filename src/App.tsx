import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Board from './pages/Board/Board';
import Home from './pages/Home/Home';
import CustomToaster from '../src/pages/Board/components/CustomToster/CustomToaster';
import './styles/nprogress.scss';
import LoginPage from './pages/Auth/LoginPage/LoginPage';
import SignupPage from './pages/Auth/SignupPage/SignupPage';
import { ProtectedRoute } from './pages/Auth/ProtectedRoute/ProtectedRoute';
import { AuthBlocker } from './pages/Auth/AuthBlocker/AuthBlocker';

function App(): React.ReactElement {
  return (
    <Router>
      <CustomToaster />
      <AuthBlocker />
      <Routes>
        <Route
          path="/board/:board_id"
          element={
            <ProtectedRoute>
              <Board />
            </ProtectedRoute>
          }
        />
        <Route
          path="/b/:board_id/c/:card_id"
          element={
            <ProtectedRoute>
              <Board />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        {<Route path="/user" element={<SignupPage />} />}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
