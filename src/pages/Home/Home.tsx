import React, { useState } from 'react';
/* import List from '../List/List'; */
import Board from './components/Board/Board';
import './home.scss';
import { Link } from 'react-router-dom';

interface BoardType {
  id: number;
  title: string;
  custom: {
    background: string;
  };
}

const Home = () => {
  const [boards] = useState<BoardType[]>([
    { id: 1, title: 'покупки', custom: { background: '#FDE910' } },
    { id: 2, title: 'підготовка до весілля', custom: { background: '#FBEC5D' } },
    { id: 3, title: 'розробка інтернет-магазину', custom: { background: '#F4C430' } },
    { id: 4, title: 'курс по просуванню у соцмережах', custom: { background: '#D1E231' } },
    { id: 5, title: 'завдання для дачі', custom: { background: '#CCFF00' } },
    { id: 6, title: 'ідеї для подарунку батькам', custom: { background: '#EEDC82' } },
  ]);

  return (
    <>
      <div className="homePage">
        <h1>Мої дошки</h1>
        <div className="boards-container">
          {boards.map((board) => (
            <Link to={`/board/${board.id}`} key={board.id}>
              <Board title={board.title} background={board.custom.background} />
            </Link>
          ))}
          <button className="create-board-button">+ Створити дошку</button>
        </div>
      </div>
    </>
  );
};

export default Home;
