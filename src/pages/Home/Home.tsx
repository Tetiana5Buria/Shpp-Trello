import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/request';
import Board from './components/Board/Board';
import CreateBoard from './components/CreateBoard/CreateBoard';
import './home.scss';

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

  const fetchBoards = async () => {
    try {
      const response: BoardsResponse = await api.get('/board');
      setBoards(response.boards);
    } catch (error) {
      setError('Помилка при завантаженні дошок');
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="homePage">
      <h1>Мої дошки</h1>
      <div className="boards-container">
        {boards.map((board) => (
          <Link to={`/board/${board.id}`} key={board.id}>
            <Board title={board.title} custom={board.custom} />
          </Link>
        ))}
        <CreateBoard onBoardCreated={fetchBoards} />
      </div>
    </div>
  );
};

export default Home;
