import React from 'react';
import { ICard } from '../../../../common/interfaces/ICard';
import Card from '../Card/Card';
import './list.scss';

interface ListProps {
  title: string;
  cards: ICard[];
}

const List: React.FC<ListProps> = ({ title, cards }) => {
  return (
    <div className="list">
      <h2 className="list-title">{title}</h2>
      <ul className="card-list">
        {cards.map((card) => (
          <li key={card.id} className="card-item">
            <Card title={card.title} />
          </li>
        ))}
      </ul>
      <button className="add-card-button">+ Додати</button>
    </div>
  );
};

export default List;
