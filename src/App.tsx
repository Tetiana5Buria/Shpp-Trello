import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Board from './pages/Board/Board';
import Home from './pages/Home/Home';
import CustomToaster from '../src/pages/Board/components/CustomToster/CustomToaster';
function App(): React.ReactElement {
  const basename = process.env.PUBLIC_URL;

  return (
    <Router basename={basename}>
      <CustomToaster />
      <Routes>
        <Route path="/board/:board_id" element={<Board />} />

        <Route path="/b/:board_id/c/:card_id" element={<Board />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
