import React, { useEffect, useState } from 'react';
import { ICard, IListProps } from '../../../../common/interfaces/Interfaces';
import Card from '../Card/Card';
import CreateCard from '../CreateCard/CreateCard';
import './list.scss';
import { useEditableTitle } from '../Board/hooks/useEditableTitle';
import { useColorUpdate } from '../Board/hooks/useColorUpdate';
import { confirmAndDelete } from '../../../../utils/confirmAndDelete';
import { handleKeyDownFactory } from '../../../../utils/handleKeyDownFactory';
import { dndDrop } from '../../../../dragAndDrops/index';
import { getSlot } from '../../../../dragAndDrops/dndUtils';
import { openModal } from '../../../../featchers/store/modal-slice';
import { fetchBoard } from '../../../../featchers/store/board-slice'; // Імпорт thunk-дій з board-slice
import { RootState, AppDispatch } from '../../../../featchers/store/store'; // Типи для RootState і AppDispatch
import { connect } from 'react-redux';

interface ListProps extends IListProps {
  dispatch: AppDispatch;
  boardId: number;
}

const List: React.FC<ListProps> = ({
  title,
  cards,
  listId,
  boardId,
  onListCreated,
  color: initialColor,
  onCardMoved,
  onCardUpdated,
  allBoardCards,
  dispatch,
}) => {
  useEffect(() => {
    const ul = document.querySelector(`[data-list-id="${listId}"]`) as HTMLElement | null;
    if (ul) {
      dndDrop(ul, boardId, () => dispatch(fetchBoard(boardId.toString())));
    }

    // Cleanup опціональний
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }, [listId, boardId, dispatch]);
  const endpoint = `/board/${boardId}/list/${listId}`;

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

  const handleCardUpdated = () => {
    dispatch(fetchBoard(boardId.toString())); //Redux-Thunk
  };

  const handleOpenModal = (card: ICard) => {
    dispatch(openModal(card));
  };

  const sortedCards = [...cards].sort((a, b) => a.position - b.position);

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

      {/* Список карток */}
      <ul className="list-cards" data-list-id={listId}>
        {sortedCards.map((card) => (
          <Card
            key={card.id}
            title={card.title}
            card_id={card.id}
            board_id={boardId}
            description={card.description}
            list_id={listId}
            color={card.custom?.background}
            deadline={card.custom?.deadline}
            position={card.position}
            onCardUpdated={handleCardUpdated}
            onOpenModal={() => handleOpenModal(card)}
            setAllCards={undefined}
          />
        ))}
      </ul>

      <CreateCard boardId={boardId} listId={listId} onCardCreated={handleCardUpdated} />
      <button className="delete-list-button" onClick={handleDeleteList}>
        🗑 Видалити список
      </button>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(List);
