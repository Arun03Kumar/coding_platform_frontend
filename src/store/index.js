import { configureStore } from "@reduxjs/toolkit";
import problemSlice from "./problemSlice";
import runOutputSlice from "./runOutputSlice";
import createProblemSlice from "./createProblemSlice";

export const store = configureStore({
  reducer: {
    problem: problemSlice,
    runOutput: runOutputSlice,
    createProblem: createProblemSlice,
  },
});
