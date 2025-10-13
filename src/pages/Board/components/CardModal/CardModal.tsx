/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../featchers/hooks';
import { closeModal, openModal } from '../../../../featchers/store/modal-slice';
import { validateTitle } from '../../../../utils/validateTitle';
import ReactMarkdown from 'react-markdown';
import './cardModal.scss';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import debounce from 'lodash/debounce';
import { ICard } from '../../../../common/interfaces/Interfaces';
import remarkGfm from 'remark-gfm';
import api from '../../../../api/request';
import { updateCardThunk, copyCardThunk, archiveCardThunk } from '../../../../featchers/store/board-slice';
import {
  getCardEndpoint,
  navigateToBoard,
  navigateToBoardFromCard,
} from '../../../../common/services/cardModalServices';
import { handleCardColorChange } from '../../../../common/helpers/handleCardColorChange';

interface CardModalProps {
  onCardUpdated?: () => void;
}

const CardModal: React.FC<CardModalProps> = ({ onCardUpdated }) => {
  const dispatch = useAppDispatch();
  const modal = useAppSelector((s) => s.modal);
  const boardData = useAppSelector((s) => s.board.boardData);
  const { isOpen, card } = modal;
  const navigate = useNavigate();
  const { board_id, card_id } = useParams<{ board_id: string; card_id: string }>();
  const [title, setTitle] = useState(card?.title || '');
  const [description, setDescription] = useState(card?.description || '');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentColor, setCurrentColor] = useState(card?.custom?.background || '#ffffff');
  const [deadline, setDeadline] = useState(card?.custom?.deadline || '');
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descriptionTextareaRef = useRef<HTMLTextAreaElement>(null);

  // sync local state when modal card changes
  useEffect(() => {
    if (card) {
      // eslint-disable-next-line no-console
      console.log('CardModal useEffect: card updated:', {
        title: card.title,
        description: card.description,
        custom: card.custom,
      });
      setTitle(card.title || '');
      setDescription(card.description || '');
      setCurrentColor(card.custom?.background || '#ffffff');
      setDeadline(card.custom?.deadline || '');
      setError(null);
    }
  }, [card]);

  // when route contains card path and modal is closed -> fetch card and open modal
  useEffect(() => {
    if (board_id && card_id && !isOpen) {
      (async () => {
        try {
          const resp = await api.get(getCardEndpoint(board_id, card_id));
          console.log('CardModal fetched card:', {
            id: resp.data.id,
            title: resp.data.title,
            custom: resp.data.custom,
          });
          // Try to find card in boardData as fallback
          const boardCard = boardData?.lists?.flatMap((list) => list.cards).find((c) => String(c.id) === card_id);
          if (boardCard?.custom?.deadline && !resp.data.custom?.deadline) {
            dispatch(openModal({ ...resp.data, custom: { ...resp.data.custom, deadline: boardCard.custom.deadline } }));
          } else {
            dispatch(openModal(resp.data as ICard));
          }
        } catch (err) {
          toast.error('Помилка завантаження картки');
          navigate(navigateToBoard(board_id));
        }
      })();
    }
  }, [board_id, card_id, isOpen, dispatch, navigate, boardData]);

  // keyboard Escape behavior
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isEditingTitle || isEditingDescription) {
          setTitle(card?.title || '');
          setDescription(card?.description || '');
          setCurrentColor(card?.custom?.background || '#ffffff');
          setDeadline(card?.custom?.deadline || '');
          setIsEditingTitle(false);
          setIsEditingDescription(false);
        } else {
          dispatch(closeModal());
          navigate(card ? navigateToBoardFromCard(card) : navigateToBoard(board_id ?? ''));
        }
      }
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isEditingTitle, isEditingDescription, card, dispatch, navigate, board_id]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) titleInputRef.current.focus();
    if (isEditingDescription && descriptionTextareaRef.current) descriptionTextareaRef.current.focus();
  }, [isEditingTitle, isEditingDescription]);

  if (!isOpen || !card) return null;

  // debounced save -> dispatch thunk
  const debouncedSave = debounce(async () => {
    const { isValid, errorMessage } = validateTitle(title);
    if (!isValid) {
      setError(errorMessage);
      return;
    }

    try {
      setLoading(true);
      console.log('debouncedSave called with:', {
        title,
        description,
        list_id: card.list_id,
        custom: { background: currentColor, deadline },
      });
      await dispatch(
        updateCardThunk({
          boardId: String(card.board_id),
          cardId: String(card.id),
          data: { title, description, list_id: card.list_id, custom: { background: currentColor, deadline } },
        })
      ).unwrap();
      setError(null);
      toast.success('Картку збережено');
      // Update modal state with new data
      dispatch(
        openModal({
          ...card,
          title,
          description,
          custom: { ...card.custom, background: currentColor, deadline },
        })
      );
      dispatch(closeModal());
      navigate(navigateToBoardFromCard(card));
      if (onCardUpdated) onCardUpdated();
    } catch (err: any) {
      toast.error(err?.message || 'Помилка при збереженні картки');
      setError('Помилка при збереженні картки');
    } finally {
      setLoading(false);
    }
  }, 100);

  const handleCopyCard = async () => {
    try {
      setLoading(true);
      console.log('handleCopyCard called with:', {
        title: `${card.title} (Копія)`,
        description: card.description,
        list_id: card.list_id,
        position: card.position,
        custom: { background: currentColor, deadline },
      });
      await dispatch(
        copyCardThunk({
          boardId: String(card.board_id),
          data: {
            title: `${card.title} (Копія)`,
            description: card.description,
            list_id: card.list_id,
            position: card.position,
            custom: { background: currentColor, deadline },
          },
        })
      ).unwrap();
      toast.success('Картку скопійовано');
      dispatch(closeModal());
      navigate(navigateToBoardFromCard(card));
      if (onCardUpdated) onCardUpdated();
    } catch (err: any) {
      toast.error(err?.message || 'Помилка при копіюванні картки');
    } finally {
      setLoading(false);
    }
  };

  const handleArchiveCard = async () => {
    try {
      setLoading(true);
      console.log('handleArchiveCard called with:', {
        title,
        description,
        list_id: card.list_id,
        archived: true,
        custom: { background: currentColor, deadline },
      });
      await dispatch(
        archiveCardThunk({
          boardId: String(card.board_id),
          cardId: String(card.id),
          data: {
            title,
            description,
            list_id: card.list_id,
            archived: true,
            custom: { background: currentColor, deadline },
          },
        })
      ).unwrap();
      toast.success('Картку архівовано');
      dispatch(closeModal());
      navigate(navigateToBoardFromCard(card));
      if (onCardUpdated) onCardUpdated();
    } catch (err: any) {
      toast.error(err?.message || 'Помилка при архівації картки');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={() => {
        dispatch(closeModal());
        navigate(navigateToBoardFromCard(card));
      }}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="close-btn"
          onClick={() => {
            dispatch(closeModal());
            navigate(navigateToBoardFromCard(card));
          }}
        >
          ×
        </button>

        <div className="modal-header">
          <span>{card.title}🐻</span>
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError(null);
              }}
              onBlur={() => {
                setIsEditingTitle(false);
                debouncedSave();
              }}
            />
          ) : (
            <article onClick={() => setIsEditingTitle(true)}>{title}</article>
          )}
          {error && <p className="error">{error}</p>}
          <p className="list-info">У списку: {card.list_id || 'Невідомий список'}</p>
        </div>

        <div className="members">
          <h3>Учасники</h3>
          <div className="avatars">
            <span className="avatar red" />
            <span className="avatar green" />
            <span className="avatar blue" />
            <button
              className="join-btn"
              onClick={() => {
                toast.info('Приєднатись');
              }}
            >
              Приєднатися
            </button>
          </div>
        </div>

        <div className="description">
          <h3>Опис</h3>
          {isEditingDescription ? (
            <textarea
              ref={descriptionTextareaRef}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => {
                setIsEditingDescription(false);
                debouncedSave();
              }}
              placeholder="Введіть опис картки (підтримує Markdown)"
            />
          ) : (
            <div onClick={() => setIsEditingDescription(true)}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  ),
                }}
              >
                {description || 'Що сьогодні на думці...🐧'}
              </ReactMarkdown>
            </div>
          )}
        </div>

        <div className="deadline-section">
          <h3>Дедлайн</h3>
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => {
              setDeadline(e.target.value);
            }}
            onBlur={debouncedSave}
          />
        </div>

        <div className="actions">
          <div className="actions-group">
            <h3 className="actions-title">Дії</h3>

            <button onClick={handleCopyCard} disabled={loading}>
              {loading ? 'Копіювання...' : 'Копіювати'}
            </button>

            <button className="archive" onClick={handleArchiveCard} disabled={loading}>
              {loading ? 'Архівація...' : 'Архівувати'}
            </button>

            <button onClick={() => toast.info('Переміщення')}>Перемістити</button>
          </div>
          <div className="color-section">
            <h3>Змінити колір картки</h3>
            <input
              type="color"
              value={currentColor}
              onChange={(e) => {
                setCurrentColor(e.target.value);
                handleCardColorChange(e, card, dispatch, { title, description });
                if (onCardUpdated) onCardUpdated();
              }}
            />
          </div>

          <div className="modal-actions">
            <button onClick={debouncedSave} disabled={loading}>
              {loading ? 'Збереження...' : 'Зберегти'}
            </button>
            <button
              onClick={() => {
                dispatch(closeModal());
                navigate(navigateToBoardFromCard(card));
              }}
              disabled={loading}
            >
              Скасувати
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardModal;
