import { createSlice } from '@reduxjs/toolkit';

const navbarSlicer = createSlice({
    name: 'navbar',
    initialState: {
        page: 0,
    },
    reducers: {
        setPage: (state, action) => {
            state.page = action.payload;
        },
    }
});

export const { setPage } = navbarSlicer.actions;
export default navbarSlicer.reducer;
