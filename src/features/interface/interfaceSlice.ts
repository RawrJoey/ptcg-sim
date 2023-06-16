import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ScreenType = 'lobby' | 'in-game';

interface InterfaceState {
  screen: ScreenType
};

const initialState: InterfaceState = {
  screen: 'lobby'
};

export const interfaceSlice = createSlice({
  name: 'interface',
  initialState,
  reducers: {
    changeScreen: (state, action: PayloadAction<ScreenType>) => {
      state.screen = action.payload;
    }
  }
});

// Action creators are generated for each case reducer function
export const { changeScreen } = interfaceSlice.actions

export default interfaceSlice.reducer;