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
  step: 0,
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

    changeSelectAddOnsQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const target = state.addOnsOptions.find((item) => item!.id === id)
      if (target) {
        target.quantity = quantity
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

export const {
  addOption,
  removeOption,
  resetOption,
  setProductImg,
  setStep,
  setSelectedProduct,
  changeSelectAddOnsQuantity
} = selectedOptionsSlice.actions;

const store = configureStore({
  reducer: {
    selectedOptions: selectedOptionsSlice.reducer,
  },
});

export default store;
