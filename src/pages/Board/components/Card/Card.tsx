import React from 'react';
import './card.scss';

interface CardProps {
  title: string;
}

const Card: React.FC<CardProps> = ({ title }) => {
  return <div className="card">{title}</div>;
};

export default Card;
