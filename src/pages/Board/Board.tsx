import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import List from './components/List/List';
import CreateList from './components/CreateList/CreateList';
import CardModal from './components/CardModal/CardModal';
import { useColorUpdate } from '../Board/components/Board/hooks/useColorUpdate';
import { useEditableTitle } from '../Board/components/Board/hooks/useEditableTitle';
import { confirmAndDelete } from '../../utils/confirmAndDelete';
import { handleKeyDownFactory } from '../../utils/handleKeyDownFactory';
import { useAppDispatch, useAppSelector } from '../../featchers/hooks';
import { fetchBoard } from '../../featchers/store/board-slice';
import { navigateToHome, navigateToBoard } from '../../common/services/boardServices';
import './board.scss';

function Board(): React.ReactElement {
  const { board_id, card_id } = useParams<{ board_id: string; card_id?: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const boardData = useAppSelector((state) => state.board.boardData);
  const modalState = useAppSelector((state) => state.modal);

  useEffect(() => {
    //upload board
    if (board_id) {
      dispatch(fetchBoard(board_id));
    } else {
      navigate(navigateToHome());
    }
  }, [board_id, dispatch, navigate]);

  const { color, handleColorChange } = useColorUpdate(
    boardData?.custom?.background || '#ffffff',
    navigateToBoard(board_id!),
    () => dispatch(fetchBoard(board_id!)), // thunk
    boardData?.title
  );

  const { isEditing, editedTitle, error, setIsEditing, setEditedTitle, setError, handleUpdateTitle } = useEditableTitle(
    boardData?.title || '',
    navigateToBoard(board_id!),
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    () => dispatch(fetchBoard(board_id!)) // thunk
  );

  const handleKeyDown = handleKeyDownFactory(handleUpdateTitle, () => setIsEditing(false));

  const handleDeleteBoard = async () => {
    await confirmAndDelete('Ви впевнені, що хочете видалити дошку?', navigateToBoard(board_id!), () =>
      navigate(navigateToHome())
    );
  };

  if (!boardData || !boardData.lists) {
    return <p>Loading...</p>;
  }

  return (
    <div
      className="board-wrapper"
      style={{
        backgroundColor: boardData?.custom?.background || '#ffffff',
        minHeight: '100vh',
      }}
    >
      <div className="board-header">
        <h4>Вітаємо вас на дошці №{board_id}</h4>
        <button className="to-home-button" onClick={() => navigate(navigateToHome())}>
          ⇐ Додому
        </button>
        <div className="board-title">
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
            <h1
              onClick={() => {
                setIsEditing(true);
                setEditedTitle(boardData.title);
              }}
            >
              {boardData.title}
            </h1>
          )}
          <input
            type="color"
            value={color}
            onChange={handleColorChange}
            className="color-picker"
            title="Обрати колір дошки"
          />
          {error && <p className="error">{error}</p>}
        </div>
      </div>

      <div className="board-container">
        <div className="lists">
          {boardData.lists.map((list) => (
            <List
              key={list.id}
              title={list.title}
              cards={list.cards}
              boardId={Number(board_id)}
              listId={list.id}
              color={list.custom?.background || '#fffacd'}
              onListCreated={() => dispatch(fetchBoard(board_id!))}
              onCardMoved={() => dispatch(fetchBoard(board_id!))}
              onCardUpdated={() => dispatch(fetchBoard(board_id!))}
              allBoardCards={boardData.lists.flatMap((l) => l.cards)}
            />
          ))}
          {board_id && <CreateList boardId={Number(board_id)} onListCreated={() => dispatch(fetchBoard(board_id!))} />}
        </div>
        <button className="delete-board-button" onClick={handleDeleteBoard}>
          🗑 Видалити дошку
        </button>
      </div>

      {modalState.isOpen && card_id && <CardModal />}
    </div>
  );
}

export default Board;
