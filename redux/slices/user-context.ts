import { IUserContext } from "@/app/base/models";
import { RootState } from "../app/store";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface UserContextState {
  context?: IUserContext;
}

const initialState: UserContextState = {
  context: Object.assign({}),
};

const userContextSlice = createSlice({
  name: "user-context",
  initialState,
  reducers: {
    setUserContext: (state, action: PayloadAction<IUserContext>) => {
      if (action.payload) {
        state.context = action.payload;
      }
    },
  },
});

export const { setUserContext } = userContextSlice.actions;
export const userContextRedux = (state: RootState) => state.userContext.context;
export default userContextSlice.reducer;
