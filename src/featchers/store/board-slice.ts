/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { IBoardData, ICard } from '../../common/interfaces/Interfaces';
import { getBoard } from '../../common/services/boardServices';
import { copyCardRequest, archiveCardRequest, updateCardRequest } from '../../common/services/boardSliceServices';

export interface BoardState {
  boardData: IBoardData | null;
  loading: boolean;
  error: string | null;
}

const initialState: BoardState = {
  boardData: null,
  loading: false,
  error: null,
};

export interface UpdateCardPayload {
  boardId: string | number;
  cardId: string | number;
  data: Partial<ICard> & { archived?: boolean };
}

export interface CreateCardPayload {
  boardId: string | number;
  data: Partial<ICard>;
}

export interface MoveCardPayload {
  boardId: string | number;
  updatedCards: ICard[];
}

// Thunks
export const fetchBoard = createAsyncThunk<IBoardData, string>(
  'board/fetchBoard',
  async (boardId, { rejectWithValue }) => {
    try {
      const data = await getBoard(boardId);
      // eslint-disable-next-line no-console
      console.log('fetchBoard fulfilled with:', {
        cards: data.lists
          ?.flatMap((list) => list.cards)
          .map((c) => ({
            id: c.id,
            title: c.title,
            custom: c.custom,
          })),
      });
      return data;
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('fetchBoard error:', err);
      return rejectWithValue(err?.message || 'Помилка завантаження дошки');
    }
  }
);

export const updateCardThunk = createAsyncThunk<void, UpdateCardPayload>(
  'board/updateCardThunk',
  async ({ boardId, cardId, data }, { dispatch, rejectWithValue }) => {
    try {
      await updateCardRequest(boardId, cardId, data);
      await dispatch(fetchBoard(String(boardId))).unwrap();
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('updateCardThunk error:', err);
      return rejectWithValue(err?.message || 'Помилка оновлення картки');
    }
  }
);

export const copyCardThunk = createAsyncThunk<void, CreateCardPayload>(
  'board/copyCardThunk',
  async ({ boardId, data }, { dispatch, rejectWithValue }) => {
    try {
      await copyCardRequest(boardId, data); // import endpoint
      await dispatch(fetchBoard(String(boardId))).unwrap();
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Помилка копіювання картки');
    }
  }
);

export const archiveCardThunk = createAsyncThunk<void, UpdateCardPayload>(
  'board/archiveCardThunk',
  async ({ boardId, cardId, data }, { dispatch, rejectWithValue }) => {
    try {
      await archiveCardRequest(boardId, cardId, data); // import endpoint
      await dispatch(fetchBoard(String(boardId))).unwrap();
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Помилка архівації картки');
    }
  }
);

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoard.fulfilled, (state, action) => {
        state.loading = false;
        state.boardData = action.payload;
        state.error = null;
      })
      .addCase(fetchBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // updateCardThunk lifecycle (покажемо loading / error)
      .addCase(updateCardThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCardThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateCardThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // copy
      .addCase(copyCardThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(copyCardThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(copyCardThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // archive
      .addCase(archiveCardThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(archiveCardThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(archiveCardThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default boardSlice.reducer;
