// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './modal-slice';
import boardReducer from './board-slice';

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    board: boardReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
