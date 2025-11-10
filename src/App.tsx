import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Board from './pages/Board/Board';
import Home from './pages/Home/Home';
import CustomToaster from '../src/pages/Board/components/CustomToster/CustomToaster';
import './styles/nprogress.scss';
import LoginPage from './pages/Home/components/LoginPage/LoginPage';
import SignupPage from './pages/Home/components/SignupPage/SignupPage';
/* import Registration from './pages/Registration'; */

function App(): React.ReactElement {
  return (
    <Router>
      <CustomToaster />
      <Routes>
        <Route path="/board/:board_id" element={<Board />} />
        <Route path="/b/:board_id/c/:card_id" element={<Board />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        {<Route path="/user" element={<SignupPage />} />}
      </Routes>
    </Router>
  );
}

export default App;
