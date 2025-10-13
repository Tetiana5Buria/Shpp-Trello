import React from 'react';
import './board.scss';
import { BoardProps } from '../../../../common/interfaces/Interfaces';
const Board: React.FC<BoardProps> = ({ title, custom }) => {
  const background = custom?.background;
  const backgroundType = custom?.backgroundType || 'color';
  const style: React.CSSProperties = {
    ...(backgroundType === 'color' && { background }),
    ...(backgroundType === 'image' && { backgroundImage: `url(${background})` }),
  };

  return (
    <div className="board-card" style={style}>
      <div className="board-card__title">{title}</div>
    </div>
  );
};

export default Board;
