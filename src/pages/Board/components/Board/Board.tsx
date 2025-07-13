import React, { useState } from 'react';
import List from '../List/List';
import './board.scss';
import { useParams } from 'react-router-dom';

interface Card {
  id: number;
  title: string;
}

interface IList {
  id: number;
  title: string;
  cards: Card[];
}

function Board(): React.ReactElement {
  const { board_id } = useParams();
  /*  const [title] = useState<string>('Моя тестова дошка');  */ //для відобрадення напису "Моя сторінка"
  const [] = useState<string>('Моя тестова дошка');
  const [lists] = useState<IList[]>([
    {
      id: 1,
      title: 'Плани',
      cards: [
        { id: 1, title: 'помити кота' },
        { id: 2, title: 'приготувати суп' },
        { id: 3, title: 'сходити в магазин' },
      ],
    },
    {
      id: 2,
      title: 'В процесі',
      cards: [{ id: 4, title: 'подивитися серіал' }],
    },
    {
      id: 3,
      title: 'Зроблено',
      cards: [
        { id: 5, title: 'зробити домашку' },
        { id: 6, title: 'погуляти з собакой' },
      ],
    },
  ]);

  return (
    <div>
      <div className="board-header">
        <button className="to-home-button">⇐ Додому</button>
        <h1 className="board-title">Дошка № {board_id}</h1>
      </div>
      <div className="board-container">
        <div className="lists">
          {lists.map((list) => (
            <List key={list.id} title={list.title} cards={list.cards} />
          ))}
          <div className="add-list-wrapper">
            <button className="add-list-button">+ Додати список</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Board;
