// import { PayloadAction, createSlice } from '@reduxjs/toolkit';
// import { RootState } from '../app/store';
// import { IHeaderCategory } from '@/api/models';

// export interface CategoryState {
//   headerCategories?: IHeaderCategory[];
// }

// const initialState: CategoryState = {
//   headerCategories: [],
// };

// const categorySlice = createSlice({
//   name: 'category',
//   initialState,
//   reducers: {
//     setHeaderCategories: (state, action: PayloadAction<IHeaderCategory[]>) => {
//       state.headerCategories = action.payload;
//     },
//   },
// });

// export const { setHeaderCategories } = categorySlice.actions;
// export const headerCategoriesRedux = (state: RootState) => state.category.headerCategories;
// export default categorySlice.reducer;
