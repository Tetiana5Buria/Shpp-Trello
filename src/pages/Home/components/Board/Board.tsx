import React from 'react';
import './board.scss';

interface BoardProps {
  title: string;
  background: string;
}

const Board: React.FC<BoardProps> = ({ title, background }) => {
  return (
    <div className="board-card" style={{ background }}>
      <div className="board-card__title">{title}</div>
    </div>
  );
};

export default Board;
