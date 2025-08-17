import React, { useEffect, useState } from 'react';
import { ICard } from '../../../../common/interfaces/ICard';
import { IListProps } from '../../../../common/interfaces/IListProps';
import Card from '../Card/Card';
import CreateCard from '../CreateCard/CreateCard';
import './list.scss';
import { useEditableTitle } from '../Board/hooks/useEditableTitle';
import { useColorUpdate } from '../Board/hooks/useColorUpdate';
import { confirmAndDelete } from '../../../../utils/confirmAndDelete';
import { handleKeyDownFactory } from '../../../../utils/handleKeyDownFactory';
import { onDragEnter, onDrop } from '../../../../dragAndDrops/dndHandlers';

function List({ title, cards, listId, boardId, onListCreated, color: initialColor }: IListProps): React.ReactElement {
  const endpoint = `/board/${boardId}/list/${listId}`;
  const [allCards, setAllCards] = useState<ICard[]>(cards);

  useEffect(() => {
    setAllCards(cards);
  }, [cards]);

  const sortedCards = [...allCards].sort((a, b) => a.position - b.position);

  const { color, handleColorChange } = useColorUpdate(initialColor || '#fffacd', endpoint);

  const { isEditing, editedTitle, error, setIsEditing, setEditedTitle, setError, handleUpdateTitle } = useEditableTitle(
    title,
    endpoint,
    onListCreated
  );

  const handleKeyDown = handleKeyDownFactory(handleUpdateTitle, () => setIsEditing(false));

  const handleDeleteList = async () => {
    await confirmAndDelete('Ви впевнені, що хочете видалити список?', endpoint, onListCreated);
  };

  return (
    <div className="list" style={{ background: color }}>
      <div className="list-header">
        {isEditing ? (
          <input
            type="text"
            autoFocus
            value={editedTitle}
            onChange={(e) => {
              setEditedTitle(e.target.value);
              setError(null);
            }}
            onBlur={handleUpdateTitle}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <h2
            className="list-title"
            onClick={() => {
              setIsEditing(true);
              setEditedTitle(title);
            }}
          >
            {title}
          </h2>
        )}
        <input
          type="color"
          value={color}
          onChange={handleColorChange}
          className="color-picker"
          title="Обрати колір списку"
        />
        {error && <p className="error">{error}</p>}
      </div>

      <ul
        className="list-cards"
        data-list-id={listId}
        onDragOver={(e) => onDragEnter(e.nativeEvent, e.currentTarget)}
        onDrop={(e) => onDrop(e.nativeEvent, e.currentTarget, boardId, allCards, setAllCards)}
      >
        {sortedCards.map((card) => (
          <Card
            key={card.id}
            title={card.title}
            cardId={card.id}
            boardId={boardId}
            description={card.description}
            listId={listId}
            color={card.custom?.background}
            position={card.position}
            onCardUpdated={onListCreated}
          />
        ))}
      </ul>

      <CreateCard boardId={boardId} listId={listId} onCardCreated={onListCreated} />
      <button className="delete-list-button" onClick={handleDeleteList}>
        🗑 Видалити список
      </button>
    </div>
  );
}

export default List;
