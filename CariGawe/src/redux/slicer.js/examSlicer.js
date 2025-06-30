import { createSlice } from "@reduxjs/toolkit";

const examSlicer = createSlice({
    name: 'exam',
    initialState: {
        totalQuestion: 0,
        trueAnswer: 0,
        score: 0,
        examComplete: false,
        timer: false
    },
    reducers: {
        setTotalQuestion: (state, action) => {
            state.totalQuestion = action.payload;
        },
        setTrueAnswer: (state, action) => {
            state.trueAnswer = action.payload;
        },
        setScore: (state, action) => {
            state.score = action.payload;
        },
        setExamComplete: (state, action) => {
            state.examComplete = action.payload;
        },
        setTimer: (state, action) => {
            state.timer = action.payload;
        }
    }
})

export const { setTotalQuestion, setTrueAnswer, setExamComplete, setScore, setTimer } = examSlicer.actions;
export default examSlicer.reducer