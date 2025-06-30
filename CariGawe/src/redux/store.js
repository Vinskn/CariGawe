import { configureStore } from '@reduxjs/toolkit';
import examSlicer from './slicer.js/examSlicer';
import navbarSlicer from './slicer.js/navbarSlicer';

export const store = configureStore({
    reducer: {
        exam: examSlicer,
        navbar: navbarSlicer
    }
});
