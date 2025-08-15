import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for running code
export const runCode = createAsyncThunk(
  "runOutput/runCode",
  async ({ id, userCode, language }) => {
    const payload = {
      userId: "anonymous",
      problemId: id,
      code: userCode,
      language,
    };

    const res = await fetch(`http://localhost:3000/api/v1/submission/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return data;
  }
);

// Async thunk for submitting code
export const submitCode = createAsyncThunk(
  "runOutput/submitCode",
  async ({ id, userCode, language }) => {
    const API_BASE =
      process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001/api/v1";
    const res = await fetch(`${API_BASE}/problems/${id}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: userCode, language }),
    });

    const data = await res.json();
    return data;
  }
);

const runOutputSlice = createSlice({
  name: "runOutput",
  initialState: {
    data: null,
    isRunning: false,
    isSubmitting: false,
    outputTab: "compile",
    error: null,
  },
  reducers: {
    setOutputTab: (state, action) => {
      state.outputTab = action.payload;
    },
    setRunOutput: (state, action) => {
      state.data = action.payload;
    },
    clearRunOutput: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Run code cases
      .addCase(runCode.pending, (state) => {
        state.isRunning = true;
        state.data = null;
        state.error = null;
      })
      .addCase(runCode.fulfilled, (state, action) => {
        state.isRunning = false;
        state.data = action.payload;
      })
      .addCase(runCode.rejected, (state, action) => {
        state.isRunning = false;
        state.error = action.error.message;
        state.data = { error: action.error.message };
      })
      // Submit code cases
      .addCase(submitCode.pending, (state) => {
        state.isSubmitting = true;
        state.data = null;
        state.error = null;
      })
      .addCase(submitCode.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.data = action.payload;
      })
      .addCase(submitCode.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.error.message;
        state.data = { error: action.error.message };
      });
  },
});

export const { setOutputTab, setRunOutput, clearRunOutput } =
  runOutputSlice.actions;
export default runOutputSlice.reducer;
