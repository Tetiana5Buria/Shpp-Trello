import React, { useState, useEffect } from 'react';
import { ICard } from '../../../../common/interfaces/ICard';
import Card from '../Card/Card';
import CreateCard from '../CreateCard/CreateCard';
import './list.scss';
import api from '../../../../api/request';
import { validateTitle } from '../../../../utils/validateTitle';
import { toast } from 'sonner';

interface ListProps {
  title: string;
  cards: ICard[];
  listId: number;
  boardId: number;
  onListCreated: () => void;
  color?: string;
}

const List: React.FC<ListProps> = ({ title, cards, listId, boardId, onListCreated, color: initialColor }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [error, setError] = useState<string | null>(null);
  const [color, setColor] = useState(initialColor);
  const handleColorChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    try {
      await api.put(`/board/${boardId}/list/${listId}`, {
        custom: { background: newColor },
      });
      toast.success('Колір списку змінено!');
    } catch (err) {
      // eslint-disable-next-line no-console
      toast.error('Помилка при оновленні кольору:');
    }
  };
  useEffect(() => {
    setColor(initialColor);
  }, [initialColor]);

  const handleUpdateListTitle = async () => {
    const { isValid, errorMessage } = validateTitle(editedTitle);
    if (!isValid) {
      setError(errorMessage);
      return;
    }
    try {
      await api.put(`/board/${boardId}/list/${listId}`, {
        title: editedTitle,
        custom: { background: color },
      });
      toast.success('Список успішно відредаговано!');
      setIsEditing(false);
      setError(null);
      onListCreated();
    } catch (err) {
      setError('Помилка при оновленні списку');
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };
  const handleDeleteList = async () => {
    // eslint-disable-next-line no-alert
    const confirmed = window.confirm('Ви впевнені, що хочете видалити список?');
    if (!confirmed || !listId) return;

    try {
      await api.delete(`/board/${boardId}/list/${listId}`);
      toast.success('Список видалено!');
      onListCreated(); // оновлює списки на сторінці
    } catch (err) {
      toast.error('Помилка при видаленні списку');
      // eslint-disable-next-line no-console
      toast.error('Delete list error:');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleUpdateListTitle();
    if (e.key === 'Escape') setIsEditing(false);
  };

  return (
    <div className="list" style={{ background: color || '#fffacd' }}>
      {isEditing ? (
        <input
          value={editedTitle}
          onChange={(e) => {
            setEditedTitle(e.target.value);
            setError(null);
          }}
          onBlur={handleUpdateListTitle}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <div className="list-header">
          <h2 className="list-title" onClick={() => setIsEditing(true)}>
            {title}
          </h2>
          <input
            type="color"
            value={color}
            onChange={handleColorChange}
            className="color-picker"
            title="Обрати колір списку"
          />
        </div>
      )}

      {error && <p className="error">{error}</p>}

      <ul className="card-list">
        {cards.map((card) => (
          <li key={card.id}>
            <Card
              key={card.id}
              title={card.title}
              cardId={card.id}
              boardId={boardId}
              description={card.description}
              listId={listId}
              color={card.custom?.background}
              onCardUpdated={onListCreated}
            />
          </li>
        ))}
      </ul>

      <CreateCard boardId={boardId} listId={listId} onCardCreated={onListCreated} />
      <button className="delete-list-button" onClick={handleDeleteList}>
        🗑 Видалити список
      </button>
    </div>
  );
};

export default List;
