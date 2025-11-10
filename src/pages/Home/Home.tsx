/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/request';
import Board from './components/Board/Board';
import CreateBoard from './components/CreateBoard/CreateBoard';
import { BoardType, BoardsResponse } from '../../common/interfaces/Interfaces'; // винесла в інтерфейси
import { Sun, Moon } from 'lucide-react';
import './home.scss';
import CustomButton from '../../common/customButton/CustomButton';

const Home = () => {
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  const fetchBoards = async () => {
    if (!isAuthenticated) return;

    try {
      const response = await api.get<BoardsResponse>('/board');
      setBoards(response.data.boards || []);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401) {
        setError('Сесія завершена. Увійдіть знову.');
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        setIsAuthenticated(false);
        navigate('/login');
      } else {
        setError('Помилка при завантаженні дошок');
      }
    }
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark' : 'light';
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    fetchBoards();
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <div className="homePage">
      <h1>Мої дошки</h1>

      <div className="top-buttons">
        <CustomButton onClick={toggleTheme} className="theme-toggle">
          {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
        </CustomButton>

        {isAuthenticated && (
          <CustomButton className="exit-button" onClick={handleLogout}>
            Вийти
          </CustomButton>
        )}
      </div>

      {isAuthenticated ? (
        <div className="boards-container">
          {boards.length > 0 ? (
            boards.map((board) => (
              <Link to={`/board/${board.id}`} key={board.id}>
                <Board title={board.title} custom={board.custom} />
              </Link>
            ))
          ) : (
            <p>У вас ще немає дошок. Створіть першу!</p>
          )}
          <CreateBoard onBoardCreated={fetchBoards} />
        </div>
      ) : (
        <p className="login_prompt">
          Ви не авторизовані. <Link to="/login">Увійти</Link>
        </p>
      )}

      {error && <p className="errorMessage">{error}</p>}
    </div>
  );
};

export default Home;
