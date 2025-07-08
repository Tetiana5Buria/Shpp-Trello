import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
/* import logo from './logo.svg'; */
import './App.css';
import Board from './pages/Board/Board';

function App(): React.ReactElement {
  return (
    <Router>
      <Routes>
        <Route path="/board" element={<Board />} />
      </Routes>
    </Router>
  );
}

export default App;
