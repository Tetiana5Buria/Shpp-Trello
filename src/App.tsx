import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Board from './pages/Board/Board';
import Home from './pages/Home/Home';
import { Toaster } from 'sonner';

function App(): React.ReactElement {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            backgroundColor: '#4b4c45',
            color: '#dbe42a',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            fontSize: '16px',
          },
        }}
      />
      <Routes>
        <Route path="/board/:board_id" element={<Board />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
