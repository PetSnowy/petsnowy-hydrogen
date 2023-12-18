import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductVariantFragmentFragment } from 'storefrontapi.generated';

interface SelectedOptionsState {
  options: ProductVariantFragmentFragment[];
  productImg: string;
  step: number
}

const initialState: SelectedOptionsState = {
  options: [],
  productImg: '',
  step: 0
};

const selectedOptionsSlice = createSlice({
  name: 'selectedOptions',
  initialState,
  reducers: {
    addOption: (state, action) => {
      const { options } = state;
      if (state.step === 0) {
        options.push(action.payload)
        return
      }
      const findIndex = options.findIndex((option) => option.id === action.payload.id);
      if (findIndex === -1) {
        options.push(action.payload);
      } else {
        options[findIndex] = action.payload;
      }
    },
    setProductImg: (state, action) => {
      state.productImg = action.payload;
    },
    setStep: (state, action) => {
      state.step = action.payload;
    }
  },
});

export const { addOption, setProductImg, setStep } = selectedOptionsSlice.actions;

const store = configureStore({
  reducer: {
    selectedOptions: selectedOptionsSlice.reducer,
  },
});

export default store;
