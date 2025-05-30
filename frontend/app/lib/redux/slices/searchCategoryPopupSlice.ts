import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IAppState {
    isPopupOpened: boolean;
    loading: boolean;
    selectedPath: string[];
    currentPath: string[];
}

const initialState: IAppState = {
    loading: false,
    isPopupOpened: false,
    currentPath: [],
    selectedPath: [],
};

export const slice = createSlice({
    name: 'searchCategoryPopup',
    initialState,
    reducers: {
        openPopup(state) {
            state.isPopupOpened = true;
        },
        closePopup(state) {
            state.isPopupOpened = false;
            state.currentPath = [];
        },
        goToLevel(state, action: PayloadAction<string[]>) {
            state.currentPath = action.payload;
        },
        goBack(state) {
            state.currentPath.pop();
        },
        setCategory(state) {
            state.selectedPath = state.currentPath;
        }
    },
});
export const { openPopup, closePopup, goToLevel, goBack, setCategory } = slice.actions;

export default slice.reducer;
