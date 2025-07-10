import React, { useState } from 'react';
/* import List from '../List/List'; */
import Board from './components/Board/Board';
import './home.scss';

interface BoardType {
  id: number;
  title: string;
  custom: {
    background: string;
  };
}

const Home = () => {
  const [boards] = useState<BoardType[]>([
    { id: 1, title: 'покупки', custom: { background: 'red' } },
    { id: 2, title: 'підготовка до весілля', custom: { background: 'green' } },
    { id: 3, title: 'розробка інтернет-магазину', custom: { background: 'blue' } },
    { id: 4, title: 'курс по просуванню у соцмережах', custom: { background: 'grey' } },
    { id: 5, title: 'завдання для дачі', custom: { background: 'pink' } },
    { id: 6, title: 'ідеї для подарунку батькам', custom: { background: 'yellow' } },
  ]);

  return (
    <>
      <div className="homePage">
        <h1>Мої дошки</h1>
        <div className="boards-container">
          {boards.map((board) => (
            <Board key={board.id} title={board.title} background={board.custom.background} />
          ))}
          <button className="create-board-button">+ Створити дошку</button>
        </div>
      </div>
    </>
  );
};

export default Home;
