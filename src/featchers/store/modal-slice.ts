import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICard } from '../../common/interfaces/Interfaces';
/* import { RootState } from './store'; */

export interface ModalState {
  isOpen: boolean;
  card: ICard | null;
}

const initialState: ModalState = {
  isOpen: false,
  card: null,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<ICard>) => {
      state.isOpen = true;
      state.card = action.payload;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.card = null;
    },
    updateCard: (state, action: PayloadAction<Partial<ICard>>) => {
      if (state.card) {
        state.card = { ...state.card, ...action.payload };
      }
    },
  },
});

export const { openModal, closeModal, updateCard } = modalSlice.actions;
export default modalSlice.reducer;
