import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductVariantFragmentFragment } from 'storefrontapi.generated';
import { AddOnsType } from '~/lib/type';

interface SelectedOptionsState {
  addOnsOptions: AddOnsType[];
  productImg: undefined;
  selectedProduct: ProductVariantFragmentFragment | null;
  step: number
}

const initialState: SelectedOptionsState = {
  addOnsOptions: [],
  selectedProduct: null,
  productImg: undefined,
  step: 0
};

const selectedOptionsSlice = createSlice({
  name: 'selectedOptions',
  initialState,
  reducers: {
    addOption: (state, action) => {
      const { addOnsOptions } = state;
      addOnsOptions.push(action.payload)
    },
    removeOption: (state, action) => {
      const { addOnsOptions } = state;
      const index = addOnsOptions.findIndex(addOns => addOns?.id === action.payload.id);
      addOnsOptions.splice(index, 1);
    },
    resetOption: (state) => {
      state.addOnsOptions = [];
    },

    setOptionQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const { addOnsOptions } = state
      let left = 0, right = addOnsOptions.length - 1;
      while (left < right) {
        if (addOnsOptions[left]!.id === id) {
          addOnsOptions[left]!.quantity = quantity
          break;
        }
        if (addOnsOptions[right]!.id === id) {
          addOnsOptions[right]!.quantity = quantity
          break;
        }
        left++
        right--
      }
      if (left === right && addOnsOptions[left]!.id === id) {
        addOnsOptions[left]!.quantity = quantity
      }
    },

    setProductImg: (state, action) => {
      state.productImg = action.payload;
    },
    setStep: (state, action) => {
      state.step = action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
  }
});

export const { addOption, removeOption, resetOption, setOptionQuantity, setProductImg, setStep, setSelectedProduct } = selectedOptionsSlice.actions;

const store = configureStore({
  reducer: {
    selectedOptions: selectedOptionsSlice.reducer,
  },
});

export default store;
