import React from 'react';
import './board.scss';

interface BoardProps {
  title: string;
  custom?: {
    background?: string;
  };
}

const Board: React.FC<BoardProps> = ({ title, custom }) => {
  const background = custom?.background || '#ffffff';

  return (
    <div className="board-card" style={{ background }}>
      <div className="board-card__title">{title}</div>
    </div>
  );
};

export default Board;
