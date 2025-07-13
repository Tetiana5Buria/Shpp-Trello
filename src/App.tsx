import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Board from './pages/Board/components/Board/Board';
import Home from './pages/Home/Home';

function App(): React.ReactElement {
  return (
    <Router>
      <Routes>
        <Route path="/board/:board_id" element={<Board />} />
        <Route path="/" element={<Home />} /> {/* localhost 3000 */}
      </Routes>
    </Router>
  );
}

export default App;
