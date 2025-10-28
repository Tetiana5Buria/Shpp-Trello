/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/request';
import Board from './components/Board/Board';
import CreateBoard from './components/CreateBoard/CreateBoard';
import './home.scss';
import SignupForm from './components/UserRegistration/UserRegistaration';

interface BoardType {
  id: number;
  title: string;
  custom: {
    background: string;
  };
}

interface BoardsResponse {
  boards: BoardType[];
}

const Home = () => {
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [isOpen, setIsOpen] = useState(false);
  // === Модалка ===
  const openSignup = () => setIsOpen(true);
  const closeSignup = () => setIsOpen(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const fetchBoards = async () => {
    try {
      const response: BoardsResponse = await api.get('/board');
      setBoards(response.boards);
    } catch (error) {
      setError('Помилка при завантаженні дошок');
      console.error(error);
    }
  };

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark' : 'light';
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    fetchBoards();
  }, []);

  return (
    <div className="homePage">
      <h1>Мої дошки</h1>
      <button onClick={toggleTheme} className="theme-toggle">
        {isDarkMode ? '🌞' : '🌙'}
      </button>
      <button onClick={openSignup} className="signup-btn">
        Реєстрація
      </button>

      <div className="boards-container">
        {boards.map((board) => (
          <Link to={`/board/${board.id}`} key={board.id}>
            <Board title={board.title} custom={board.custom} />
          </Link>
        ))}
        <CreateBoard onBoardCreated={fetchBoards} />
      </div>

      {isOpen && (
        <div className="modal-overlay" onClick={closeSignup}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeSignup} aria-label="Закрити">
              ×
            </button>
            <SignupForm onClose={handleClose} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
